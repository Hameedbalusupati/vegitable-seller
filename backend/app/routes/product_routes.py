from flask import Blueprint, request, jsonify, current_app, send_from_directory
from app.extensions import db
from app.models.product_model import Product
from werkzeug.utils import secure_filename
import os

product_bp = Blueprint("products", __name__)

# ==============================
# CONFIG
# ==============================
UPLOAD_FOLDER = "uploads"


# ==============================
# ADD PRODUCT (IMAGE UPLOAD)
# ==============================
@product_bp.route("/", methods=["POST"])
def add_product():
    try:
        # 🔥 Get form data (NOT JSON)
        name = request.form.get("name")
        price = request.form.get("price_per_kg")
        bulk_price = request.form.get("bulk_price", 0)
        stock = request.form.get("stock", 0)
        farmer_id = request.form.get("farmer_id")

        file = request.files.get("image")

        # Validation
        if not name or not price:
            return jsonify({"message": "Name and price_per_kg required"}), 400

        filename = ""

        # ==============================
        # SAVE IMAGE
        # ==============================
        if file:
            if not os.path.exists(UPLOAD_FOLDER):
                os.makedirs(UPLOAD_FOLDER)

            filename = secure_filename(file.filename)

            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)

        # ==============================
        # SAVE PRODUCT
        # ==============================
        product = Product(
            name=name,
            price_per_kg=price,
            bulk_price=bulk_price,
            stock=stock,
            farmer_id=farmer_id,
            image=filename
        )

        db.session.add(product)
        db.session.commit()

        return jsonify({
            "message": "Product added successfully",
            "product": {
                "id": product.id,
                "name": product.name,
                "price_per_kg": product.price_per_kg,
                "stock": product.stock,
                "image": product.image
            }
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
                "image": p.image
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ==============================
# DELETE PRODUCT
# ==============================
@product_bp.route("/<int:id>", methods=["DELETE"])
def delete_product(id):
    try:
        product = Product.query.get(id)

        if not product:
            return jsonify({"message": "Product not found"}), 404

        db.session.delete(product)
        db.session.commit()

        return jsonify({"message": "Product deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


# ==============================
# SERVE UPLOADED IMAGES
# ==============================
@product_bp.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)