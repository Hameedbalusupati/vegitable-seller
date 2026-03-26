import re


class Validators:

    # ==============================
    # CHECK REQUIRED FIELDS
    # ==============================
    @staticmethod
    def required_fields(data, fields):
        if not isinstance(data, dict):
            return False, "Invalid input data"

        missing = []

        for field in fields:
            value = data.get(field)

            if value is None or str(value).strip() == "":
                missing.append(field)

        if missing:
            return False, f"Missing fields: {', '.join(missing)}"

        return True, "Valid"


    # ==============================
    # VALIDATE EMAIL
    # ==============================
    @staticmethod
    def validate_email(email):
        if not email:
            return False, "Email is required"

        email = email.strip()

        pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"

        if not re.match(pattern, email):
            return False, "Invalid email format"

        return True, "Valid email"


    # ==============================
    # VALIDATE PASSWORD
    # ==============================
    @staticmethod
    def validate_password(password):
        if not password:
            return False, "Password is required"

        password = password.strip()

        if len(password) < 8:
            return False, "Password must be at least 8 characters"

        if not re.search(r"[A-Z]", password):
            return False, "Must contain uppercase letter"

        if not re.search(r"[a-z]", password):
            return False, "Must contain lowercase letter"

        if not re.search(r"\d", password):
            return False, "Must contain a number"

        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            return False, "Must contain special character"

        return True, "Valid password"


    # ==============================
    # VALIDATE PHONE NUMBER (INDIA)
    # ==============================
    @staticmethod
    def validate_phone(phone):
        if not phone:
            return False, "Phone number is required"

        phone = str(phone).strip()

        pattern = r"^[6-9]\d{9}$"

        if not re.match(pattern, phone):
            return False, "Invalid phone number"

        return True, "Valid phone"


    # ==============================
    # VALIDATE NUMBER
    # ==============================
    @staticmethod
    def validate_number(value, field_name="value"):
        try:
            float(value)
            return True, f"{field_name} is valid"
        except (ValueError, TypeError):
            return False, f"{field_name} must be a number"


    # ==============================
    # VALIDATE POSITIVE NUMBER
    # ==============================
    @staticmethod
    def validate_positive_number(value, field_name="value"):
        try:
            val = float(value)

            if val <= 0:
                return False, f"{field_name} must be greater than 0"

            return True, f"{field_name} is valid"

        except (ValueError, TypeError):
            return False, f"{field_name} must be a number"


    # ==============================
    # VALIDATE PRICE
    # ==============================
    @staticmethod
    def validate_price(price):
        return Validators.validate_positive_number(price, "Price")


    # ==============================
    # VALIDATE QUANTITY
    # ==============================
    @staticmethod
    def validate_quantity(quantity):
        return Validators.validate_positive_number(quantity, "Quantity")


    # ==============================
    # VALIDATE STRING LENGTH
    # ==============================
    @staticmethod
    def validate_length(text, min_len=1, max_len=255, field_name="Field"):
        if not text:
            return False, f"{field_name} is required"

        text = str(text).strip()

        if len(text) < min_len:
            return False, f"{field_name} must be at least {min_len} characters"

        if len(text) > max_len:
            return False, f"{field_name} must be less than {max_len} characters"

        return True, "Valid"


    # ==============================
    # VALIDATE ORDER ITEMS
    # ==============================
    @staticmethod
    def validate_order_items(items):
        if not isinstance(items, list):
            return False, "Items must be a list"

        if len(items) == 0:
            return False, "Order items cannot be empty"

        for item in items:

            if not isinstance(item, dict):
                return False, "Invalid item format"

            if "product_id" not in item:
                return False, "product_id missing in item"

            if "quantity" not in item:
                return False, "quantity missing in item"

            if "type" not in item:
                return False, "type missing in item"

            valid, msg = Validators.validate_quantity(item["quantity"])
            if not valid:
                return False, msg

            if item["type"] not in ["kg", "bulk"]:
                return False, "type must be 'kg' or 'bulk'"

        return True, "Valid order items"


    # ==============================
    # VALIDATE ROLE
    # ==============================
    @staticmethod
    def validate_role(role):
        if not role:
            return False, "Role is required"

        role = role.lower()

        allowed_roles = ["admin", "farmer", "customer"]

        if role not in allowed_roles:
            return False, f"Role must be one of {allowed_roles}"

        return True, "Valid role"