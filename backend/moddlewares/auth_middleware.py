from functools import wraps
from flask import request, jsonify, g
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models.user_model import User


# ==============================
# AUTH REQUIRED MIDDLEWARE
# ==============================
def auth_required():
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                # Verify JWT token
                verify_jwt_in_request()

                # Get user id from token
                user_id = get_jwt_identity()

                # Fetch user from DB
                user = User.query.get(user_id)

                if not user:
                    return jsonify({"error": "User not found"}), 404

                # Attach user to global context
                g.current_user = user

            except Exception as e:
                return jsonify({
                    "error": "Authentication failed",
                    "message": str(e)
                }), 401

            return func(*args, **kwargs)

        return wrapper
    return decorator


# ==============================
# OPTIONAL USER (NO STRICT AUTH)
# ==============================
def optional_auth():
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                verify_jwt_in_request(optional=True)
                user_id = get_jwt_identity()

                if user_id:
                    user = User.query.get(user_id)
                    g.current_user = user
                else:
                    g.current_user = None

            except Exception:
                g.current_user = None

            return func(*args, **kwargs)

        return wrapper
    return decorator


# ==============================
# GET CURRENT USER HELPER
# ==============================
def get_current_user():
    return getattr(g, "current_user", None)