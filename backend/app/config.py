import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Config:
    # ==============================
    # SECRET KEYS
    # ==============================
    SECRET_KEY = os.getenv("SECRET_KEY", "super_secret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt_secret")

    # ==============================
    # DATABASE (RENDER POSTGRES ONLY)
    # ==============================
    database_url = os.getenv("DATABASE_URL")

    if not database_url:
        raise ValueError("DATABASE_URL is not set. Please configure it in Render.")

    # Fix Render postgres:// → postgresql://
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://")

    SQLALCHEMY_DATABASE_URI = database_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # SSL REQUIRED for Render PostgreSQL
    SQLALCHEMY_ENGINE_OPTIONS = {
        "connect_args": {"sslmode": "require"}
    }

    # ==============================
    # UPLOAD FOLDER (RENDER SAFE)
    # ==============================
    UPLOAD_FOLDER = "/tmp/uploads"
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)