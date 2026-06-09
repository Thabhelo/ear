from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Ear API"
    environment: str = "development"
    allowed_origins: list[str] = ["http://localhost:3000"]

    firebase_project_id: str | None = None
    stripe_secret_key: str | None = None
    stripe_webhook_secret: str | None = None
    livekit_url: str | None = None
    livekit_api_key: str | None = None
    livekit_api_secret: str | None = None
    supabase_url: str | None = None
    google_cloud_storage_bucket: str | None = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
