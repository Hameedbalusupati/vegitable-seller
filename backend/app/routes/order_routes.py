from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.order_model import Order
from app.models.order_item_model import OrderItem
from app.models.product_model import Product

order_bp = Blueprint("orders", __name__)


# ==============================
# CREATE ORDER (WITH ITEMS)
# ==============================
@order_bp.route("/", methods=["POST"])
@jwt_required()
def create_order():
    user_id = get_jwt_identity()
    data = request.get_json()

    # Validate input
    if not data or "items" not in data:
        return jsonify({"error": "Items required"}), 400

    items = data["items"]

    if len(items) == 0:
        return jsonify({"error": "Order items cannot be empty"}), 400

    # Create order
    order = Order(user_id=user_id, total_price=0)
    db.session.add(order)
    db.session.flush()  # get order.id

    total_price = 0

    for item in items:
        product = Product.query.get(item.get("product_id"))

        if not product:
            return jsonify({"error": f"Product {item.get('product_id')} not found"}), 400

        quantity = item.get("quantity")
        order_type = item.get("type")

        if not quantity or quantity <= 0:
            return jsonify({"error": "Invalid quantity"}), 400

        # Price calculation
        if order_type == "kg":
            price = product.price_per_kg * quantity
        elif order_type == "bulk":
            price = product.bulk_price * quantity
        else:
            return jsonify({"error": "Type must be 'kg' or 'bulk'"}), 400

        # Stock check
        if product.stock < quantity:
            return jsonify({"error": f"Not enough stock for {product.name}"}), 400

        # Reduce stock
        product.stock -= quantity

        total_price += price

        # Add order item
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=quantity,
            type=order_type
        )

        db.session.add(order_item)

    # Final update
    order.total_price = total_price
    db.session.commit()

    return jsonify({
        "message": "Order created successfully",
        "order_id": order.id,
        "total_price": total_price
    }), 201


# ==============================
# GET USER ORDERS
# ==============================
@order_bp.route("/", methods=["GET"])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()

    orders = Order.query.filter_by(user_id=user_id).all()

    result = []

    for order in orders:
        items = OrderItem.query.filter_by(order_id=order.id).all()

        result.append({
            "order_id": order.id,
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


# ==============================
# GET SINGLE ORDER
# ==============================
@order_bp.route("/<int:order_id>", methods=["GET"])
@jwt_required()
def get_order(order_id):
    order = Order.query.get(order_id)

    if not order:
        return jsonify({"error": "Order not found"}), 404

    items = OrderItem.query.filter_by(order_id=order.id).all()

    return jsonify({
        "order_id": order.id,
        "user_id": order.user_id,
        "total_price": order.total_price,
        "status": order.status,
        "items": [
            {
                "product_id": item.product_id,
                "quantity": item.quantity,
                "type": item.type
            } for item in items
        ]
    }), 200


# ==============================
# UPDATE ORDER STATUS
# ==============================
@order_bp.route("/<int:order_id>", methods=["PUT"])
@jwt_required()
def update_order(order_id):
    data = request.get_json()

    order = Order.query.get(order_id)

    if not order:
        return jsonify({"error": "Order not found"}), 404

    status = data.get("status")

    if not status:
        return jsonify({"error": "Status required"}), 400

    order.status = status
    db.session.commit()

    return jsonify({"message": "Order updated successfully"}), 200


# ==============================
# DELETE ORDER
# ==============================
@order_bp.route("/<int:order_id>", methods=["DELETE"])
@jwt_required()
def delete_order(order_id):
    order = Order.query.get(order_id)

    if not order:
        return jsonify({"error": "Order not found"}), 404

    # Delete items first
    OrderItem.query.filter_by(order_id=order.id).delete()

    db.session.delete(order)
    db.session.commit()

    return jsonify({"message": "Order deleted successfully"}), 200