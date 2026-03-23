from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user_model import User
from app.models.order_model import Order
from app.extensions import db

admin_bp = Blueprint("admin", __name__)

def is_admin(uid):
    user = User.query.get(uid)
    return user and user.role == "admin"

@admin_bp.route("/users", methods=["GET"])
@jwt_required()
def get_users():
    uid = get_jwt_identity()

    if not is_admin(uid):
        return jsonify({"error": "Unauthorized"}), 403

    users = User.query.all()
    return jsonify([u.email for u in users])


@admin_bp.route("/orders", methods=["GET"])
@jwt_required()
def get_orders():
    uid = get_jwt_identity()

    if not is_admin(uid):
        return jsonify({"error": "Unauthorized"}), 403

    orders = Order.query.all()
    return jsonify([o.id for o in orders])