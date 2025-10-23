"""
Stock Calculator Utility
Standalone functions to calculate product stock without circular imports
"""

from sqlalchemy import text
from utils.db.connection import db


def get_product_current_stock(product_id: str) -> float:
    """
    Calculate current stock for a product by summing entries and exits

    Args:
        product_id: UUID of the product

    Returns:
        Current stock level (entries - exits)
    """
    try:
        # Sum all entry quantities for this product
        entry_result = db.session.execute(
            text("SELECT COALESCE(SUM(quantity), 0) FROM entries WHERE product_id = :product_id AND active = 1"),
            {"product_id": product_id}
        ).scalar()

        # Sum all exit quantities for this product
        exit_result = db.session.execute(
            text("SELECT COALESCE(SUM(quantity), 0) FROM exits WHERE product_id = :product_id AND active = 1"),
            {"product_id": product_id}
        ).scalar()

        total_entries = entry_result or 0
        total_exits = exit_result or 0

        current_stock = total_entries - total_exits

        # Ensure non-negative result
        return max(0, current_stock)

    except Exception as e:
        print(f"Error calculating stock for product {product_id}: {e}")
        return 0.0


def get_stock_status(current_stock: float, min_quantity: float) -> str:
    """
    Determine stock status based on current and minimum quantities

    Args:
        current_stock: Current stock level
        min_quantity: Minimum stock threshold

    Returns:
        'critical', 'warning', or 'success'
    """
    if current_stock <= 0:
        return 'critical'
    elif current_stock <= min_quantity:
        return 'warning'
    else:
        return 'success'