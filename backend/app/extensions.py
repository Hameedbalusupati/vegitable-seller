# backend/app/extensions.py

from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager


# ==============================
# DATABASE INSTANCE
# ==============================
db = SQLAlchemy()


# ==============================
# JWT AUTH INSTANCE
# ==============================
jwt = JWTManager()


# ==============================
# OPTIONAL: JWT ERROR HANDLERS
# ==============================
def init_jwt_callbacks(app):

    @jwt.unauthorized_loader
    def unauthorized_callback(callback):
        return {"error": "Authorization token required"}, 401

    @jwt.invalid_token_loader
    def invalid_token_callback(callback):
        return {"error": "Invalid token"}, 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {"error": "Token has expired"}, 401