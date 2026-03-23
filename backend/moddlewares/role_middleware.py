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

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):

            # Check if user exists in request context
            user = getattr(g, "current_user", None)

            if not user:
                return jsonify({"error": "Authentication required"}), 401

            # Check role
            if user.role not in roles:
                return jsonify({
                    "error": "Access denied",
                    "required_roles": roles,
                    "your_role": user.role
                }), 403

            return func(*args, **kwargs)

        return wrapper
    return decorator


# ==============================
# ADMIN ONLY
# ==============================
def admin_required():
    return role_required("admin")


# ==============================
# FARMER ONLY
# ==============================
def farmer_required():
    return role_required("farmer")


# ==============================
# CUSTOMER ONLY
# ==============================
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
    return user.role if user else None