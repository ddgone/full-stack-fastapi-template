# 关联表
from sqlmodel import (
    SQLModel,
    Table,
    Column,
    ForeignKey
)

# 任务协作者关联表 - 多对多关系表
task_collaborator_association = Table(
    "task_collaborator_association",  # 数据库表名
    SQLModel.metadata,  # 共享SQLModel的元数据
    Column("task_id", ForeignKey("task.id"), primary_key=True),  # 任务ID，作为主键之一
    Column("user_id", ForeignKey("user.id"), primary_key=True)  # 用户ID，作为主键之一
)

# 项目协作者关联表 - 多对多关系表
item_collaborator_association = Table(
    "item_collaborator_association",
    SQLModel.metadata,
    Column("item_id", ForeignKey("item.id"), primary_key=True),  # 项目ID，作为主键之一
    Column("user_id", ForeignKey("user.id"), primary_key=True),  # 用户ID，作为主键之一
)