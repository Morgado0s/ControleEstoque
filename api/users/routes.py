from flask import request, jsonify, Blueprint, current_app
from users.model import User, create_user, get_user, update_user, delete_user, get_all_users, find_user_by_email, authenticate_user
import traceback

blueprint = Blueprint('users', __name__)

@blueprint.route("/create", methods=["POST"])
def create():
    current_app.logger.info(f"User creation requested")
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    required_fields = ["name", "email", "password", "role_id"]
    if not all(field in data for field in required_fields):
        missing = [field for field in required_fields if field not in data]
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        user = create_user(data)
        return jsonify({
            "data": user.serialize_safe(),
            "message": "User created successfully."
        }), 201
    except ValueError as ve:
        current_app.logger.error(f"Validation error creating user: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f"Error creating user: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to create user due to an internal server error."}), 500

@blueprint.route("/read/<string:user_id>", methods=["GET"])
def read(user_id):
    current_app.logger.info(f"User read requested: {user_id}")

    try:
        user = get_user(user_id)
        if user is None:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "data": user.serialize_safe(),
            "message": "User retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving user {user_id}: {str(e)}")
        return jsonify({"error": "Failed to retrieve user due to an internal server error."}), 500

@blueprint.route("/read/all", methods=["GET"])
def read_all():
    current_app.logger.info(f"All users requested")

    try:
        users = get_all_users()
        users_data = [user.serialize_safe() for user in users]

        return jsonify({
            "data": users_data,
            "message": "Users retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving all users: {str(e)}")
        return jsonify({"error": "Failed to retrieve users due to an internal server error."}), 500

@blueprint.route("/update/<string:user_id>", methods=["PUT"])
def update(user_id):
    current_app.logger.info(f"User update requested: {user_id}")

    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    try:
        user = update_user(user_id, data)
        if user is None:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "data": user.serialize_safe(),
            "message": "User updated successfully."
        }), 200
    except ValueError as ve:
        current_app.logger.error(f"Validation error updating user {user_id}: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f"Error updating user {user_id}: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to update user due to an internal server error."}), 500

@blueprint.route("/delete/<string:user_id>", methods=["DELETE"])
def delete(user_id):
    current_app.logger.info(f"User deletion requested: {user_id}")

    try:
        user = delete_user(user_id)
        if user is None:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "message": "User deleted successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error deleting user {user_id}: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to delete user due to an internal server error."}), 500

@blueprint.route("/login", methods=["POST"])
def login():
    current_app.logger.info("User login requested")
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    required_fields = ["email", "password"]
    if not all(field in data for field in required_fields):
        missing = [field for field in required_fields if field not in data]
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        user = authenticate_user(data["email"], data["password"])
        if user:
            return jsonify({
                "data": user.serialize_safe(),
                "message": "User authenticated successfully."
            }), 200
        else:
            return jsonify({
                "error": "Invalid email or password"
            }), 401
    except Exception as e:
        current_app.logger.error(f"Error during login: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Authentication failed due to an internal server error."}), 500

@blueprint.route("/me", methods=["GET"])
def get_current_user():
    current_app.logger.info("Current user profile requested")

    try:
        user = get_user()
        if user is None:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "data": user.serialize_safe(),
            "message": "Current user profile retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving current user profile: {str(e)}")
        return jsonify({"error": "Failed to retrieve user profile due to an internal server error."}), 500

@blueprint.route("/change-password", methods=["POST"])
def change_password():
    current_app.logger.info(f"Password change requested")
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    required_fields = ["current_password", "new_password"]
    if not all(field in data for field in required_fields):
        missing = [field for field in required_fields if field not in data]
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        user = get_user()
        if not user:
            return jsonify({"error": "User not found"}), 404

        if not user.check_password(data["current_password"]):
            return jsonify({"error": "Current password is incorrect"}), 400

        from users.model import hash_password
        user.password_hash = hash_password(data["new_password"])
        from datetime import datetime
        import pytz
        user.updated_at = datetime.now(pytz.timezone('America/Sao_Paulo'))

        from utils.db.connection import db
        db.session.commit()

        current_app.logger.info(f"Password changed successfully for user {user.email}")
        return jsonify({
            "message": "Password changed successfully."
        }), 200
    except Exception as e:
        from utils.db.connection import db
        db.session.rollback()
        current_app.logger.error(f"Error changing password for user {user.email}: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to change password due to an internal server error."}), 500