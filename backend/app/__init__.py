from flask import Flask

def create_app():
    app = Flask(__name__)

    # Basic config
    app.config['SECRET_KEY'] = 'secret-key'

    # Example route (test)
    @app.route("/")
    def home():
        return "Flask Backend Running 🚀"

    return app