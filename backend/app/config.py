from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    storage_mode: str = Field(default="local", alias="STORAGE_MODE")
    local_data_file: str = Field(default="data/local_store.json", alias="LOCAL_DATA_FILE")
    mongo_url: str = Field(default="mongodb://localhost:27017", alias="MONGO_URL")
    database_name: str = Field(default="ai_business_generator", alias="DATABASE_NAME")
    jwt_secret_key: str = Field(default="change_me", alias="JWT_SECRET_KEY")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(
        default=1440, alias="ACCESS_TOKEN_EXPIRE_MINUTES"
    )
    gemini_api_key: str = Field(default="", alias="GEMINI_API_KEY")
    frontend_origin: str = Field(
        default="http://localhost:5173", alias="FRONTEND_ORIGIN"
    )

    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parent.parent / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
