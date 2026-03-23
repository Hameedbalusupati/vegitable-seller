from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.notification_model import Notification
from app.models.user_model import User

notification_bp = Blueprint("notification", __name__)


# ==============================
# SEND NOTIFICATION (ADMIN / SYSTEM)
# ==============================
@notification_bp.route("/send", methods=["POST"])
@jwt_required()
def send_notification():
    data = request.get_json()
    current_user = get_jwt_identity()

    # Optional: Only admin can send
    user = User.query.get(current_user)
    if user.role != "admin":
        return jsonify({"error": "Only admin can send notifications"}), 403

    user_id = data.get("user_id")
    message = data.get("message")

    if not user_id or not message:
        return jsonify({"error": "user_id and message required"}), 400

    notification = Notification(
        user_id=user_id,
        message=message
    )

    db.session.add(notification)
    db.session.commit()

    return jsonify({"message": "Notification sent successfully"}), 201


# ==============================
# GET MY NOTIFICATIONS
# ==============================
@notification_bp.route("/", methods=["GET"])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()

    notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()

    result = []
    for n in notifications:
        result.append({
            "id": n.id,
            "message": n.message,
            "is_read": n.is_read,
            "created_at": n.created_at
        })

    return jsonify(result), 200


# ==============================
# MARK AS READ
# ==============================
@notification_bp.route("/read/<int:notification_id>", methods=["PUT"])
@jwt_required()
def mark_as_read(notification_id):
    user_id = get_jwt_identity()

    notification = Notification.query.get(notification_id)

    if not notification or notification.user_id != user_id:
        return jsonify({"error": "Notification not found"}), 404

    notification.is_read = True
    db.session.commit()

    return jsonify({"message": "Notification marked as read"}), 200


# ==============================
# DELETE NOTIFICATION
# ==============================
@notification_bp.route("/<int:notification_id>", methods=["DELETE"])
@jwt_required()
def delete_notification(notification_id):
    user_id = get_jwt_identity()

    notification = Notification.query.get(notification_id)

    if not notification or notification.user_id != user_id:
        return jsonify({"error": "Notification not found"}), 404

    db.session.delete(notification)
    db.session.commit()

    return jsonify({"message": "Notification deleted successfully"}), 200