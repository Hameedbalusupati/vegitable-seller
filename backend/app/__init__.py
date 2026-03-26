from flask import Flask, send_from_directory
from flask_cors import CORS
from .extensions import db, jwt
import os


def create_app():
    app = Flask(__name__)

    # ==============================
    # CONFIG
    # ==============================
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "secret-key")

    # 🔥 DATABASE FIX (Render PostgreSQL)
    database_url = os.getenv("DATABASE_URL")

    if database_url and database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://")

    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # SSL for Render PostgreSQL
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "connect_args": {"sslmode": "require"}
    }

    # ==============================
    # 🔥 UPLOAD FOLDER (FIXED FOR WINDOWS + RENDER)
    # ==============================
    if os.name == "nt":  # Windows (local)
        upload_folder = os.path.join(os.getcwd(), "uploads")
    else:  # Linux (Render)
        upload_folder = "/tmp/uploads"

    app.config["UPLOAD_FOLDER"] = upload_folder
    os.makedirs(upload_folder, exist_ok=True)

    # ==============================
    # INIT EXTENSIONS
    # ==============================
    db.init_app(app)
    jwt.init_app(app)

    # ==============================
    # 🔥 CORS FIX (ALLOW FRONTEND)
    # ==============================
    CORS(
        app,
        supports_credentials=True,
        resources={r"/api/*": {"origins": "*"}}
    )

    # ==============================
    # IMPORT MODELS
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
    # REGISTER BLUEPRINTS
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
    # SERVE UPLOADED IMAGES
    # ==============================
    @app.route("/api/uploads/<filename>")
    def uploaded_file(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

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