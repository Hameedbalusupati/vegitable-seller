from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user_model import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

auth_bp = Blueprint("auth", __name__)

# ==============================
# REGISTER
# ==============================
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"message": "No input data provided"}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user")

    if not name or not email or not password:
        return jsonify({"message": "All fields required"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"message": "Email already exists"}), 400

    hashed_password = generate_password_hash(password)

    user = User(
        name=name,
        email=email,
        password=hashed_password,
        role=role
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
        "user_id": user.id
    }), 201


# ==============================
# LOGIN
# ==============================
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"message": "No input data"}), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    if not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid password"}), 401

    token = create_access_token(identity=user.id)

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }), 200