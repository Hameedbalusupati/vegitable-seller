from app.extensions import db
from app.models.payment_model import Payment
from app.models.order_model import Order
import uuid


class PaymentService:

    # ==============================
    # CREATE PAYMENT
    # ==============================
    @staticmethod
    def create_payment(user_id, data):
        try:
            order_id = data.get("order_id")
            payment_method = data.get("payment_method", "cod")

            if not order_id:
                return {"error": "Order ID is required"}, 400

            order = db.session.get(Order, order_id)

            if not order:
                return {"error": "Order not found"}, 404

            if order.user_id != user_id:
                return {"error": "Unauthorized access to order"}, 403

            # Prevent duplicate payment
            existing_payment = Payment.query.filter_by(order_id=order_id).first()
            if existing_payment:
                return {"error": "Payment already exists for this order"}, 400

            transaction_id = str(uuid.uuid4())

            payment = Payment(
                order_id=order.id,
                user_id=user_id,
                amount=order.total_price,
                payment_method=payment_method,
                status="pending",
                transaction_id=transaction_id
            )

            db.session.add(payment)
            db.session.commit()

            return {
                "message": "Payment initiated",
                "payment_id": payment.id,
                "transaction_id": transaction_id,
                "amount": payment.amount,
                "status": payment.status
            }, 201

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500


    # ==============================
    # VERIFY PAYMENT
    # ==============================
    @staticmethod
    def verify_payment(payment_id):
        try:
            payment = db.session.get(Payment, payment_id)

            if not payment:
                return {"error": "Payment not found"}, 404

            if payment.status == "success":
                return {"message": "Already verified"}, 200

            payment.status = "success"

            order = db.session.get(Order, payment.order_id)
            if order:
                order.status = "paid"

            db.session.commit()

            return {
                "message": "Payment successful",
                "payment_id": payment.id,
                "status": payment.status
            }, 200

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500


    # ==============================
    # GET USER PAYMENTS
    # ==============================
    @staticmethod
    def get_user_payments(user_id):
        try:
            payments = Payment.query.filter_by(user_id=user_id).all()

            result = []
            for p in payments:
                result.append({
                    "payment_id": p.id,
                    "order_id": p.order_id,
                    "amount": p.amount,
                    "method": p.payment_method,
                    "status": p.status,
                    "transaction_id": p.transaction_id,
                    "created_at": str(p.created_at) if p.created_at else None
                })

            return result, 200

        except Exception as e:
            return {"error": str(e)}, 500


    # ==============================
    # GET SINGLE PAYMENT
    # ==============================
    @staticmethod
    def get_payment_by_id(payment_id):
        try:
            payment = db.session.get(Payment, payment_id)

            if not payment:
                return {"error": "Payment not found"}, 404

            return {
                "payment_id": payment.id,
                "order_id": payment.order_id,
                "user_id": payment.user_id,
                "amount": payment.amount,
                "method": payment.payment_method,
                "status": payment.status,
                "transaction_id": payment.transaction_id,
                "created_at": str(payment.created_at) if payment.created_at else None
            }, 200

        except Exception as e:
            return {"error": str(e)}, 500


    # ==============================
    # DELETE PAYMENT
    # ==============================
    @staticmethod
    def delete_payment(payment_id):
        try:
            payment = db.session.get(Payment, payment_id)

            if not payment:
                return {"error": "Payment not found"}, 404

            db.session.delete(payment)
            db.session.commit()

            return {"message": "Payment deleted successfully"}, 200

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500