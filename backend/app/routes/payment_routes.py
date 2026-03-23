from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.payment_service import PaymentService

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

        response, status = PaymentService.create_payment(user_id, data)
        return jsonify(response), status

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ==============================
# VERIFY PAYMENT
# ==============================
@payment_bp.route("/verify/<int:payment_id>", methods=["POST"])
@jwt_required()
def verify_payment(payment_id):
    try:
        if not payment_id:
            return jsonify({"message": "Payment ID required"}), 400

        response, status = PaymentService.verify_payment(payment_id)
        return jsonify(response), status

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ==============================
# GET USER PAYMENTS
# ==============================
@payment_bp.route("/", methods=["GET"])
@jwt_required()
def get_payments():
    try:
        user_id = get_jwt_identity()

        response, status = PaymentService.get_user_payments(user_id)
        return jsonify(response), status

    except Exception as e:
        return jsonify({"message": str(e)}), 500