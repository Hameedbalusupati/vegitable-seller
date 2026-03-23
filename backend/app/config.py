import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

class Config:
    # ==============================
    # SECRET KEYS
    # ==============================
    SECRET_KEY = os.getenv("SECRET_KEY", "super_secret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt_secret")

    # ==============================
    # DATABASE
    # ==============================
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ✅ Required for Render PostgreSQL
    SQLALCHEMY_ENGINE_OPTIONS = {
        "connect_args": {
            "sslmode": "require"
        }
    }