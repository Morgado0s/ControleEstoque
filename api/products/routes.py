from flask import request, jsonify, Blueprint, current_app
from products.model import Product, create_product, get_product, update_product, delete_product, get_all_products, get_products_by_warehouse, get_products_by_category, get_low_stock_products
import traceback

blueprint = Blueprint('products', __name__)

# Create
@blueprint.route("/create", methods=["POST"])
def create():
    """Create a new product"""
    current_app.logger.info(f"Product creation requested")
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    required_fields = ["name", "warehouse_id"]
    if not all(field in data for field in required_fields):
        missing = [field for field in required_fields if field not in data]
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        product = create_product(data)
        return jsonify({
            "data": product.serialize(),
            "message": "Product created successfully."
        }), 201
    except ValueError as ve:
        current_app.logger.error(f"Validation error creating product: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f"Error creating product: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to create product due to an internal server error."}), 500

# Read
@blueprint.route("/read/<string:product_id>", methods=["GET"])
def read(product_id):
    """Get product by ID"""
    current_app.logger.info(f"Product read requested: {product_id}")

    try:
        product = get_product(product_id)
        if product is None:
            return jsonify({"error": "Product not found"}), 404

        return jsonify({
            "data": product.serialize(),
            "message": "Product retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving product {product_id}: {str(e)}")
        return jsonify({"error": "Failed to retrieve product due to an internal server error."}), 500

# Read All
@blueprint.route("/read/all", methods=["GET"])
def read_all():
    """Get all active products"""
    current_app.logger.info(f"All products requested")

    try:
        products = get_all_products()
        products_data = [product.serialize() for product in products]

        return jsonify({
            "data": products_data,
            "message": "Products retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving all products: {str(e)}")
        return jsonify({"error": "Failed to retrieve products due to an internal server error."}), 500

# Get Low Stock Products
@blueprint.route("/read/low-stock", methods=["GET"])
def read_low_stock():
    """Get products with low stock"""
    current_app.logger.info(f"Low stock products requested")

    try:
        products = get_low_stock_products()
        products_data = [product.serialize() for product in products]

        return jsonify({
            "data": products_data,
            "message": "Low stock products retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving low stock products: {str(e)}")
        return jsonify({"error": "Failed to retrieve low stock products due to an internal server error."}), 500

# Get Products by Warehouse
@blueprint.route("/read/warehouse/<string:warehouse_id>", methods=["GET"])
def read_by_warehouse(warehouse_id):
    """Get products by warehouse"""
    current_app.logger.info(f"Products by warehouse requested: {warehouse_id}")

    try:
        products = get_products_by_warehouse(warehouse_id)
        products_data = [product.serialize() for product in products]

        return jsonify({
            "data": products_data,
            "message": "Products by warehouse retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving products by warehouse {warehouse_id}: {str(e)}")
        return jsonify({"error": "Failed to retrieve products by warehouse due to an internal server error."}), 500

# Get Products by Category
@blueprint.route("/read/category/<string:category_id>", methods=["GET"])
def read_by_category(category_id):
    """Get products by category"""
    current_app.logger.info(f"Products by category requested: {category_id}")

    try:
        products = get_products_by_category(category_id)
        products_data = [product.serialize() for product in products]

        return jsonify({
            "data": products_data,
            "message": "Products by category retrieved successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving products by category {category_id}: {str(e)}")
        return jsonify({"error": "Failed to retrieve products by category due to an internal server error."}), 500

# Update
@blueprint.route("/update/<string:product_id>", methods=["PUT"])
def update(product_id):
    """Update an existing product"""
    current_app.logger.info(f"Product update requested: {product_id}")

    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    try:
        product = update_product(product_id, data)
        if product is None:
            return jsonify({"error": "Product not found"}), 404

        return jsonify({
            "data": product.serialize(),
            "message": "Product updated successfully."
        }), 200
    except ValueError as ve:
        current_app.logger.error(f"Validation error updating product {product_id}: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f"Error updating product {product_id}: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to update product due to an internal server error."}), 500

# Delete
@blueprint.route("/delete/<string:product_id>", methods=["DELETE"])
def delete(product_id):
    """Delete a product"""
    current_app.logger.info(f"Product deletion requested: {product_id}")

    try:
        product = delete_product(product_id)
        if product is None:
            return jsonify({"error": "Product not found"}), 404

        return jsonify({
            "message": "Product deleted successfully."
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error deleting product {product_id}: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to delete product due to an internal server error."}), 500