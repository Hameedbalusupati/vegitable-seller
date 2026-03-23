from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.order_model import Order
from app.models.order_item_model import OrderItem
from app.models.product_model import Product

order_bp = Blueprint("orders", __name__)

# ==============================
# CREATE ORDER
# ==============================
@order_bp.route("/", methods=["POST"])
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

        order = Order(user_id=user_id, total_price=0, status="Pending")
        db.session.add(order)
        db.session.flush()

        total_price = 0

        for item in items:
            product = db.session.get(Product, item.get("_id"))

            if not product:
                return jsonify({"message": "Product not found"}), 400

            quantity = item.get("quantity", 1)
            order_type = item.get("type", "kg")

            if quantity <= 0:
                return jsonify({"message": "Invalid quantity"}), 400

            # Price
            if order_type == "kg":
                price = product.price_per_kg * quantity
            else:
                price = product.bulk_price * quantity

            # Stock check
            if product.stock < quantity:
                return jsonify({"message": f"{product.name} out of stock"}), 400

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
            "message": "Order placed successfully",
            "order_id": order.id,
            "total_price": total_price
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


# ==============================
# GET USER ORDERS
# ==============================
@order_bp.route("/", methods=["GET"])
@jwt_required()
def get_orders():
    try:
        user_id = get_jwt_identity()

        orders = Order.query.filter_by(user_id=user_id).all()

        result = []
        for order in orders:
            items = OrderItem.query.filter_by(order_id=order.id).all()

            result.append({
                "id": order.id,
                "total_amount": order.total_price,
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
# GET SINGLE ORDER
# ==============================
@order_bp.route("/<int:order_id>", methods=["GET"])
@jwt_required()
def get_order(order_id):
    try:
        user_id = get_jwt_identity()
        order = db.session.get(Order, order_id)

        if not order:
            return jsonify({"message": "Order not found"}), 404

        if order.user_id != user_id:
            return jsonify({"message": "Unauthorized"}), 403

        items = OrderItem.query.filter_by(order_id=order.id).all()

        return jsonify({
            "id": order.id,
            "total_amount": order.total_price,
            "status": order.status,
            "items": [
                {
                    "product_id": item.product_id,
                    "quantity": item.quantity,
                    "type": item.type
                } for item in items
            ]
        }), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ==============================
# UPDATE ORDER STATUS
# ==============================
@order_bp.route("/<int:order_id>", methods=["PUT"])
@jwt_required()
def update_order(order_id):
    try:
        data = request.get_json()
        order = db.session.get(Order, order_id)

        if not order:
            return jsonify({"message": "Order not found"}), 404

        status = data.get("status")

        if not status:
            return jsonify({"message": "Status required"}), 400

        order.status = status
        db.session.commit()

        return jsonify({"message": "Order updated"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


# ==============================
# DELETE ORDER
# ==============================
@order_bp.route("/<int:order_id>", methods=["DELETE"])
@jwt_required()
def delete_order(order_id):
    try:
        order = db.session.get(Order, order_id)

        if not order:
            return jsonify({"message": "Order not found"}), 404

        OrderItem.query.filter_by(order_id=order.id).delete()
        db.session.delete(order)
        db.session.commit()

        return jsonify({"message": "Order deleted"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500