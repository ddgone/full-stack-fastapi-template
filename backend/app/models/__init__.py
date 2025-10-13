# 导入所有模型类，确保它们被加载并注册到 SQLModel.metadata
# 只保留 table=True 的核心模型（供 Alembic 加载元数据）
from app.models.users import User
from app.models.items import Item
from app.models.tasks import Task

# 其他非 table 类（如 UserCreate、TaskPublic 等）不再在这里导出