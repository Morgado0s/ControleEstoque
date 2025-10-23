from flask import request, jsonify, Blueprint, current_app
from gender.model import Gender, create_gender, get_gender, update_gender, delete_gender, get_all_genders
import traceback

blueprint = Blueprint('gender', __name__)

@blueprint.route("/create", methods=["POST"])
def create():
    current_app.logger.info(f"Gender creation requested")
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    required_fields = ["name"]
    if not all(field in data for field in required_fields):
        missing = [field for field in required_fields if field not in data]
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        gender = create_gender(data)
        return jsonify({
            "data": gender.serialize(),
            "message": "Gender created successfully."
        }), 201
    except ValueError as ve:
        current_app.logger.error(f"Validation error creating gender: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f"Error creating gender: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to create gender due to an internal server error."}), 500

@blueprint.route("/read/<string:gender_id>", methods=["GET"])
def read(gender_id):
    current_app.logger.info(f"Gender read requested: {gender_id}")

    try:
        gender = get_gender(gender_id)
        if gender is None:
            return jsonify({"error": "Gender not found"}), 404

        return jsonify({
            "data": gender.serialize(),
            "message": "Gender retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving gender {gender_id}: {str(e)}")
        return jsonify({"error": "Failed to retrieve gender due to an internal server error."}), 500

@blueprint.route("/read/all", methods=["GET"])
def read_all():
    current_app.logger.info(f"All genders requested")

    try:
        genders = get_all_genders()
        genders_data = [gender.serialize() for gender in genders]

        return jsonify({
            "data": genders_data,
            "message": "Genders retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving all genders: {str(e)}")
        return jsonify({"error": "Failed to retrieve genders due to an internal server error."}), 500

@blueprint.route("/update/<string:gender_id>", methods=["PUT"])
def update(gender_id):
    current_app.logger.info(f"Gender update requested: {gender_id}")

    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    try:
        gender = update_gender(gender_id, data)
        if gender is None:
            return jsonify({"error": "Gender not found"}), 404

        return jsonify({
            "data": gender.serialize(),
            "message": "Gender updated successfully."
        }), 200
    except ValueError as ve:
        current_app.logger.error(f"Validation error updating gender {gender_id}: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f"Error updating gender {gender_id}: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to update gender due to an internal server error."}), 500

@blueprint.route("/delete/<string:gender_id>", methods=["DELETE"])
def delete(gender_id):
    current_app.logger.info(f"Gender deletion requested: {gender_id}")

    try:
        gender = delete_gender(gender_id)
        if gender is None:
            return jsonify({"error": "Gender not found"}), 404

        return jsonify({
            "message": "Gender deleted successfully."
        }), 200
    except ValueError as ve:
        current_app.logger.error(f"Validation error deleting gender {gender_id}: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f"Error deleting gender {gender_id}: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to delete gender due to an internal server error."}), 500