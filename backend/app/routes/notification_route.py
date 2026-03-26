from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Notification, User  # ✅ FIXED IMPORT

notification_bp = Blueprint("notification", __name__)


# ==============================
# SEND NOTIFICATION (ADMIN ONLY)
# ==============================
@notification_bp.route("/send", methods=["POST"])
@jwt_required()
def send_notification():
    try:
        data = request.get_json()
        current_user_id = get_jwt_identity()

        # Get current user
        user = db.session.get(User, current_user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

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

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ==============================
# GET MY NOTIFICATIONS
# ==============================
@notification_bp.route("/", methods=["GET"])
@jwt_required()
def get_notifications():
    try:
        user_id = get_jwt_identity()

        notifications = Notification.query.filter_by(user_id=user_id)\
            .order_by(Notification.created_at.desc()).all()

        result = []
        for n in notifications:
            result.append({
                "id": n.id,
                "message": n.message,
                "is_read": n.is_read,
                "created_at": n.created_at
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==============================
# MARK AS READ
# ==============================
@notification_bp.route("/read/<int:notification_id>", methods=["PUT"])
@jwt_required()
def mark_as_read(notification_id):
    try:
        user_id = get_jwt_identity()

        notification = db.session.get(Notification, notification_id)

        if not notification or notification.user_id != user_id:
            return jsonify({"error": "Notification not found"}), 404

        notification.is_read = True
        db.session.commit()

        return jsonify({"message": "Notification marked as read"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ==============================
# DELETE NOTIFICATION
# ==============================
@notification_bp.route("/<int:notification_id>", methods=["DELETE"])
@jwt_required()
def delete_notification(notification_id):
    try:
        user_id = get_jwt_identity()

        notification = db.session.get(Notification, notification_id)

        if not notification or notification.user_id != user_id:
            return jsonify({"error": "Notification not found"}), 404

        db.session.delete(notification)
        db.session.commit()

        return jsonify({"message": "Notification deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500