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
    user_id = get_jwt_identity()

    response, status = PaymentService.create_payment(user_id, request.get_json())
    return jsonify(response), status


# ==============================
# VERIFY PAYMENT
# ==============================
@payment_bp.route("/verify/<int:payment_id>", methods=["POST"])
@jwt_required()
def verify_payment(payment_id):
    response, status = PaymentService.verify_payment(payment_id)
    return jsonify(response), status


# ==============================
# GET USER PAYMENTS
# ==============================
@payment_bp.route("/", methods=["GET"])
@jwt_required()
def get_payments():
    user_id = get_jwt_identity()

    response, status = PaymentService.get_user_payments(user_id)
    return jsonify(response), status