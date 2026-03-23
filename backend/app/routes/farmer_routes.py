from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.product_model import Product
from app.models.user_model import User

farmer_bp = Blueprint("farmer", __name__)

# ==============================
# CHECK FARMER
# ==============================
def is_farmer(uid):
    user = db.session.get(User, uid)
    return user and user.role == "farmer"


# ==============================
# ADD PRODUCT
# ==============================
@farmer_bp.route("/products", methods=["POST"])
@jwt_required()
def add_product():
    try:
        uid = get_jwt_identity()

        if not is_farmer(uid):
            return jsonify({"message": "Only farmers allowed"}), 403

        data = request.get_json()

        if not data:
            return jsonify({"message": "No input data"}), 400

        required_fields = ["name", "price_per_kg", "bulk_price", "stock"]

        for field in required_fields:
            if field not in data:
                return jsonify({"message": f"{field} is required"}), 400

        product = Product(
            name=data.get("name"),
            price_per_kg=data.get("price_per_kg"),
            bulk_price=data.get("bulk_price"),
            stock=data.get("stock"),
            farmer_id=uid,
            image=data.get("image", "")
        )

        db.session.add(product)
        db.session.commit()

        return jsonify({
            "message": "Product added successfully",
            "product_id": product.id
        }), 201

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ==============================
# GET FARMER PRODUCTS
# ==============================
@farmer_bp.route("/products", methods=["GET"])
@jwt_required()
def get_my_products():
    try:
        uid = get_jwt_identity()

        if not is_farmer(uid):
            return jsonify({"message": "Only farmers allowed"}), 403

        products = Product.query.filter_by(farmer_id=uid).all()

        result = []
        for p in products:
            result.append({
                "id": p.id,
                "name": p.name,
                "price_per_kg": p.price_per_kg,
                "bulk_price": p.bulk_price,
                "stock": p.stock,
                "image": getattr(p, "image", "")
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500