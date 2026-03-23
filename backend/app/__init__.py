# backend/app/__init__.py

from flask import Flask
from flask_cors import CORS
from .extensions import db, jwt
import os

def create_app():
    app = Flask(__name__)

    # ==============================
    # CONFIG
    # ==============================
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "secret-key")

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # ✅ Required for Render PostgreSQL
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "connect_args": {
            "sslmode": "require"
        }
    }

    # ==============================
    # INIT EXTENSIONS
    # ==============================
    db.init_app(app)
    jwt.init_app(app)

    # ==============================
    # ENABLE CORS
    # ==============================
    CORS(app, resources={r"/*": {"origins": "*"}})

    # ==============================
    # TEST ROUTES
    # ==============================
    @app.route("/")
    def home():
        return {"message": "Flask Backend Running 🚀"}

    @app.route("/api/test")
    def test():
        return {"status": "API Working ✅"}

    return app