import uuid

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel
from datetime import datetime, timezone
from typing import Optional
from enum import Enum


# ==================== 枚举类型定义 ====================
class TaskStatus(str, Enum):
    """任务状态枚举"""
    PENDING = "pending"  # 待处理
    IN_PROGRESS = "in_progress"  # 进行中
    COMPLETED = "completed"  # 已完成


class TaskPriority(str, Enum):
    """任务优先级枚举"""
    LOW = "low"  # 低优先级
    MEDIUM = "medium"  # 中优先级
    HIGH = "high"  # 高优先级


# ==================== 关联表模型 ====================
# 任务协作者关联表 - 多对多关系表
class TaskCollaboratorLink(SQLModel, table=True):
    __tablename__ = "task_collaborator_association"
    task_id: uuid.UUID = Field(default=None, foreign_key="task.id", primary_key=True)
    user_id: uuid.UUID = Field(default=None, foreign_key="user.id", primary_key=True)


# 项目协作者关联表 - 多对多关系表
class ItemCollaboratorLink(SQLModel, table=True):
    __tablename__ = "item_collaborator_association"
    item_id: uuid.UUID = Field(default=None, foreign_key="item.id", primary_key=True)
    user_id: uuid.UUID = Field(default=None, foreign_key="user.id", primary_key=True)


# ==================== 用户相关模型 ====================
# 共享属性 - 定义用户的基本字段
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)  # 用户邮箱，唯一且建立索引，最大长度255
    is_active: bool = True  # 用户是否激活，默认为True
    is_superuser: bool = False  # 是否为超级用户，默认为False
    full_name: str | None = Field(default=None, max_length=255)  # 用户全名，最大长度255


# 创建时需通过 API 接收的属性
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)  # 用户密码，长度8-128字符


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)  # 注册邮箱，最大长度255
    password: str = Field(min_length=8, max_length=128)  # 注册密码，长度8-128字符
    full_name: str | None = Field(default=None, max_length=255)  # 用户全名，最大长度255


# 更新时需通过 API 接收的属性，所有属性均为可选
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # 可选的邮箱更新
    password: str | None = Field(default=None, min_length=8, max_length=128)  # 可选的密码更新


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)  # 用户自己更新全名
    email: EmailStr | None = Field(default=None, max_length=255)  # 用户自己更新邮箱


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=128)  # 当前密码，用于验证
    new_password: str = Field(min_length=8, max_length=128)  # 新密码，长度8-128字符


# 数据库模型，生成user表
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)  # 主键，使用UUID
    hashed_password: str = Field(max_length=255)  # 存储哈希后的密码
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)  # 与Item的关系，级联删除

    # 添加新关系
    owned_tasks: list["Task"] = Relationship(back_populates="owner")

    collaborated_items: list["Item"] = Relationship(
        back_populates="collaborators",
        link_model=ItemCollaboratorLink
    )
    collaborated_tasks: list["Task"] = Relationship(
        back_populates="collaborators",
        link_model=TaskCollaboratorLink
    )


# 通过 API 返回的属性，id 始终为必填项
class UserPublic(UserBase):
    id: uuid.UUID  # 公开的用户信息，包含用户ID


class UsersPublic(SQLModel):
    data: list[UserPublic]  # 用户列表数据
    count: int  # 用户总数


# ==================== 项目相关模型 ====================
# 共享属性
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)  # 项目标题，长度1-255字符
    description: str | None = Field(default=None, max_length=255)  # 项目描述，最多255字符


# 创建项目时接收的属性
class ItemCreate(ItemBase):
    pass


# 更新项目时接收的属性
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# 数据库模型，生成item表，用于保存项目信息
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)  # 主键，使用UUID
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"  # 外键关联用户，级联删除
    )
    owner: Optional["User"] = Relationship(back_populates="items")  # 与User模型的关系
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))  # 创建时间，默认为当前UTC时间
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={
            "onupdate": lambda: datetime.now(timezone.utc),  # 更新时自动更新时间戳
        }
    )

    # 关系定义
    tasks: list["Task"] = Relationship(back_populates="item")  # 与Task模型关系

    # 协作者关系 - 多对多
    collaborators: list["User"] = Relationship(
        back_populates="collaborated_items",
        link_model=ItemCollaboratorLink
    )


# 通过 API 返回的属性，id 始终必需
class ItemPublic(ItemBase):
    id: uuid.UUID  # 项目ID
    owner_id: uuid.UUID  # 所有者ID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]  # 项目列表数据
    count: int  # 项目总数


# ==================== 任务相关模型 ====================
# 共享属性 - 定义了任务的基本字段
class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)  # 任务标题，长度1-255字符
    description: str | None = Field(default=None, max_length=1000)  # 任务描述，最多1000字符
    status: TaskStatus = Field(default=TaskStatus.PENDING, index=True)  # 任务状态，默认为待处理，并建立索引
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM, index=True)  # 任务优先级，默认为中，并建立索引
    due_date: datetime | None = None  # 截止日期


# 用于创建任务的模型
class TaskCreate(TaskBase):
    pass


# 用于更新任务的模型，所有字段都是可选的
class TaskUpdate(TaskBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1000)
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    due_date: datetime | None = None


# 任务表task - 数据库实际存储的模型
class Task(TaskBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)  # 主键，使用UUID
    item_id: uuid.UUID = Field(foreign_key="item.id")  # 关联的项目ID
    owner_id: uuid.UUID = Field(foreign_key="user.id", index=True)  # 任务所有者ID，并建立索引
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))  # 创建时间，默认为当前UTC时间
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={
            "onupdate": lambda: datetime.now(timezone.utc),  # 更新时自动更新时间戳
        }
    )

    # 关系定义
    item: "Item" = Relationship(back_populates="tasks")  # 与Item模型的关系
    owner: "User" = Relationship(back_populates="owned_tasks")  # 与User模型的关系（任务所有者）

    # 协作者关系 - 多对多
    collaborators: list["User"] = Relationship(
        back_populates="collaborated_tasks",
        link_model=TaskCollaboratorLink
    )


# 用于API响应的公开任务模型
class TaskPublic(TaskBase):
    id: uuid.UUID  # 任务ID
    item_id: uuid.UUID  # 所属项目ID
    owner_id: uuid.UUID  # 所有者ID
    created_at: datetime  # 创建时间
    updated_at: datetime  # 更新时间
    collaborators: list["UserPublic"] = []  # 协作者列表


# 任务列表响应模型
class TasksPublic(SQLModel):
    data: list[TaskPublic]  # 任务列表数据
    count: int  # 任务总数


# ==================== 通用模型 ====================
# 通用消息类 - 用于返回简单的消息响应
class Message(SQLModel):
    message: str  # 消息内容


# 包含访问令牌的 JSON 负载 - 用于认证响应
class Token(SQLModel):
    access_token: str  # JWT访问令牌
    token_type: str = "bearer"  # 令牌类型，默认为bearer


# JWT 令牌内容 - 用于解析JWT令牌中的载荷信息
class TokenPayload(SQLModel):
    sub: str | None = None  # 主题(用户ID)，可为None


# 新密码设置模型 - 用于重置密码功能
class NewPassword(SQLModel):
    token: str  # 重置密码令牌
    new_password: str = Field(min_length=8, max_length=128)  # 新密码，长度8-128字符
