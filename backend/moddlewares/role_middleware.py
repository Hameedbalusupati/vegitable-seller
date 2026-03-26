from functools import wraps
from flask import jsonify, g


# ==============================
# ROLE REQUIRED MIDDLEWARE
# ==============================
def role_required(*roles):
    """
    Usage:
    @role_required("admin")
    @role_required("admin", "farmer")
    """

    # Normalize roles to lowercase
    roles = [r.lower() for r in roles]

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):

            # Get user from global context
            user = getattr(g, "current_user", None)

            if not user:
                return jsonify({"error": "Authentication required"}), 401

            # Ensure user has role
            user_role = getattr(user, "role", None)

            if not user_role:
                return jsonify({"error": "User role not assigned"}), 403

            # Normalize role
            user_role = user_role.lower()

            # Check role
            if user_role not in roles:
                return jsonify({
                    "error": "Access denied",
                    "required_roles": roles,
                    "your_role": user_role
                }), 403

            return func(*args, **kwargs)

        return wrapper
    return decorator


# ==============================
# ROLE SHORTCUTS
# ==============================
def admin_required():
    return role_required("admin")


def farmer_required():
    return role_required("farmer")


def customer_required():
    return role_required("customer")


# ==============================
# MULTI ROLE HELPERS
# ==============================
def admin_or_farmer():
    return role_required("admin", "farmer")


def all_roles():
    return role_required("admin", "farmer", "customer")


# ==============================
# GET CURRENT ROLE (HELPER)
# ==============================
def get_current_role():
    user = getattr(g, "current_user", None)
    return getattr(user, "role", None)