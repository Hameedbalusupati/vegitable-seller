from flask import Flask
from .config import Config
from .extensions import db, migrate, jwt

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Register routes
    from .routes.auth_routes import auth_bp
    from .routes.product_routes import product_bp
    from .routes.order_routes import order_bp
    from .routes.user_routes import user_bp

    app.register_blueprint(user_bp, url_prefix="/api/user")

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(product_bp, url_prefix="/api/products")
    app.register_blueprint(order_bp, url_prefix="/api/orders")

    return app