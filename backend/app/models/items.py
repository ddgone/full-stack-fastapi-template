# items相关模型
import uuid
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from typing import TYPE_CHECKING

from app.models.associations import item_collaborator_association

# 注意：由于 PyCharm 2025.2 对字符串引用的支持存在 bug
# 使用 TYPE_CHECKING 导入作为临时解决方案
if TYPE_CHECKING:
    from app.models.users import User
    from app.models.tasks import Task


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
    owner: "User" | None = Relationship(back_populates="items")  # 与User模型的关系
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
        link_model=item_collaborator_association
    )


# 通过 API 返回的属性，id 始终必需
class ItemPublic(ItemBase):
    id: uuid.UUID  # 项目ID
    owner_id: uuid.UUID  # 所有者ID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]  # 项目列表数据
    count: int  # 项目总数
