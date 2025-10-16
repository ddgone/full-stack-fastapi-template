# 限流器配置
from fastapi import FastAPI
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from app.core.config import settings


def init_rate_limiter() -> Limiter:
    """初始化限流器实例"""
    # 根据环境设置不同的默认限流规则
    default_limits = {
        "local": ["100/minute"],  # 本地开发环境宽松
        "staging": ["60/minute"],  # 测试环境
        "production": ["30/minute"]  # 生产环境严格
    }
    # 获取当前环境对应的限流规则，默认使用60次/分钟
    current_limits = default_limits.get(settings.ENVIRONMENT, ["60/minute"])

    return Limiter(
        key_func=get_remote_address,  # 基于客户端IP限流
        default_limits=current_limits,
        storage_uri="memory://"  # 个人网站用内存存储，未来可考虑使用 Redis 存储
    )


def setup_rate_limiter(app: FastAPI, limiter: Limiter) -> None:
    """为FastAPI应用配置限流器和异常处理"""
    # 绑定限流器到应用状态
    app.state.limiter = limiter
    # 添加限流超额异常处理器
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)