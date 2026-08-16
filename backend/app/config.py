import os
import json
from typing import List, Union
from pydantic_settings import BaseSettings
from pydantic import field_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "Jeff G. Wilson Portfolio API"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "wilson-liquid-glass-jwt-secret-key-production-ready"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    ALGORITHM: str = "HS256"

    DATABASE_URL: str = "sqlite:///./portfolio.db"

    BACKEND_CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return [v]
        return v

    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE_MB: int = 50
    BASE_URL: str = "http://127.0.0.1:8000"

    FIRST_SUPERUSER_EMAIL: str = "admin@jeffgwilson.com"
    FIRST_SUPERUSER_PASSWORD: str = "AdminPass123!"

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"

settings = Settings()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
