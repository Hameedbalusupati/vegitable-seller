from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.product_model import Product

product_bp = Blueprint("products", __name__)

@product_bp.route("/", methods=["POST"])
def add_product():
    data = request.json

    product = Product(
        name=data["name"],
        price_per_kg=data["price_per_kg"],
        bulk_price=data["bulk_price"],
        stock=data["stock"],
        farmer_id=data["farmer_id"]
    )

    db.session.add(product)
    db.session.commit()

    return jsonify({"message": "Product added"})


@product_bp.route("/", methods=["GET"])
def get_products():
    products = Product.query.all()

    result = []
    for p in products:
        result.append({
            "id": p.id,
            "name": p.name,
            "price_per_kg": p.price_per_kg,
            "bulk_price": p.bulk_price,
            "stock": p.stock
        })

    return jsonify(result)