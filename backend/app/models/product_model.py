from app.extensions import db

class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    price_per_kg = db.Column(db.Float)
    bulk_price = db.Column(db.Float)
    stock = db.Column(db.Integer)

    farmer_id = db.Column(db.Integer, db.ForeignKey("users.id"))