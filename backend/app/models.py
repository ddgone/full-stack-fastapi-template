import uuid

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel
from datetime import datetime
from typing import Optional
from enum import Enum

from app.utils import get_beijing_time


# ==================== 枚举类型定义 ====================
class TaskStatus(str, Enum):
    """任务状态枚举"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class TaskPriority(str, Enum):
    """任务优先级枚举"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


# ==================== 关联表模型 ====================
# 任务协作者关联表 - 多对多关系表
class TaskCollaboratorLink(SQLModel, table=True):
    __tablename__ = "task_collaborator_association"
    task_id: uuid.UUID = Field(default=None, foreign_key="task.id", primary_key=True)
    user_id: uuid.UUID = Field(default=None, foreign_key="user.id", primary_key=True)


# 项目协作者关联表 - 多对多关系表
class ProjectCollaboratorLink(SQLModel, table=True):
    __tablename__ = "project_collaborator_association"
    project_id: uuid.UUID = Field(default=None, foreign_key="project.id", primary_key=True)
    user_id: uuid.UUID = Field(default=None, foreign_key="user.id", primary_key=True)


# ==================== 用户相关模型 ====================
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255, description="用户邮箱")
    is_active: bool = Field(default=True, description="账户激活状态")
    is_superuser: bool = Field(default=False, description="管理员权限")
    full_name: str | None = Field(default=None, max_length=255, description="用户全名")


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128, description="用户密码")


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255, description="注册邮箱")
    password: str = Field(min_length=8, max_length=128, description="注册密码")
    full_name: str | None = Field(default=None, max_length=255, description="用户全名")


class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255, description="更新邮箱")
    password: str | None = Field(default=None, min_length=8, max_length=128, description="更新密码")


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255, description="更新全名")
    email: EmailStr | None = Field(default=None, max_length=255, description="更新邮箱")


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=128, description="当前密码")
    new_password: str = Field(min_length=8, max_length=128, description="新密码")


# 数据库模型，生成user表
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, description="用户ID")
    hashed_password: str = Field(max_length=255, description="密码哈希值")
    projects: list["Project"] = Relationship(back_populates="owner", cascade_delete=True)  # 与 Project 的关系，级联删除
    owned_tasks: list["Task"] = Relationship(back_populates="owner")  # 与 Task 的关系

    # 协作者关系 - 多对多
    collaborated_projects: list["Project"] = Relationship(
        back_populates="collaborators",
        link_model=ProjectCollaboratorLink
    )
    collaborated_tasks: list["Task"] = Relationship(
        back_populates="collaborators",
        link_model=TaskCollaboratorLink
    )


class UserPublic(UserBase):
    id: uuid.UUID = Field(description="用户ID")


class UsersPublic(SQLModel):
    data: list[UserPublic] = Field(description="用户列表")
    count: int = Field(description="用户总数")


# ==================== 项目相关模型 ====================
class ProjectBase(SQLModel):
    title: str = Field(min_length=1, max_length=255, description="项目标题")
    description: str | None = Field(default=None, max_length=255, description="项目描述")


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    title: str | None = Field(default=None, min_length=1, max_length=255, description="更新标题")


# 数据库模型，生成project表
class Project(ProjectBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, description="项目ID")
    owner_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE", description="所有者ID")
    owner: Optional["User"] = Relationship(back_populates="projects")  # 与User模型的关系
    created_at: datetime = Field(default_factory=get_beijing_time, description="创建时间")
    updated_at: datetime = Field(
        default_factory=get_beijing_time,
        sa_column_kwargs={"onupdate": get_beijing_time},
        description="更新时间"
    )
    tasks: list["Task"] = Relationship(back_populates="project")  # 与 Task 的关系
    # 协作者关系 - 多对多
    collaborators: list["User"] = Relationship(
        back_populates="collaborated_projects",
        link_model=ProjectCollaboratorLink
    )


class ProjectPublic(ProjectBase):
    id: uuid.UUID = Field(description="项目ID")
    owner_id: uuid.UUID = Field(description="所有者ID")


class ProjectsPublic(SQLModel):
    data: list[ProjectPublic] = Field(description="项目列表")
    count: int = Field(description="项目总数")


# ==================== 任务相关模型 ====================
class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255, description="任务标题")
    description: str | None = Field(default=None, max_length=1000, description="任务描述")
    status: TaskStatus = Field(default=TaskStatus.PENDING, index=True, description="任务状态，默认为待处理")
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM, index=True, description="任务优先级，默认为中")
    due_date: datetime | None = Field(default=None, description="截止日期")


class TaskCreate(TaskBase):
    pass


class TaskUpdate(TaskBase):
    title: str | None = Field(default=None, min_length=1, max_length=255, description="更新标题")
    description: str | None = Field(default=None, max_length=1000, description="更新描述")
    status: TaskStatus | None = Field(default=None, description="更新状态")
    priority: TaskPriority | None = Field(default=None, description="更新优先级")
    due_date: datetime | None = Field(default=None, description="更新截止日期")


# 任务表 task
class Task(TaskBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, description="任务ID")
    project_id: uuid.UUID = Field(foreign_key="project.id", description="所属项目ID")
    owner_id: uuid.UUID = Field(foreign_key="user.id", index=True, description="所有者ID")
    created_at: datetime = Field(default_factory=get_beijing_time, description="创建时间")
    updated_at: datetime = Field(
        default_factory=get_beijing_time,
        sa_column_kwargs={"onupdate": get_beijing_time},
        description="更新时间"
    )
    project: "Project" = Relationship(back_populates="tasks")  # 与 Project 的关系
    owner: "User" = Relationship(back_populates="owned_tasks")  # 与 User 的关系
    # 协作者关系 - 多对多
    collaborators: list["User"] = Relationship(
        back_populates="collaborated_tasks",
        link_model=TaskCollaboratorLink
    )


class TaskPublic(TaskBase):
    id: uuid.UUID = Field(description="任务ID")
    project_id: uuid.UUID = Field(description="所属项目ID")
    owner_id: uuid.UUID = Field(description="所有者ID")
    created_at: datetime = Field(description="创建时间")
    updated_at: datetime = Field(description="更新时间")
    collaborators: list["UserPublic"] = Field(default=[], description="协作者列表")


class TasksPublic(SQLModel):
    data: list[TaskPublic] = Field(description="任务列表")
    count: int = Field(description="任务总数")


# ==================== 通用模型 ====================
# 通用消息类 - 用于返回简单的消息响应
class Message(SQLModel):
    message: str = Field(description="操作消息")


# 包含访问令牌的 JSON 负载 - 用于认证响应
class Token(SQLModel):
    access_token: str = Field(description="JWT访问令牌")
    token_type: str = Field(default="bearer", description="令牌类型")


# JWT 令牌内容 - 用于解析JWT令牌中的载荷信息
class TokenPayload(SQLModel):
    sub: str | None = Field(default=None, description="用户标识")


# 新密码设置模型 - 用于重置密码功能
class NewPassword(SQLModel):
    token: str = Field(description="密码重置令牌")
    new_password: str = Field(min_length=8, max_length=128, description="新密码")
