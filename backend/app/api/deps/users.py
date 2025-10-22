# 用户相关依赖

from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError

from app.api.deps.common import SessionDep
from app.core import security
from app.core.config import settings
from app.models import User, TokenPayload


# OAuth2密码流认证实例，用于获取访问令牌
reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login/access-token"
)

# JWT令牌依赖注入类型
TokenDep = Annotated[str, Depends(reusable_oauth2)]


# 获取当前登录用户，验证JWT令牌并检查用户状态
def get_current_user(session: SessionDep, token: TokenDep) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = session.get(User, token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user


# 当前用户依赖注入类型
CurrentUser = Annotated[User, Depends(get_current_user)]


# 获取当前活跃的超级用户，检查用户权限
def get_current_active_superuser(current_user: CurrentUser) -> User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user


# 超级用户依赖注入类型
CurrentSuperuser = Annotated[User, Depends(get_current_active_superuser)]
