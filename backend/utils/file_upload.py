import os
import uuid
from werkzeug.utils import secure_filename
from flask import current_app


class FileUpload:

    # Allowed file types
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}

    # ==============================
    # CHECK FILE TYPE
    # ==============================
    @staticmethod
    def allowed_file(filename):
        return "." in filename and filename.rsplit(".", 1)[1].lower() in FileUpload.ALLOWED_EXTENSIONS

    # ==============================
    # SAVE FILE
    # ==============================
    @staticmethod
    def save_file(file):
        try:
            if not file:
                return {"error": "No file provided"}, 400

            if file.filename == "":
                return {"error": "Empty filename"}, 400

            if not FileUpload.allowed_file(file.filename):
                return {"error": "File type not allowed"}, 400

            # Secure filename
            filename = secure_filename(file.filename)

            # Unique filename
            unique_name = f"{uuid.uuid4().hex}_{filename}"

            # Upload folder
            upload_folder = current_app.config.get("UPLOAD_FOLDER", "uploads")
            os.makedirs(upload_folder, exist_ok=True)

            file_path = os.path.join(upload_folder, unique_name)

            # Save file
            file.save(file_path)

            return {
                "message": "File uploaded successfully",
                "filename": unique_name,
                "url": FileUpload.get_file_url(unique_name)
            }, 201

        except Exception as e:
            return {"error": str(e)}, 500

    # ==============================
    # DELETE FILE
    # ==============================
    @staticmethod
    def delete_file(filename):
        try:
            upload_folder = current_app.config.get("UPLOAD_FOLDER", "uploads")
            file_path = os.path.join(upload_folder, filename)

            if not os.path.exists(file_path):
                return {"error": "File not found"}, 404

            os.remove(file_path)

            return {"message": "File deleted successfully"}, 200

        except Exception as e:
            return {"error": str(e)}, 500

    # ==============================
    # GET FILE URL
    # ==============================
    @staticmethod
    def get_file_url(filename):
        base_url = current_app.config.get("BASE_URL")

        # If not set, auto-detect (Render safe)
        if not base_url:
            base_url = current_app.config.get("SERVER_NAME")
            if not base_url:
                base_url = "http://127.0.0.1:5000"

        # ✅ FIXED PATH
        return f"{base_url}/api/uploads/{filename}"