from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path


def get_env_file():
    """Return .env path only if it exists (for local development)"""
    env_path = Path(__file__).resolve().parent.parent / ".env"
    return env_path if env_path.exists() else None


class BaseConfig(BaseSettings):
    DB_URL: Optional[str] = None
    DB_NAME: Optional[str] = None
    JWT_SECRET: Optional[str] = None
    PAYFAST_MERCHANT_ID: Optional[str] = None
    PAYFAST_MERCHANT_KEY: Optional[str] = None
    PAYFAST_PASSPHRASE: Optional[str] = None
    ENVIRONMENT: Optional[str] = None

    model_config = SettingsConfigDict(env_file=get_env_file(), extra="ignore")
