from app.extensions import db
from app.models.user_model import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token


class AuthService:

    # ==============================
    # REGISTER USER
    # ==============================
    @staticmethod
    def register_user(data):
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role", "customer")

        # Validate fields
        if not name or not email or not password:
            return {"error": "All fields are required"}, 400

        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return {"error": "Email already exists"}, 400

        # Hash password
        hashed_password = generate_password_hash(password)

        # Create user
        new_user = User(
            name=name,
            email=email,
            password=hashed_password,
            role=role
        )

        db.session.add(new_user)
        db.session.commit()

        return {
            "message": "User registered successfully",
            "user_id": new_user.id
        }, 201

    # ==============================
    # LOGIN USER
    # ==============================
    @staticmethod
    def login_user(data):
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return {"error": "Email and password are required"}, 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return {"error": "User not found"}, 404

        if not check_password_hash(user.password, password):
            return {"error": "Invalid password"}, 401

        # Create JWT token
        token = create_access_token(identity=user.id)

        return {
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        }, 200

    # ==============================
    # GET USER BY ID
    # ==============================
    @staticmethod
    def get_user_by_id(user_id):
        user = User.query.get(user_id)

        if not user:
            return None

        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }

    # ==============================
    # CHANGE PASSWORD
    # ==============================
    @staticmethod
    def change_password(user_id, data):
        old_password = data.get("old_password")
        new_password = data.get("new_password")

        if not old_password or not new_password:
            return {"error": "Both old and new passwords required"}, 400

        user = User.query.get(user_id)

        if not user:
            return {"error": "User not found"}, 404

        if not check_password_hash(user.password, old_password):
            return {"error": "Old password is incorrect"}, 401

        user.password = generate_password_hash(new_password)
        db.session.commit()

        return {"message": "Password updated successfully"}, 200

    # ==============================
    # DELETE USER (OPTIONAL)
    # ==============================
    @staticmethod
    def delete_user(user_id):
        user = User.query.get(user_id)

        if not user:
            return {"error": "User not found"}, 404

        db.session.delete(user)
        db.session.commit()

        return {"message": "User deleted successfully"}, 200