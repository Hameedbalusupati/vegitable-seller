import re
import uuid
import secrets
import string
from werkzeug.security import generate_password_hash, check_password_hash


class SecurityUtils:

    # ==============================
    # HASH PASSWORD
    # ==============================
    @staticmethod
    def hash_password(password: str) -> str:
        if not password:
            raise ValueError("Password cannot be empty")
        return generate_password_hash(password)

    # ==============================
    # VERIFY PASSWORD
    # ==============================
    @staticmethod
    def verify_password(password: str, hashed_password: str) -> bool:
        if not password or not hashed_password:
            return False
        return check_password_hash(hashed_password, password)

    # ==============================
    # VALIDATE STRONG PASSWORD
    # ==============================
    @staticmethod
    def validate_password(password: str):
        if not password:
            return False, "Password is required"

        if len(password) < 8:
            return False, "Password must be at least 8 characters long"

        if not re.search(r"[A-Z]", password):
            return False, "Password must contain at least one uppercase letter"

        if not re.search(r"[a-z]", password):
            return False, "Password must contain at least one lowercase letter"

        if not re.search(r"\d", password):
            return False, "Password must contain at least one digit"

        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            return False, "Password must contain at least one special character"

        return True, "Password is valid"

    # ==============================
    # GENERATE RANDOM TOKEN
    # ==============================
    @staticmethod
    def generate_token():
        return secrets.token_hex(32)

    # ==============================
    # GENERATE UUID
    # ==============================
    @staticmethod
    def generate_uuid():
        return str(uuid.uuid4())

    # ==============================
    # GENERATE OTP
    # ==============================
    @staticmethod
    def generate_otp(length=6):
        if length <= 0:
            length = 6
        return ''.join(secrets.choice(string.digits) for _ in range(length))

    # ==============================
    # GENERATE RANDOM PASSWORD
    # ==============================
    @staticmethod
    def generate_random_password(length=10):
        if length < 6:
            length = 6

        characters = string.ascii_letters + string.digits + "!@#$%^&*"
        return ''.join(secrets.choice(characters) for _ in range(length))

    # ==============================
    # SANITIZE INPUT
    # ==============================
    @staticmethod
    def sanitize_input(text: str) -> str:
        if not text:
            return ""

        # Remove HTML tags safely
        text = re.sub(r"<[^>]*?>", "", text)

        # Remove dangerous characters
        text = re.sub(r"[\"'`;]", "", text)

        return text.strip()

    # ==============================
    # VALIDATE EMAIL FORMAT
    # ==============================
    @staticmethod
    def validate_email(email: str):
        if not email:
            return False

        pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        return bool(re.match(pattern, email))