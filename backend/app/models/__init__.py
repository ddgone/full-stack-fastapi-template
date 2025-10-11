# 导入所有模型类，确保它们被加载并注册到 SQLModel.metadata
from app.models.users import (
    UserBase,
    UserCreate,
    UserRegister,
    UserUpdate,
    UserUpdateMe,
    UpdatePassword,
    User,
    UserPublic,
    UsersPublic
)
from app.models.items import (
    ItemBase,
    ItemCreate,
    ItemUpdate,
    Item,
    ItemPublic,
    ItemsPublic
)

from app.models.common import (
    Message,
    Token,
    TokenPayload,
    NewPassword,
)

from app.models.tasks import (
    TaskStatus,
    TaskPriority,
    TaskBase,
    TaskCreate,
    TaskUpdate,
    Task,
    TaskPublic,
    TasksPublic
)
