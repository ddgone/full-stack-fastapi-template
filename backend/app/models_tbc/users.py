# # users相关模型
# from __future__ import annotations
# import uuid
# from pydantic import EmailStr
# from sqlmodel import SQLModel, Field, Relationship
# from typing import TYPE_CHECKING, List
# from app.models.associations import ItemCollaboratorLink, TaskCollaboratorLink
#
# # 注意：由于 PyCharm 2025.2 对字符串引用的支持存在 bug
# # 使用 TYPE_CHECKING 导入作为临时解决方案
# if TYPE_CHECKING:
#     from app.models.items import Item
#     from app.models.tasks import Task
#
#
#
# # 共享属性 - 定义用户的基本字段
# class UserBase(SQLModel):
#     email: EmailStr = Field(unique=True, index=True, max_length=255)  # 用户邮箱，唯一且建立索引，最大长度255
#     is_active: bool = True  # 用户是否激活，默认为True
#     is_superuser: bool = False  # 是否为超级用户，默认为False
#     full_name: str | None = Field(default=None, max_length=255)  # 用户全名，最大长度255
#
#
# # 创建时需通过 API 接收的属性
# class UserCreate(UserBase):
#     password: str = Field(min_length=8, max_length=40)  # 用户密码，长度8-40字符
#
#
# class UserRegister(SQLModel):
#     email: EmailStr = Field(max_length=255)  # 注册邮箱，最大长度255
#     password: str = Field(min_length=8, max_length=40)  # 注册密码，长度8-40字符
#     full_name: str | None = Field(default=None, max_length=255)  # 用户全名，最大长度255
#
#
# # 更新时需通过 API 接收的属性，所有属性均为可选
# class UserUpdate(UserBase):
#     email: EmailStr | None = Field(default=None, max_length=255)  # 可选的邮箱更新
#     password: str | None = Field(default=None, min_length=8, max_length=40)  # 可选的密码更新
#
#
# class UserUpdateMe(SQLModel):
#     full_name: str | None = Field(default=None, max_length=255)  # 用户自己更新全名
#     email: EmailStr | None = Field(default=None, max_length=255)  # 用户自己更新邮箱
#
#
# class UpdatePassword(SQLModel):
#     current_password: str = Field(min_length=8, max_length=40)  # 当前密码，用于验证
#     new_password: str = Field(min_length=8, max_length=40)  # 新密码，长度8-40字符
#
#
# # 数据库模型，生成user表
# class User(UserBase, table=True):
#     id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)  # 主键，使用UUID
#     hashed_password: str  # 存储哈希后的密码
#     items: List["Item"] = Relationship(
#         back_populates="owner",
#         sa_relationship_kwargs={"cascade": "all, delete-orphan"}
#     )  # 与Item的关系，级联删除
#
#     # 添加新关系
#     owned_tasks: List["Task"] = Relationship(back_populates="owner")
#
#     # collaborated_items: List["Item"] = Relationship(
#     #     back_populates="collaborators",
#     #     link_model=ItemCollaboratorLink
#     # )
#     # collaborated_tasks: List["Task"] = Relationship(
#     #     back_populates="collaborators",
#     #     link_model=TaskCollaboratorLink
#     # )
#
#     # # 补充与任务关联表的反向关系
#     # task_collaborator_links: list["TaskCollaboratorLink"] = Relationship(back_populates="user")
#     # # 补充与项目关联表的反向关系
#     # item_collaborator_links: list["ItemCollaboratorLink"] = Relationship(back_populates="user")
#
#
# # 通过 API 返回的属性，id 始终为必填项
# class UserPublic(UserBase):
#     id: uuid.UUID  # 公开的用户信息，包含用户ID
#
#
# class UsersPublic(SQLModel):
#     data: list[UserPublic]  # 用户列表数据
#     count: int  # 用户总数
