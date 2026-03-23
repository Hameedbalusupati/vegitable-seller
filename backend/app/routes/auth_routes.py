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

    # Validate input
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "customer")

    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required"}), 400

    # Check if email already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email already registered"}), 400

    # Hash password
    hashed_password = generate_password_hash(password)

    # Create user
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

    # Validate input
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Find user
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Check password
    if not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid password"}), 401

    # Generate token
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