# # 导入所有模型类，确保它们被加载并注册到 SQLModel.metadata
# # 只保留 table=True 的核心模型（供 Alembic 加载元数据）
# # 用于生成数据库迁移，这个导入不能删除
# from sqlmodel import SQLModel
# __all__ = ["SQLModel"]
#
# from app.models.associations import TaskCollaboratorLink, ItemCollaboratorLink
# from app.models.users import User
# from app.models.items import Item
# from app.models.tasks import Task
#
# __all__.extend([
#     "User",
#     "Item",
#     "Task",
#     "TaskCollaboratorLink",
#     "ItemCollaboratorLink"
# ])
#
# # 其他非 table 类（如 UserCreate、TaskPublic 等）不再在这里导出