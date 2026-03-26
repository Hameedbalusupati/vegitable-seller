from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import User, Order, Product

admin_bp = Blueprint("admin", __name__)


# ==============================
# CHECK ADMIN ROLE
# ==============================
def is_admin(user_id):
    user = db.session.get(User, user_id)
    return user and user.role == "admin"


# ==============================
# GET ALL USERS
# ==============================
@admin_bp.route("/users", methods=["GET"])
@jwt_required()
def get_users():
    try:
        user_id = get_jwt_identity()

        if not is_admin(user_id):
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
        user_id = get_jwt_identity()

        if not is_admin(user_id):
            return jsonify({"message": "Unauthorized"}), 403

        orders = Order.query.all()

        result = []
        for o in orders:
            result.append({
                "id": o.id,
                "user_id": o.user_id,
                "total_price": o.total_price,   # ✅ FIXED
                "status": o.status
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ==============================
# GET ALL PRODUCTS
# ==============================
@admin_bp.route("/products", methods=["GET"])
@jwt_required()
def get_products():
    try:
        user_id = get_jwt_identity()

        if not is_admin(user_id):
            return jsonify({"message": "Unauthorized"}), 403

        products = Product.query.all()

        result = []
        for p in products:
            result.append({
                "id": p.id,
                "name": p.name,
                "price_per_kg": p.price_per_kg,
                "bulk_price": p.bulk_price,
                "stock": p.stock,
                "farmer_id": p.farmer_id,
                "image": p.image or ""
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ==============================
# DELETE USER
# ==============================
@admin_bp.route("/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    try:
        current_user = get_jwt_identity()

        if not is_admin(current_user):
            return jsonify({"message": "Unauthorized"}), 403

        user = db.session.get(User, user_id)

        if not user:
            return jsonify({"message": "User not found"}), 404

        db.session.delete(user)
        db.session.commit()

        return jsonify({"message": "User deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


# ==============================
# DELETE PRODUCT
# ==============================
@admin_bp.route("/products/<int:product_id>", methods=["DELETE"])
@jwt_required()
def delete_product(product_id):
    try:
        current_user = get_jwt_identity()

        if not is_admin(current_user):
            return jsonify({"message": "Unauthorized"}), 403

        product = db.session.get(Product, product_id)

        if not product:
            return jsonify({"message": "Product not found"}), 404

        db.session.delete(product)
        db.session.commit()

        return jsonify({"message": "Product deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500