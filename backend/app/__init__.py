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

    # PostgreSQL SSL (Render)
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "connect_args": {"sslmode": "require"}
    }

    # ==============================
    # INIT EXTENSIONS
    # ==============================
    db.init_app(app)
    jwt.init_app(app)

    # ==============================
    # CORS
    # ==============================
    CORS(app, resources={r"/*": {"origins": "*"}})

    # ==============================
    # IMPORT MODELS (IMPORTANT)
    # ==============================
    from .models.user_model import User
    from .models.product_model import Product
    from .models.order_model import Order
    from .models.order_item_model import OrderItem
    from .models.payment_model import Payment
    from .models.delivery_model import Delivery
    from .models.farmer_model import Farmer
    from .models.notification_model import Notification

    # ==============================
    # REGISTER BLUEPRINTS (🔥 FIX)
    # ==============================
    from .routes.auth_routes import auth_bp
    from .routes.product_routes import product_bp
    from .routes.order_routes import order_bp
    from .routes.user_routes import user_bp
    from .routes.admin_routes import admin_bp
    from .routes.farmer_routes import farmer_bp
    from .routes.payment_routes import payment_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(product_bp, url_prefix="/api/products")
    app.register_blueprint(order_bp, url_prefix="/api/orders")
    app.register_blueprint(user_bp, url_prefix="/api/user")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(farmer_bp, url_prefix="/api/farmer")
    app.register_blueprint(payment_bp, url_prefix="/api/payments")

    # ==============================
    # CREATE TABLES
    # ==============================
    with app.app_context():
        db.create_all()

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