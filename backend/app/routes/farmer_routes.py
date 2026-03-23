from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.product_model import Product
from app.models.user_model import User

farmer_bp = Blueprint("farmer", __name__)

def is_farmer(uid):
    user = User.query.get(uid)
    return user and user.role == "farmer"

@farmer_bp.route("/product", methods=["POST"])
@jwt_required()
def add_product():
    uid = get_jwt_identity()

    if not is_farmer(uid):
        return jsonify({"error": "Not farmer"}), 403

    data = request.json

    product = Product(
        name=data["name"],
        price_per_kg=data["price_per_kg"],
        bulk_price=data["bulk_price"],
        stock=data["stock"],
        farmer_id=uid
    )

    db.session.add(product)
    db.session.commit()

    return jsonify({"message": "added"})