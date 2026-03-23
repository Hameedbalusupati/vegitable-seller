from flask import Flask
from flask_cors import CORS
from .extensions import db
import os

def create_app():
    app = Flask(__name__)

    # ==============================
    # CONFIG
    # ==============================
    app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # ✅ Required for Render PostgreSQL
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        "connect_args": {
            "sslmode": "require"
        }
    }

    # ==============================
    # INIT DB
    # ==============================
    db.init_app(app)

    # ==============================
    # CORS
    # ==============================
    CORS(app, resources={r"/*": {"origins": "*"}})

    # ==============================
    # TEST ROUTE
    # ==============================
    @app.route("/")
    def home():
        return {"message": "Flask Backend Running 🚀"}

    return app