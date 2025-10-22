# 通用依赖
from collections.abc import Generator
from typing import Annotated

from fastapi import Depends
from sqlmodel import Session

from app.core.db import engine


# 数据库会话依赖项，提供数据库连接
def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


# 数据库会话依赖注入类型
SessionDep = Annotated[Session, Depends(get_db)]
