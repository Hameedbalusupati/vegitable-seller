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

    # ==============================
    # DATABASE
    # ==============================
    database_url = os.getenv("DATABASE_URL")

    if not database_url:
        database_url = "sqlite:///local.db"

    # Fix old postgres URL
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://")

    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # ✅ Safe SSL only for PostgreSQL
    if database_url.startswith("postgresql"):
        app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
            "connect_args": {"sslmode": "require"}
        }

    # ==============================
    # UPLOAD FOLDER
    # ==============================
    upload_folder = "/tmp/uploads" if os.name != "nt" else os.path.join(os.getcwd(), "uploads")
    app.config["UPLOAD_FOLDER"] = upload_folder
    os.makedirs(upload_folder, exist_ok=True)

    # ==============================
    # INIT EXTENSIONS
    # ==============================
    db.init_app(app)
    jwt.init_app(app)

    # ==============================
    # CORS
    # ==============================
    CORS(app)

    # ==============================
    # REGISTER BLUEPRINTS (SAFE IMPORT)
    # ==============================
    try:
        from .routes.auth_routes import auth_bp
        from .routes.product_routes import product_bp
        from .routes.order_routes import order_bp
        from .routes.user_routes import user_bp
        from .routes.admin_routes import admin_bp
        from .routes.farmer_routes import farmer_bp
        from .routes.payment_routes import payment_bp
        from .routes.notification_route import notification_bp

        app.register_blueprint(auth_bp, url_prefix="/api/auth")
        app.register_blueprint(product_bp, url_prefix="/api/products")
        app.register_blueprint(order_bp, url_prefix="/api/orders")
        app.register_blueprint(user_bp, url_prefix="/api/user")
        app.register_blueprint(admin_bp, url_prefix="/api/admin")
        app.register_blueprint(farmer_bp, url_prefix="/api/farmer")
        app.register_blueprint(payment_bp, url_prefix="/api/payments")
        app.register_blueprint(notification_bp, url_prefix="/api/notifications")

    except Exception as e:
        print("❌ Blueprint Error:", e)

    # ==============================
    # CREATE TABLES (SAFE)
    # ==============================
    try:
        with app.app_context():
            db.create_all()
    except Exception as e:
        print("❌ DB Error:", e)

    # ==============================
    # SERVE FILES
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