from pydantic_settings import BaseSettings, SettingsConfigDict


class CelerySettings(BaseSettings):
    APP_NAME: str = "backend"
    BROKER_URL: str = "pyamqp://admin:admin@rabbitmq:5672//"
    RESULT_BACKEND: str = "redis://redis:6379/0"

    model_config = SettingsConfigDict(
        env_prefix="CELERY_",
        case_sensitive=True,
    )


celery_settings = CelerySettings()
