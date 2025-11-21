"""Application settings and dependency helpers."""

from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Runtime configuration loaded from env vars or .env file."""

    app_name: str = "MockLoop API"
    environment: str = Field("local", description="Deployment environment label")
    debug: bool = Field(False, description="Enable debug mode")
    secret_key: str = Field("change-me-in-production", description="Secret key for sessions")

    # Database settings
    postgres_host: str = Field("localhost", description="PostgreSQL host")
    postgres_port: int = Field(5432, description="PostgreSQL port")
    postgres_db: str = Field("mockloop_dev", description="PostgreSQL database name")
    postgres_user: str = Field("mockloop", description="PostgreSQL username")
    postgres_password: str = Field("dev_password", description="PostgreSQL password")

    # Redis settings
    redis_host: str = Field("localhost", description="Redis host")
    redis_port: int = Field(6379, description="Redis port")

    # CORS settings
    frontend_origin: List[str] = Field(
        default_factory=lambda: [
            "http://localhost:3000",
        ],
        description="Allowed origins for CORS",
    )

    # LLM settings
    llm_model: str = Field(
        "gpt-4o-mini",
        description="Placeholder model identifier used by the mock AI service.",
    )
    openai_api_key: str = Field("", description="OpenAI API key")

    @property
    def database_url(self) -> str:
        """Construct database URL from components."""
        return f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"

    @property
    def redis_url(self) -> str:
        """Construct Redis URL from components."""
        return f"redis://{self.redis_host}:{self.redis_port}"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()
