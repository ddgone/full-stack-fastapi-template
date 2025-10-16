# # 关联表
# from __future__ import annotations
# import uuid
#
# from sqlmodel import SQLModel, Field, Relationship
# from typing import TYPE_CHECKING
#
# # 注意：由于 PyCharm 2025.2 对字符串引用的支持存在 bug
# # 使用 TYPE_CHECKING 导入作为临时解决方案
# if TYPE_CHECKING:
#     from app.models.items import Item
#     from app.models.tasks import Task
#     from app.models.users import User
#
#
#
# # 任务协作者关联表 - 多对多关系表
# class TaskCollaboratorLink(SQLModel, table=True):
#     __tablename__ = "task_collaborator_association"
#
#     task_id: uuid.UUID = Field(
#         default=None,
#         foreign_key="task.id",
#         primary_key=True
#     )
#     user_id: uuid.UUID = Field(
#         default=None,
#         foreign_key="user.id",
#         primary_key=True
#     )
#
#     # # 可选：添加关系引用以便于查询
#     # task: "Task" = Relationship(back_populates="collaborator_links")
#     # user: "User" = Relationship(back_populates="task_collaborator_links")
#
#
# # 项目协作者关联表 - 多对多关系表
# class ItemCollaboratorLink(SQLModel, table=True):
#     __tablename__ = "item_collaborator_association"
#
#     item_id: uuid.UUID = Field(
#         default=None,
#         foreign_key="item.id",
#         primary_key=True
#     )
#     user_id: uuid.UUID = Field(
#         default=None,
#         foreign_key="user.id",
#         primary_key=True
#     )
#
#     # # 可选：添加关系引用以便于查询
#     # item: "Item" = Relationship(back_populates="collaborator_links")
#     # user: "User" = Relationship(back_populates="item_collaborator_links")
