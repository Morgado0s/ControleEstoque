from flask import request, jsonify, Blueprint, current_app
from roles.model import Role, create_role, get_role, update_role, delete_role, get_all_roles
import traceback

blueprint = Blueprint('roles', __name__)

@blueprint.route("/create", methods=["POST"])
def create():
    current_app.logger.info(f"Role creation requested")
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    required_fields = ["name"]
    if not all(field in data for field in required_fields):
        missing = [field for field in required_fields if field not in data]
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        role = create_role(data)
        return jsonify({
            "data": role.serialize(),
            "message": "Role created successfully."
        }), 201
    except ValueError as ve:
        current_app.logger.error(f"Validation error creating role: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f"Error creating role: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to create role due to an internal server error."}), 500

@blueprint.route("/read/<string:role_id>", methods=["GET"])
def read(role_id):
    current_app.logger.info(f"Role read requested: {role_id}")

    try:
        role = get_role(role_id)
        if role is None:
            return jsonify({"error": "Role not found"}), 404

        return jsonify({
            "data": role.serialize(),
            "message": "Role retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving role {role_id}: {str(e)}")
        return jsonify({"error": "Failed to retrieve role due to an internal server error."}), 500

@blueprint.route("/read/all", methods=["GET"])
def read_all():
    current_app.logger.info(f"All roles requested")

    try:
        roles = get_all_roles()
        roles_data = [role.serialize() for role in roles]

        return jsonify({
            "data": roles_data,
            "message": "Roles retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving all roles: {str(e)}")
        return jsonify({"error": "Failed to retrieve roles due to an internal server error."}), 500

@blueprint.route("/update/<string:role_id>", methods=["PUT"])
def update(role_id):
    current_app.logger.info(f"Role update requested: {role_id}")

    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    try:
        role = update_role(role_id, data)
        if role is None:
            return jsonify({"error": "Role not found"}), 404

        return jsonify({
            "data": role.serialize(),
            "message": "Role updated successfully."
        }), 200
    except ValueError as ve:
        current_app.logger.error(f"Validation error updating role {role_id}: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f"Error updating role {role_id}: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to update role due to an internal server error."}), 500

@blueprint.route("/delete/<string:role_id>", methods=["DELETE"])
def delete(role_id):
    current_app.logger.info(f"Role deletion requested: {role_id}")

    try:
        role = delete_role(role_id)
        if role is None:
            return jsonify({"error": "Role not found"}), 404

        return jsonify({
            "message": "Role deleted successfully."
        }), 200
    except ValueError as ve:
        current_app.logger.error(f"Validation error deleting role {role_id}: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f"Error deleting role {role_id}: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to delete role due to an internal server error."}), 500