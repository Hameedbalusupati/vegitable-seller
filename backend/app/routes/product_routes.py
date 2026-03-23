from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.product_model import Product

product_bp = Blueprint("products", __name__)

# ==============================
# ADD PRODUCT
# ==============================
@product_bp.route("/", methods=["POST"])
def add_product():
    data = request.get_json()

    if not data:
        return jsonify({"message": "No input data"}), 400

    try:
        # Validation
        if not data.get("name") or not data.get("price_per_kg"):
            return jsonify({"message": "Name and price_per_kg required"}), 400

        product = Product(
            name=data.get("name"),
            price_per_kg=data.get("price_per_kg"),
            bulk_price=data.get("bulk_price", 0),
            stock=data.get("stock", 0),
            farmer_id=data.get("farmer_id"),
            image=data.get("image", "")
        )

        db.session.add(product)
        db.session.commit()

        return jsonify({
            "message": "Product added successfully",
            "product_id": product.id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


# ==============================
# GET ALL PRODUCTS
# ==============================
@product_bp.route("/", methods=["GET"])
def get_products():
    try:
        products = Product.query.all()

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