import uuid

from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING
from enum import Enum

from app.models.associations import task_collaborator_association

# 注意：由于 PyCharm 2025.2 对字符串引用的支持存在 bug
# 使用 TYPE_CHECKING 导入作为临时解决方案
if TYPE_CHECKING:
    from app.models.users import User, UserPublic
    from app.models.items import Item


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
        link_model=task_collaborator_association
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
