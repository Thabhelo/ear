from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Ear API"
    environment: str = "development"
    allowed_origins: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    google_cloud_project: str | None = None
    firebase_project_id: str | None = None
    stripe_secret_key: str | None = None
    stripe_webhook_secret: str | None = None
    app_base_url: str = "http://localhost:3000"
    livekit_url: str | None = None
    livekit_api_key: str | None = None
    livekit_api_secret: str | None = None
    google_cloud_storage_bucket: str | None = None
    cloud_tasks_location: str = "us-central1"
    cloud_tasks_queue: str = "callsomeone-session-jobs"
    host_user_id: str = "callsomeone-host"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
