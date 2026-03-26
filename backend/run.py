# backend/run.py

import os
from dotenv import load_dotenv
from app import create_app

# Load environment variables (safe for local + render)
load_dotenv()

# Create Flask app
app = create_app()


# ==============================
# RUN SERVER (LOCAL ONLY)
# ==============================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV") == "development"

    app.run(
        host="0.0.0.0",
        port=port,
        debug=debug
    )