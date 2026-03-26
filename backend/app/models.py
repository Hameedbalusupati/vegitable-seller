from app.extensions import db
from datetime import datetime


# ======================
# USER MODEL
# ======================
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200))
    role = db.Column(db.String(20))  # customer, farmer, admin


# ======================
# FARMER MODEL
# ======================
class Farmer(db.Model):
    __tablename__ = "farmers"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    farm_name = db.Column(db.String(100))
    location = db.Column(db.String(200))


# ======================
# PRODUCT MODEL
# ======================
class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    price_per_kg = db.Column(db.Float)
    bulk_price = db.Column(db.Float)
    stock = db.Column(db.Integer)

    farmer_id = db.Column(db.Integer, db.ForeignKey("users.id"))


# ======================
# ORDER MODEL
# ======================
class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    total_price = db.Column(db.Float)
    status = db.Column(db.String(50), default="pending")


# ======================
# ORDER ITEM MODEL
# ======================
class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"))
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))

    quantity = db.Column(db.Float)
    type = db.Column(db.String(10))  # kg or bulk


# ======================
# PAYMENT MODEL
# ======================
class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50))  # card, upi, cod
    status = db.Column(db.String(50), default="pending")

    transaction_id = db.Column(db.String(100), unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ======================
# DELIVERY MODEL
# ======================
class Delivery(db.Model):
    __tablename__ = "deliveries"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"))
    status = db.Column(db.String(50), default="pending")


# ======================
# NOTIFICATION MODEL
# ======================
class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    message = db.Column(db.String(255))
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)