from pydantic_settings import BaseSettings
from pathlib import Path

# Obtener la ruta al directorio backend
BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    database_url: str
    supabase_url: str = ""
    supabase_anon_key: str = ""
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = True
    
    class Config:
        env_file = BASE_DIR / ".env"
        case_sensitive = False

settings = Settings()
