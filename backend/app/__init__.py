from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    # ==============================
    # CONFIG
    # ==============================
    app.config['SECRET_KEY'] = 'secret-key'

    # ==============================
    # ENABLE CORS (VERY IMPORTANT)
    # ==============================
    CORS(app, resources={r"/*": {"origins": "*"}})

    # ==============================
    # TEST ROUTE
    # ==============================
    @app.route("/")
    def home():
        return {"message": "Flask Backend Running 🚀"}

    # ==============================
    # SAMPLE API ROUTE
    # ==============================
    @app.route("/api/test")
    def test():
        return {"status": "API Working ✅"}

    return app