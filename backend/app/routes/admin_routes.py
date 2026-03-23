from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user_model import User
from app.models.order_model import Order
from app.extensions import db

admin_bp = Blueprint("admin", __name__)

# ==============================
# CHECK ADMIN
# ==============================
def is_admin(uid):
    user = db.session.get(User, uid)
    return user and user.role == "admin"


# ==============================
# GET ALL USERS
# ==============================
@admin_bp.route("/users", methods=["GET"])
@jwt_required()
def get_users():
    try:
        uid = get_jwt_identity()

        if not is_admin(uid):
            return jsonify({"message": "Unauthorized"}), 403

        users = User.query.all()

        result = []
        for u in users:
            result.append({
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "role": u.role
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ==============================
# GET ALL ORDERS
# ==============================
@admin_bp.route("/orders", methods=["GET"])
@jwt_required()
def get_orders():
    try:
        uid = get_jwt_identity()

        if not is_admin(uid):
            return jsonify({"message": "Unauthorized"}), 403

        orders = Order.query.all()

        result = []
        for o in orders:
            result.append({
                "id": o.id,
                "user_id": o.user_id,
                "total_amount": o.total_amount,
                "status": o.status
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500