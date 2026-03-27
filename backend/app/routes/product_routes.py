from flask import Blueprint, request, jsonify, send_from_directory, current_app
from app.extensions import db
from app.models import Product
from werkzeug.utils import secure_filename
import os

product_bp = Blueprint("products", __name__)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}


# ==============================
# CHECK FILE TYPE
# ==============================
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ==============================
# ADD PRODUCT
# ==============================
@product_bp.route("/", methods=["POST"])
def add_product():
    try:
        name = request.form.get("name")
        price = request.form.get("price_per_kg")
        bulk_price = request.form.get("bulk_price", 0)
        stock = request.form.get("stock", 0)
        farmer_id = request.form.get("farmer_id")

        file = request.files.get("image")

        if not name or not price:
            return jsonify({"message": "Name and price required"}), 400

        price = float(price)
        bulk_price = float(bulk_price)
        stock = int(stock)

        filename = ""

        upload_folder = current_app.config.get("UPLOAD_FOLDER", "uploads")
        os.makedirs(upload_folder, exist_ok=True)

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(upload_folder, filename)

            counter = 1
            while os.path.exists(file_path):
                name_part, ext = filename.rsplit(".", 1)
                filename = f"{name_part}_{counter}.{ext}"
                file_path = os.path.join(upload_folder, filename)
                counter += 1

            file.save(file_path)

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
                "bulk_price": product.bulk_price,
                "stock": product.stock,
                "image": f"/products/uploads/{filename}" if filename else ""
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


# ==============================
# GET ALL PRODUCTS (FIXED)
# ==============================
@product_bp.route("/", methods=["GET"])
def get_products():
    try:
        products = Product.query.all()

        print("TOTAL PRODUCTS:", len(products))  # 🔥 debug log

        result = []
        for p in products:
            result.append({
                "id": p.id,
                "name": p.name,
                "price_per_kg": p.price_per_kg,
                "bulk_price": p.bulk_price,
                "stock": p.stock,
                "image": f"/products/uploads/{p.image}" if p.image else ""
            })

        return jsonify(result), 200

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"message": str(e)}), 500


# ==============================
# GET SINGLE PRODUCT
# ==============================
@product_bp.route("/<int:product_id>", methods=["GET"])
def get_product(product_id):
    try:
        product = db.session.get(Product, product_id)

        if not product:
            return jsonify({"message": "Product not found"}), 404

        return jsonify({
            "id": product.id,
            "name": product.name,
            "price_per_kg": product.price_per_kg,
            "bulk_price": product.bulk_price,
            "stock": product.stock,
            "image": f"/products/uploads/{product.image}" if product.image else ""
        }), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ==============================
# UPDATE PRODUCT
# ==============================
@product_bp.route("/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    try:
        product = db.session.get(Product, product_id)

        if not product:
            return jsonify({"message": "Product not found"}), 404

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
@product_bp.route("/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    try:
        product = db.session.get(Product, product_id)

        if not product:
            return jsonify({"message": "Product not found"}), 404

        db.session.delete(product)
        db.session.commit()

        return jsonify({"message": "Product deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


# ==============================
# SERVE IMAGES (FIXED PATH)
# ==============================
@product_bp.route("/uploads/<filename>")
def get_image(filename):
    try:
        upload_folder = current_app.config.get("UPLOAD_FOLDER", "uploads")
        return send_from_directory(upload_folder, filename)
    except Exception as e:
        return jsonify({"message": str(e)}), 404