from utils.db.connection import db
from datetime import datetime, date
import pytz
import uuid
from typing import Dict, Optional, List
from flask import current_app
from sqlalchemy import ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship

class Entry(db.Model):
    __tablename__ = "entries"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = db.Column(db.String(36), ForeignKey('products.id'), nullable=False)
    entry_date = db.Column(db.Date, nullable=False)
    quantity = db.Column(db.Numeric(10, 2), nullable=False)
    observation = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(pytz.timezone('America/Sao_Paulo')))
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now(pytz.timezone('America/Sao_Paulo')), onupdate=datetime.now(pytz.timezone('America/Sao_Paulo')))

    # Relationships
    product_rel = relationship('Product', back_populates='entries')

    # Constraints
    __table_args__ = (
        CheckConstraint('quantity > 0', name='ck_entry_quantity_positive'),
    )

    def __repr__(self):
        return f"<Entry {self.id}, Product: {self.product_id}, Quantity: {self.quantity}>"

    def serialize(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "entry_date": self.entry_date.isoformat() if self.entry_date else None,
            "quantity": float(self.quantity) if self.quantity else 0,
            "observation": self.observation,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "product_name": self.product_rel.name if self.product_rel else None
        }

def validate_entry_data(entry_data: Dict) -> Optional[str]:
    """Validate entry data"""
    if 'product_id' not in entry_data or not entry_data['product_id']:
        return "Product ID is required"

    if 'quantity' not in entry_data:
        return "Quantity is required"

    if 'entry_date' not in entry_data:
        return "Entry date is required"

    # Validate product exists
    from products.model import get_product
    product = get_product(entry_data['product_id'])
    if not product:
        return f"Invalid product ID: {entry_data['product_id']}"

    # Validate quantity
    try:
        quantity = float(entry_data['quantity'])
        if quantity <= 0:
            return "Quantity must be greater than 0"
    except (ValueError, TypeError):
        return "Quantity must be a valid number"

    # Validate date
    try:
        if isinstance(entry_data['entry_date'], str):
            entry_date = datetime.strptime(entry_data['entry_date'], '%Y-%m-%d').date()
        elif isinstance(entry_data['entry_date'], date):
            entry_date = entry_data['entry_date']
        else:
            return "Entry date must be a valid date (YYYY-MM-DD format)"
    except (ValueError, TypeError):
        return "Entry date must be a valid date (YYYY-MM-DD format)"

    return None

def create_entry(entry_data: Dict) -> Optional[Entry]:
    """Create a new stock entry"""
    current_app.logger.info("Starting entry creation")

    # Validate data
    validation_error = validate_entry_data(entry_data)
    if validation_error:
        raise ValueError(validation_error)

    try:
        new_entry = Entry(
            product_id=entry_data["product_id"],
            entry_date=entry_data["entry_date"],
            quantity=entry_data["quantity"],
            observation=entry_data.get("observation")
        )
        db.session.add(new_entry)
        db.session.commit()

        current_app.logger.info(f"Entry created successfully: Product {new_entry.product_id}, Quantity {new_entry.quantity}")
        return new_entry
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating entry: {str(e)}")
        raise

def get_entry(entry_id: str) -> Optional[Entry]:
    """Get entry by ID"""
    return Entry.query.get(entry_id)

def get_all_entries() -> List[Entry]:
    """Get all entries"""
    return Entry.query.order_by(Entry.entry_date.desc()).all()

def get_entries_by_product(product_id: str) -> List[Entry]:
    """Get all entries for a specific product"""
    return Entry.query.filter_by(product_id=product_id).order_by(Entry.entry_date.desc()).all()

def get_entries_by_date_range(start_date: date, end_date: date) -> List[Entry]:
    """Get all entries within a date range"""
    return Entry.query.filter(
        Entry.entry_date >= start_date,
        Entry.entry_date <= end_date
    ).order_by(Entry.entry_date.desc()).all()

def get_entries_by_warehouse(warehouse_id: str) -> List[Entry]:
    """Get all entries for products in a specific warehouse"""
    return Entry.query.join(Product).filter(
        Product.warehouse_id == warehouse_id
    ).order_by(Entry.entry_date.desc()).all()

def update_entry(entry_id: str, entry_data: Dict) -> Optional[Entry]:
    """Update an existing entry"""
    entry = get_entry(entry_id)
    if not entry:
        return None

    # Validate new data
    validation_error = validate_entry_data(entry_data)
    if validation_error:
        raise ValueError(validation_error)

    try:
        if "product_id" in entry_data:
            entry.product_id = entry_data["product_id"]
        if "entry_date" in entry_data:
            entry.entry_date = entry_data["entry_date"]
        if "quantity" in entry_data:
            entry.quantity = entry_data["quantity"]
        if "observation" in entry_data:
            entry.observation = entry_data["observation"]

        entry.updated_at = datetime.now(pytz.timezone('America/Sao_Paulo'))
        db.session.commit()
        current_app.logger.info(f"Entry updated: {entry.id}")
        return entry
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating entry: {str(e)}")
        raise

def delete_entry(entry_id: str) -> Optional[Entry]:
    """Delete an entry"""
    entry = get_entry(entry_id)
    if entry:
        db.session.delete(entry)
        db.session.commit()
        current_app.logger.info(f"Entry deleted: {entry.id}")
        return entry
    return None