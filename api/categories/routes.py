from flask import request, jsonify, Blueprint, current_app
from categories.model import Category, create_category, get_category, update_category, delete_category, get_all_categories
import traceback

blueprint = Blueprint('categories', __name__)

# Create
@blueprint.route("/create", methods=["POST"])
def create():
    """Create a new category"""
    current_app.logger.info(f"Category creation requested")
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    required_fields = ["name"]
    if not all(field in data for field in required_fields):
        missing = [field for field in required_fields if field not in data]
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        category = create_category(data)
        return jsonify({
            "data": category.serialize(),
            "message": "Category created successfully."
        }), 201
    except ValueError as ve:
        current_app.logger.error(f"Validation error creating category: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f"Error creating category: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to create category due to an internal server error."}), 500

# Read
@blueprint.route("/read/<string:category_id>", methods=["GET"])
def read(category_id):
    """Get category by ID"""
    current_app.logger.info(f"Category read requested: {category_id}")

    try:
        category = get_category(category_id)
        if category is None:
            return jsonify({"error": "Category not found"}), 404

        return jsonify({
            "data": category.serialize(),
            "message": "Category retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving category {category_id}: {str(e)}")
        return jsonify({"error": "Failed to retrieve category due to an internal server error."}), 500

# Read All
@blueprint.route("/read/all", methods=["GET"])
def read_all():
    """Get all active categories"""
    current_app.logger.info("All categories requested")

    try:
        categories = get_all_categories()
        categories_data = [category.serialize() for category in categories]

        return jsonify({
            "data": categories_data,
            "message": "Categories retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving all categories: {str(e)}")
        return jsonify({"error": "Failed to retrieve categories due to an internal server error."}), 500

# Update
@blueprint.route("/update/<string:category_id>", methods=["PUT"])
def update(category_id):
    """Update an existing category"""
    current_app.logger.info(f"Category update requested: {category_id}")

    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    try:
        category = update_category(category_id, data)
        if category is None:
            return jsonify({"error": "Category not found"}), 404

        return jsonify({
            "data": category.serialize(),
            "message": "Category updated successfully."
        }), 200
    except ValueError as ve:
        current_app.logger.error(f"Validation error updating category {category_id}: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f"Error updating category {category_id}: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to update category due to an internal server error."}), 500

# Delete
@blueprint.route("/delete/<string:category_id>", methods=["DELETE"])
def delete(category_id):
    """Delete a category"""
    current_app.logger.info(f"Category deletion requested: {category_id}")

    try:
        category = delete_category(category_id)
        if category is None:
            return jsonify({"error": "Category not found"}), 404

        return jsonify({
            "message": "Category deleted successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error deleting category {category_id}: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to delete category due to an internal server error."}), 500