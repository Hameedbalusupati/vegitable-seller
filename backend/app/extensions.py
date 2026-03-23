# backend/app/extensions.py

from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

# ==============================
# DATABASE
# ==============================
db = SQLAlchemy()

# ==============================
# JWT AUTH
# ==============================
jwt = JWTManager()