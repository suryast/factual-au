from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "factual.au backend"
    api_prefix: str = "/api/v1"
    frontend_origin: str = "http://localhost:4321"
    anthropic_model: str = "claude-sonnet-4-6"
    voyage_model: str = "voyage-large-2-instruct"
    cluster_public_threshold: int = 3

    model_config = SettingsConfigDict(env_prefix="FACTUAL_AU_", extra="ignore")


settings = Settings()

