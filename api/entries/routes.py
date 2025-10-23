from flask import request, jsonify, Blueprint, current_app
from entries.model import Entry, create_entry, get_entry, update_entry, delete_entry, get_all_entries, get_entries_by_product, get_entries_by_date_range, get_entries_by_warehouse
from datetime import date, datetime
import traceback

blueprint = Blueprint('entries', __name__)

# Create
@blueprint.route("/create", methods=["POST"])
def create():
    """Create a new stock entry"""
    current_app.logger.info(f"Entry creation requested")
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    required_fields = ["product_id", "quantity", "entry_date"]
    if not all(field in data for field in required_fields):
        missing = [field for field in required_fields if field not in data]
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        entry = create_entry(data)
        return jsonify({
            "data": entry.serialize(),
            "message": "Entry created successfully."
        }), 201
    except ValueError as ve:
        current_app.logger.error(f"Validation error creating entry: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f"Error creating entry: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to create entry due to an internal server error."}), 500

# Read
@blueprint.route("/read/<string:entry_id>", methods=["GET"])
def read(entry_id):
    """Get entry by ID"""
    current_app.logger.info(f"Entry read requested: {entry_id}")

    try:
        entry = get_entry(entry_id)
        if entry is None:
            return jsonify({"error": "Entry not found"}), 404

        return jsonify({
            "data": entry.serialize(),
            "message": "Entry retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving entry {entry_id}: {str(e)}")
        return jsonify({"error": "Failed to retrieve entry due to an internal server error."}), 500

# Read All
@blueprint.route("/read/all", methods=["GET"])
def read_all():
    """Get all entries"""
    current_app.logger.info(f"All entries requested")

    try:
        entries = get_all_entries()
        entries_data = [entry.serialize() for entry in entries]

        return jsonify({
            "data": entries_data,
            "message": "Entries retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving all entries: {str(e)}")
        return jsonify({"error": "Failed to retrieve entries due to an internal server error."}), 500

# Get Entries by Product
@blueprint.route("/read/product/<string:product_id>", methods=["GET"])
def read_by_product(product_id):
    """Get entries by product"""
    current_app.logger.info(f"Entries by product requested: {product_id}")

    try:
        entries = get_entries_by_product(product_id)
        entries_data = [entry.serialize() for entry in entries]

        return jsonify({
            "data": entries_data,
            "message": "Entries by product retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving entries by product {product_id}: {str(e)}")
        return jsonify({"error": "Failed to retrieve entries by product due to an internal server error."}), 500

# Get Entries by Date Range
@blueprint.route("/read/date-range", methods=["POST"])
def read_by_date_range():
    """Get entries within a date range"""
    current_app.logger.info(f"Entries by date range requested")
    data = request.get_json()

    if not data or "start_date" not in data or "end_date" not in data:
        return jsonify({"error": "start_date and end_date are required"}), 400

    try:
        start_date = datetime.strptime(data["start_date"], '%Y-%m-%d').date()
        end_date = datetime.strptime(data["end_date"], '%Y-%m-%d').date()

        entries = get_entries_by_date_range(start_date, end_date)
        entries_data = [entry.serialize() for entry in entries]

        return jsonify({
            "data": entries_data,
            "message": "Entries by date range retrieved successfully."
        }), 200
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
    except Exception as e:
        current_app.logger.error(f"Error retrieving entries by date range: {str(e)}")
        return jsonify({"error": "Failed to retrieve entries by date range due to an internal server error."}), 500

# Get Entries by Warehouse
@blueprint.route("/read/warehouse/<string:warehouse_id>", methods=["GET"])
def read_by_warehouse(warehouse_id):
    """Get entries by warehouse"""
    current_app.logger.info(f"Entries by warehouse requested: {warehouse_id}")

    try:
        entries = get_entries_by_warehouse(warehouse_id)
        entries_data = [entry.serialize() for entry in entries]

        return jsonify({
            "data": entries_data,
            "message": "Entries by warehouse retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving entries by warehouse {warehouse_id}: {str(e)}")
        return jsonify({"error": "Failed to retrieve entries by warehouse due to an internal server error."}), 500

# Update
@blueprint.route("/update/<string:entry_id>", methods=["PUT"])
def update(entry_id):
    """Update an existing entry"""
    current_app.logger.info(f"Entry update requested: {entry_id}")

    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    try:
        entry = update_entry(entry_id, data)
        if entry is None:
            return jsonify({"error": "Entry not found"}), 404

        return jsonify({
            "data": entry.serialize(),
            "message": "Entry updated successfully."
        }), 200
    except ValueError as ve:
        current_app.logger.error(f"Validation error updating entry {entry_id}: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f"Error updating entry {entry_id}: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to update entry due to an internal server error."}), 500

# Delete
@blueprint.route("/delete/<string:entry_id>", methods=["DELETE"])
def delete(entry_id):
    """Delete an entry"""
    current_app.logger.info(f"Entry deletion requested: {entry_id}")

    try:
        entry = delete_entry(entry_id)
        if entry is None:
            return jsonify({"error": "Entry not found"}), 404

        return jsonify({
            "message": "Entry deleted successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error deleting entry {entry_id}: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to delete entry due to an internal server error."}), 500