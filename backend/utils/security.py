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
        return generate_password_hash(password)


    # ==============================
    # VERIFY PASSWORD
    # ==============================
    @staticmethod
    def verify_password(password: str, hashed_password: str) -> bool:
        return check_password_hash(hashed_password, password)


    # ==============================
    # VALIDATE STRONG PASSWORD
    # ==============================
    @staticmethod
    def validate_password(password: str):
        """
        Rules:
        - At least 8 characters
        - At least 1 uppercase
        - At least 1 lowercase
        - At least 1 digit
        - At least 1 special character
        """
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
    # GENERATE UNIQUE ID
    # ==============================
    @staticmethod
    def generate_uuid():
        return str(uuid.uuid4())


    # ==============================
    # GENERATE OTP (6 DIGITS)
    # ==============================
    @staticmethod
    def generate_otp(length=6):
        return ''.join(secrets.choice(string.digits) for _ in range(length))


    # ==============================
    # GENERATE RANDOM PASSWORD
    # ==============================
    @staticmethod
    def generate_random_password(length=10):
        characters = string.ascii_letters + string.digits + "!@#$%^&*"
        return ''.join(secrets.choice(characters) for _ in range(length))


    # ==============================
    # SANITIZE INPUT
    # ==============================
    @staticmethod
    def sanitize_input(text: str) -> str:
        """
        Removes dangerous characters (basic protection)
        """
        if not text:
            return text

        # Remove script tags
        text = re.sub(r"<.*?>", "", text)

        # Remove special dangerous chars
        text = re.sub(r"[\"'`;]", "", text)

        return text.strip()


    # ==============================
    # VALIDATE EMAIL FORMAT
    # ==============================
    @staticmethod
    def validate_email(email: str):
        pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if re.match(pattern, email):
            return True
        return False