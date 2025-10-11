# 通用模型
from sqlmodel import Field, SQLModel


# 通用消息类 - 用于返回简单的消息响应
class Message(SQLModel):
    message: str  # 消息内容


# 包含访问令牌的 JSON 负载 - 用于认证响应
class Token(SQLModel):
    access_token: str  # JWT访问令牌
    token_type: str = "bearer"  # 令牌类型，默认为bearer


# JWT 令牌内容 - 用于解析JWT令牌中的载荷信息
class TokenPayload(SQLModel):
    sub: str | None = None  # 主题(用户ID)，可为None


# 新密码设置模型 - 用于重置密码功能
class NewPassword(SQLModel):
    token: str  # 重置密码令牌
    new_password: str = Field(min_length=8, max_length=40)  # 新密码，长度8-40字符
