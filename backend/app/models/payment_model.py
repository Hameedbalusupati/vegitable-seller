from app.extensions import db
from datetime import datetime

class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50))  # card, upi, cod
    status = db.Column(db.String(50), default="pending")  # pending, success, failed

    transaction_id = db.Column(db.String(100), unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)