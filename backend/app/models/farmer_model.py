from app.extensions import db

class Farmer(db.Model):
    __tablename__ = "farmers"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    farm_name = db.Column(db.String(100))
    location = db.Column(db.String(200))