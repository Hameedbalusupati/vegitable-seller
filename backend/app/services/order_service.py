from app.extensions import db
from app.models import Order, OrderItem, Product  # ✅ FIXED IMPORT


class OrderService:

    # ==============================
    # CREATE ORDER
    # ==============================
    @staticmethod
    def create_order(user_id, data):
        try:
            items = data.get("items")

            if not items or len(items) == 0:
                return {"error": "No items provided"}, 400

            # Create order
            order = Order(user_id=user_id, total_price=0, status="pending")
            db.session.add(order)
            db.session.flush()

            total_price = 0

            for item in items:
                product_id = item.get("product_id")
                quantity = item.get("quantity")
                order_type = item.get("type", "kg")

                product = db.session.get(Product, product_id)  # ✅ FIXED

                if not product:
                    db.session.rollback()
                    return {"error": f"Product {product_id} not found"}, 400

                if not quantity or quantity <= 0:
                    db.session.rollback()
                    return {"error": "Invalid quantity"}, 400

                # Stock check
                if product.stock < quantity:
                    db.session.rollback()
                    return {"error": f"Not enough stock for {product.name}"}, 400

                # Price calculation
                if order_type == "kg":
                    price = product.price_per_kg * quantity
                elif order_type == "bulk":
                    price = product.bulk_price * quantity
                else:
                    db.session.rollback()
                    return {"error": "Type must be 'kg' or 'bulk'"}, 400

                total_price += price
                product.stock -= quantity

                order_item = OrderItem(
                    order_id=order.id,
                    product_id=product.id,
                    quantity=quantity,
                    type=order_type
                )

                db.session.add(order_item)

            order.total_price = total_price
            db.session.commit()

            return {
                "message": "Order created successfully",
                "order_id": order.id,
                "total_price": total_price
            }, 201

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500

    # ==============================
    # GET USER ORDERS
    # ==============================
    @staticmethod
    def get_user_orders(user_id):
        try:
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

            return result, 200

        except Exception as e:
            return {"error": str(e)}, 500

    # ==============================
    # GET SINGLE ORDER
    # ==============================
    @staticmethod
    def get_order_by_id(order_id):
        try:
            order = db.session.get(Order, order_id)  # ✅ FIXED

            if not order:
                return {"error": "Order not found"}, 404

            items = OrderItem.query.filter_by(order_id=order.id).all()

            return {
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
            }, 200

        except Exception as e:
            return {"error": str(e)}, 500

    # ==============================
    # UPDATE ORDER STATUS
    # ==============================
    @staticmethod
    def update_order_status(order_id, data):
        try:
            order = db.session.get(Order, order_id)  # ✅ FIXED

            if not order:
                return {"error": "Order not found"}, 404

            status = data.get("status")

            if not status:
                return {"error": "Status is required"}, 400

            order.status = status
            db.session.commit()

            return {"message": "Order status updated successfully"}, 200

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500

    # ==============================
    # DELETE ORDER
    # ==============================
    @staticmethod
    def delete_order(order_id):
        try:
            order = db.session.get(Order, order_id)  # ✅ FIXED

            if not order:
                return {"error": "Order not found"}, 404

            OrderItem.query.filter_by(order_id=order.id).delete()

            db.session.delete(order)
            db.session.commit()

            return {"message": "Order deleted successfully"}, 200

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500