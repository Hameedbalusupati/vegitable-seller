from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import User, Product, Order, OrderItem

user_bp = Blueprint("user", __name__)


# ==============================
# GET ALL PRODUCTS (PUBLIC)
# ==============================
@user_bp.route("/products", methods=["GET"])
def get_all_products():
    try:
        products = Product.query.all()

        result = []
        for p in products:
            result.append({
                "id": p.id,
                "name": p.name,
                "price_per_kg": p.price_per_kg,
                "bulk_price": p.bulk_price,
                "stock": p.stock,
                "image": p.image or ""
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ==============================
# GET SINGLE PRODUCT
# ==============================
@user_bp.route("/product/<int:product_id>", methods=["GET"])
def get_product(product_id):
    try:
        product = db.session.get(Product, product_id)

        if not product:
            return jsonify({"message": "Product not found"}), 404

        return jsonify({
            "id": product.id,
            "name": product.name,
            "price_per_kg": product.price_per_kg,
            "bulk_price": product.bulk_price,
            "stock": product.stock,
            "image": product.image or ""
        }), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ==============================
# CREATE ORDER
# ==============================
@user_bp.route("/order", methods=["POST"])
@jwt_required()
def create_order():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data or "items" not in data:
            return jsonify({"message": "Items required"}), 400

        items = data["items"]

        if len(items) == 0:
            return jsonify({"message": "Cart is empty"}), 400

        order = Order(user_id=user_id, total_price=0, status="pending")
        db.session.add(order)
        db.session.flush()

        total_price = 0

        for item in items:
            product_id = item.get("id")  # ✅ FIXED
            quantity = item.get("quantity", 1)
            order_type = item.get("type", "kg")

            product = db.session.get(Product, product_id)

            if not product:
                return jsonify({"message": f"Product {product_id} not found"}), 400

            if quantity <= 0:
                return jsonify({"message": "Invalid quantity"}), 400

            if product.stock < quantity:
                return jsonify({"message": f"{product.name} out of stock"}), 400

            # Price calculation
            if order_type == "kg":
                price = product.price_per_kg * quantity
            else:
                price = product.bulk_price * quantity

            product.stock -= quantity
            total_price += price

            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=quantity,
                type=order_type
            )

            db.session.add(order_item)

        order.total_price = total_price
        db.session.commit()

        return jsonify({
            "message": "Order created successfully",
            "order_id": order.id,
            "total_price": total_price
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


# ==============================
# GET MY ORDERS
# ==============================
@user_bp.route("/orders", methods=["GET"])
@jwt_required()
def get_my_orders():
    try:
        user_id = get_jwt_identity()

        orders = Order.query.filter_by(user_id=user_id).all()

        result = []
        for order in orders:
            items = OrderItem.query.filter_by(order_id=order.id).all()

            result.append({
                "id": order.id,
                "total_price": order.total_price,
                "status": order.status,
                "items": [
                    {
                        "product_id": item.product_id,
                        "quantity": item.quantity,
                        "type": item.type
                    } for item in items
                ]
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ==============================
# GET PROFILE
# ==============================
@user_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)

        if not user:
            return jsonify({"message": "User not found"}), 404

        return jsonify({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ==============================
# UPDATE PROFILE
# ==============================
@user_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)

        if not user:
            return jsonify({"message": "User not found"}), 404

        data = request.get_json()

        user.name = data.get("name", user.name)
        user.email = data.get("email", user.email)

        db.session.commit()

        return jsonify({"message": "Profile updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500