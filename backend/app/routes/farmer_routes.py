from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Product, User

farmer_bp = Blueprint("farmer", __name__)


# ==============================
# CHECK FARMER ROLE
# ==============================
def is_farmer(user_id):
    user = db.session.get(User, user_id)
    return user and user.role == "farmer"


# ==============================
# ADD PRODUCT
# ==============================
@farmer_bp.route("/products", methods=["POST"])
@jwt_required()
def add_product():
    try:
        user_id = get_jwt_identity()

        # Check farmer role
        if not is_farmer(user_id):
            return jsonify({"message": "Only farmers can add products"}), 403

        data = request.get_json()

        if not data:
            return jsonify({"message": "No input data"}), 400

        # Required fields
        name = data.get("name")
        price_per_kg = data.get("price_per_kg")

        if not name or price_per_kg is None:
            return jsonify({"message": "Name and price_per_kg are required"}), 400

        try:
            price_per_kg = float(price_per_kg)
            bulk_price = float(data.get("bulk_price", 0))
            stock = int(data.get("stock", 0))
        except ValueError:
            return jsonify({"message": "Invalid numeric values"}), 400

        if price_per_kg <= 0:
            return jsonify({"message": "Price must be greater than 0"}), 400

        # Create product
        product = Product(
            name=name,
            price_per_kg=price_per_kg,
            bulk_price=bulk_price,
            stock=stock,
            farmer_id=user_id,
            image=data.get("image", "")  # optional
        )

        db.session.add(product)
        db.session.commit()

        return jsonify({
            "message": "Product added successfully",
            "product": {
                "id": product.id,
                "name": product.name,
                "price_per_kg": product.price_per_kg,
                "bulk_price": product.bulk_price,
                "stock": product.stock,
                "image": product.image
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


# ==============================
# GET MY PRODUCTS
# ==============================
@farmer_bp.route("/products", methods=["GET"])
@jwt_required()
def get_my_products():
    try:
        user_id = get_jwt_identity()

        if not is_farmer(user_id):
            return jsonify({"message": "Only farmers allowed"}), 403

        products = Product.query.filter_by(farmer_id=user_id).all()

        result = []
        for p in products:
            result.append({
                "id": p.id,
                "name": p.name,
                "price_per_kg": p.price_per_kg,
                "bulk_price": p.bulk_price,
                "stock": p.stock,
                "image": p.image or ""
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ==============================
# UPDATE PRODUCT
# ==============================
@farmer_bp.route("/products/<int:product_id>", methods=["PUT"])
@jwt_required()
def update_product(product_id):
    try:
        user_id = get_jwt_identity()

        if not is_farmer(user_id):
            return jsonify({"message": "Only farmers allowed"}), 403

        product = db.session.get(Product, product_id)

        if not product:
            return jsonify({"message": "Product not found"}), 404

        if product.farmer_id != user_id:
            return jsonify({"message": "Unauthorized"}), 403

        data = request.get_json()

        product.name = data.get("name", product.name)
        product.price_per_kg = float(data.get("price_per_kg", product.price_per_kg))
        product.bulk_price = float(data.get("bulk_price", product.bulk_price))
        product.stock = int(data.get("stock", product.stock))
        product.image = data.get("image", product.image)

        db.session.commit()

        return jsonify({"message": "Product updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


# ==============================
# DELETE PRODUCT
# ==============================
@farmer_bp.route("/products/<int:product_id>", methods=["DELETE"])
@jwt_required()
def delete_product(product_id):
    try:
        user_id = get_jwt_identity()

        if not is_farmer(user_id):
            return jsonify({"message": "Only farmers allowed"}), 403

        product = db.session.get(Product, product_id)

        if not product:
            return jsonify({"message": "Product not found"}), 404

        if product.farmer_id != user_id:
            return jsonify({"message": "Unauthorized"}), 403

        db.session.delete(product)
        db.session.commit()

        return jsonify({"message": "Product deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500