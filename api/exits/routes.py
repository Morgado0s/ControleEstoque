from flask import request, jsonify, Blueprint, current_app
from exits.model import Exit, create_exit, get_exit, update_exit, delete_exit, get_all_exits, get_exits_by_product, get_exits_by_date_range, get_exits_by_warehouse
from datetime import date, datetime
import traceback

blueprint = Blueprint('exits', __name__)

# Create
@blueprint.route("/create", methods=["POST"])
def create():
    """Create a new stock exit"""
    current_app.logger.info(f"Exit creation requested")
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    required_fields = ["product_id", "quantity", "exit_date"]
    if not all(field in data for field in required_fields):
        missing = [field for field in required_fields if field not in data]
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        exit_record = create_exit(data)
        return jsonify({
            "data": exit_record.serialize(),
            "message": "Exit created successfully."
        }), 201
    except ValueError as ve:
        current_app.logger.error(f"Validation error creating exit: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f"Error creating exit: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to create exit due to an internal server error."}), 500

# Read
@blueprint.route("/read/<string:exit_id>", methods=["GET"])
def read(exit_id):
    """Get exit by ID"""
    current_app.logger.info(f"Exit read requested: {exit_id}")

    try:
        exit_record = get_exit(exit_id)
        if exit_record is None:
            return jsonify({"error": "Exit not found"}), 404

        return jsonify({
            "data": exit_record.serialize(),
            "message": "Exit retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving exit {exit_id}: {str(e)}")
        return jsonify({"error": "Failed to retrieve exit due to an internal server error."}), 500

# Read All
@blueprint.route("/read/all", methods=["GET"])
def read_all():
    """Get all exits"""
    current_app.logger.info(f"All exits requested")

    try:
        exits = get_all_exits()
        exits_data = [exit_record.serialize() for exit_record in exits]

        return jsonify({
            "data": exits_data,
            "message": "Exits retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving all exits: {str(e)}")
        return jsonify({"error": "Failed to retrieve exits due to an internal server error."}), 500

# Get Exits by Product
@blueprint.route("/read/product/<string:product_id>", methods=["GET"])
def read_by_product(product_id):
    """Get exits by product"""
    current_app.logger.info(f"Exits by product requested: {product_id}")

    try:
        exits = get_exits_by_product(product_id)
        exits_data = [exit_record.serialize() for exit_record in exits]

        return jsonify({
            "data": exits_data,
            "message": "Exits by product retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving exits by product {product_id}: {str(e)}")
        return jsonify({"error": "Failed to retrieve exits by product due to an internal server error."}), 500

# Get Exits by Date Range
@blueprint.route("/read/date-range", methods=["POST"])
def read_by_date_range():
    """Get exits within a date range"""
    current_app.logger.info(f"Exits by date range requested")
    data = request.get_json()

    if not data or "start_date" not in data or "end_date" not in data:
        return jsonify({"error": "start_date and end_date are required"}), 400

    try:
        start_date = datetime.strptime(data["start_date"], '%Y-%m-%d').date()
        end_date = datetime.strptime(data["end_date"], '%Y-%m-%d').date()

        exits = get_exits_by_date_range(start_date, end_date)
        exits_data = [exit_record.serialize() for exit_record in exits]

        return jsonify({
            "data": exits_data,
            "message": "Exits by date range retrieved successfully."
        }), 200
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
    except Exception as e:
        current_app.logger.error(f"Error retrieving exits by date range: {str(e)}")
        return jsonify({"error": "Failed to retrieve exits by date range due to an internal server error."}), 500

# Get Exits by Warehouse
@blueprint.route("/read/warehouse/<string:warehouse_id>", methods=["GET"])
def read_by_warehouse(warehouse_id):
    """Get exits by warehouse"""
    current_app.logger.info(f"Exits by warehouse requested: {warehouse_id}")

    try:
        exits = get_exits_by_warehouse(warehouse_id)
        exits_data = [exit_record.serialize() for exit_record in exits]

        return jsonify({
            "data": exits_data,
            "message": "Exits by warehouse retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving exits by warehouse {warehouse_id}: {str(e)}")
        return jsonify({"error": "Failed to retrieve exits by warehouse due to an internal server error."}), 500

# Update
@blueprint.route("/update/<string:exit_id>", methods=["PUT"])
def update(exit_id):
    """Update an existing exit"""
    current_app.logger.info(f"Exit update requested: {exit_id}")

    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    try:
        exit_record = update_exit(exit_id, data)
        if exit_record is None:
            return jsonify({"error": "Exit not found"}), 404

        return jsonify({
            "data": exit_record.serialize(),
            "message": "Exit updated successfully."
        }), 200
    except ValueError as ve:
        current_app.logger.error(f"Validation error updating exit {exit_id}: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f"Error updating exit {exit_id}: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to update exit due to an internal server error."}), 500

# Delete
@blueprint.route("/delete/<string:exit_id>", methods=["DELETE"])
def delete(exit_id):
    """Delete an exit"""
    current_app.logger.info(f"Exit deletion requested: {exit_id}")

    try:
        exit_record = delete_exit(exit_id)
        if exit_record is None:
            return jsonify({"error": "Exit not found"}), 404

        return jsonify({
            "message": "Exit deleted successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error deleting exit {exit_id}: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to delete exit due to an internal server error."}), 500