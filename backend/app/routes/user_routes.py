from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user_model import User
from app.models.product_model import Product
from app.models.order_model import Order
from app.models.order_item_model import OrderItem

user_bp = Blueprint("user", __name__)


# ==============================
# GET ALL PRODUCTS
# ==============================
@user_bp.route("/products", methods=["GET"])
def get_all_products():
    products = Product.query.all()

    result = []
    for p in products:
        result.append({
            "id": p.id,
            "name": p.name,
            "price_per_kg": p.price_per_kg,
            "bulk_price": p.bulk_price,
            "stock": p.stock,
            "farmer_id": p.farmer_id
        })

    return jsonify(result)


# ==============================
# GET SINGLE PRODUCT
# ==============================
@user_bp.route("/product/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = Product.query.get(product_id)

    if not product:
        return jsonify({"error": "Product not found"}), 404

    return jsonify({
        "id": product.id,
        "name": product.name,
        "price_per_kg": product.price_per_kg,
        "bulk_price": product.bulk_price,
        "stock": product.stock,
        "farmer_id": product.farmer_id
    })


# ==============================
# CREATE ORDER (WITH MULTIPLE ITEMS)
# ==============================
@user_bp.route("/order", methods=["POST"])
@jwt_required()
def create_order():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or "items" not in data:
        return jsonify({"error": "Items required"}), 400

    items = data["items"]

    if len(items) == 0:
        return jsonify({"error": "Empty order"}), 400

    # Create order first
    order = Order(user_id=user_id, total_price=0)
    db.session.add(order)
    db.session.flush()  # to get order.id before commit

    total_price = 0

    for item in items:
        product = Product.query.get(item["product_id"])

        if not product:
            return jsonify({"error": f"Product {item['product_id']} not found"}), 400

        quantity = float(item["quantity"])
        order_type = item["type"]

        # Price calculation
        if order_type == "kg":
            price = product.price_per_kg * quantity
        elif order_type == "bulk":
            price = product.bulk_price * quantity
        else:
            return jsonify({"error": "Type must be 'kg' or 'bulk'"}), 400

        total_price += price

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=quantity,
            type=order_type
        )

        db.session.add(order_item)

    # Update total
    order.total_price = total_price
    db.session.commit()

    return jsonify({
        "message": "Order created successfully",
        "order_id": order.id,
        "total_price": total_price
    })


# ==============================
# GET MY ORDERS
# ==============================
@user_bp.route("/orders", methods=["GET"])
@jwt_required()
def get_my_orders():
    user_id = get_jwt_identity()

    orders = Order.query.filter_by(user_id=user_id).all()

    result = []

    for order in orders:
        items = OrderItem.query.filter_by(order_id=order.id).all()

        order_data = {
            "order_id": order.id,
            "total_price": order.total_price,
            "status": order.status,
            "items": []
        }

        for item in items:
            order_data["items"].append({
                "product_id": item.product_id,
                "quantity": item.quantity,
                "type": item.type
            })

        result.append(order_data)

    return jsonify(result)


# ==============================
# GET USER PROFILE
# ==============================
@user_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    })


# ==============================
# UPDATE USER PROFILE
# ==============================
@user_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()

    user.name = data.get("name", user.name)
    user.email = data.get("email", user.email)

    db.session.commit()

    return jsonify({"message": "Profile updated successfully"})