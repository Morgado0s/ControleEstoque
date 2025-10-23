from flask import request, jsonify, Blueprint, current_app
from warehouses.model import Warehouse, create_warehouse, get_warehouse, update_warehouse, delete_warehouse, get_all_warehouses
import traceback

blueprint = Blueprint('warehouses', __name__)

# Create
@blueprint.route("/create", methods=["POST"])
def create():
    """Create a new warehouse"""
    current_app.logger.info(f"Warehouse creation requested")
    data = request.get_json()
    current_app.logger.info(f"Received data: {data}")

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    required_fields = ["name"]
    if not all(field in data for field in required_fields):
        missing = [field for field in required_fields if field not in data]
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        warehouse = create_warehouse(data)
        return jsonify({
            "data": warehouse.serialize(),
            "message": "Warehouse created successfully."
        }), 201
    except ValueError as ve:
        current_app.logger.error(f"Validation error creating warehouse: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f"Error creating warehouse: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to create warehouse due to an internal server error."}), 500

# Read
@blueprint.route("/read/<string:warehouse_id>", methods=["GET"])
def read(warehouse_id):
    """Get warehouse by ID"""
    current_app.logger.info(f"Warehouse read requested: {warehouse_id}")

    try:
        warehouse = get_warehouse(warehouse_id)
        if warehouse is None:
            return jsonify({"error": "Warehouse not found"}), 404

        return jsonify({
            "data": warehouse.serialize(),
            "message": "Warehouse retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving warehouse {warehouse_id}: {str(e)}")
        return jsonify({"error": "Failed to retrieve warehouse due to an internal server error."}), 500

# Read All
@blueprint.route("/read/all", methods=["GET"])
def read_all():
    """Get all active warehouses"""
    current_app.logger.info(f"All warehouses requested")

    try:
        warehouses = get_all_warehouses()
        warehouses_data = [warehouse.serialize() for warehouse in warehouses]

        return jsonify({
            "data": warehouses_data,
            "message": "Warehouses retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving all warehouses: {str(e)}")
        return jsonify({"error": "Failed to retrieve warehouses due to an internal server error."}), 500

# Update
@blueprint.route("/update/<string:warehouse_id>", methods=["PUT"])
def update(warehouse_id):
    """Update an existing warehouse"""
    current_app.logger.info(f"Warehouse update requested: {warehouse_id}")

    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    try:
        warehouse = update_warehouse(warehouse_id, data)
        if warehouse is None:
            return jsonify({"error": "Warehouse not found"}), 404

        return jsonify({
            "data": warehouse.serialize(),
            "message": "Warehouse updated successfully."
        }), 200
    except ValueError as ve:
        current_app.logger.error(f"Validation error updating warehouse {warehouse_id}: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f"Error updating warehouse {warehouse_id}: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to update warehouse due to an internal server error."}), 500

# Delete
@blueprint.route("/delete/<string:warehouse_id>", methods=["DELETE"])
def delete(warehouse_id):
    """Delete a warehouse"""
    current_app.logger.info(f"Warehouse deletion requested: {warehouse_id}")

    try:
        warehouse = delete_warehouse(warehouse_id)
        if warehouse is None:
            return jsonify({"error": "Warehouse not found"}), 404

        return jsonify({
            "message": "Warehouse deleted successfully."
        }), 200
    except ValueError as ve:
        current_app.logger.error(f"Validation error deleting warehouse {warehouse_id}: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f"Error deleting warehouse {warehouse_id}: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to delete warehouse due to an internal server error."}), 500