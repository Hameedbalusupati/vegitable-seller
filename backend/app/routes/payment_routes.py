from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Payment

payment_bp = Blueprint("payment", __name__)


# ==============================
# CREATE PAYMENT
# ==============================
@payment_bp.route("/", methods=["POST"])
@jwt_required()
def create_payment():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data:
            return jsonify({"message": "No input data"}), 400

        order_id = data.get("order_id")
        amount = data.get("amount")
        payment_method = data.get("payment_method", "cod")

        if not order_id or not amount:
            return jsonify({"message": "order_id and amount required"}), 400

        try:
            amount = float(amount)
        except ValueError:
            return jsonify({"message": "Invalid amount"}), 400

        payment = Payment(
            order_id=order_id,
            user_id=user_id,
            amount=amount,
            payment_method=payment_method,
            status="success" if payment_method == "cod" else "pending",
            transaction_id=None
        )

        db.session.add(payment)
        db.session.commit()

        return jsonify({
            "message": "Payment created successfully",
            "payment": {
                "id": payment.id,
                "order_id": payment.order_id,
                "amount": payment.amount,
                "status": payment.status,
                "method": payment.payment_method
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


# ==============================
# VERIFY PAYMENT (SIMULATION)
# ==============================
@payment_bp.route("/verify/<int:payment_id>", methods=["POST"])
@jwt_required()
def verify_payment(payment_id):
    try:
        payment = db.session.get(Payment, payment_id)

        if not payment:
            return jsonify({"message": "Payment not found"}), 404

        # Simulate success
        payment.status = "success"
        payment.transaction_id = f"TXN{payment.id}"

        db.session.commit()

        return jsonify({
            "message": "Payment verified successfully",
            "payment_id": payment.id,
            "status": payment.status
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


# ==============================
# GET USER PAYMENTS
# ==============================
@payment_bp.route("/", methods=["GET"])
@jwt_required()
def get_payments():
    try:
        user_id = get_jwt_identity()

        payments = Payment.query.filter_by(user_id=user_id).all()

        result = []
        for p in payments:
            result.append({
                "id": p.id,
                "order_id": p.order_id,
                "amount": p.amount,
                "method": p.payment_method,
                "status": p.status,
                "transaction_id": p.transaction_id,
                "created_at": p.created_at
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ==============================
# TEST ROUTE
# ==============================
@payment_bp.route("/test", methods=["GET"])
def test_payment():
    return jsonify({"message": "Payment routes working"}), 200