from utils.db.connection import db
from datetime import datetime, date
import pytz
import uuid
from typing import Dict, Optional, List
from flask import current_app
from sqlalchemy import ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship

class Exit(db.Model):
    __tablename__ = "exits"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = db.Column(db.String(36), ForeignKey('products.id'), nullable=False)
    exit_date = db.Column(db.Date, nullable=False)
    quantity = db.Column(db.Numeric(10, 2), nullable=False)
    observation = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(pytz.timezone('America/Sao_Paulo')))
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now(pytz.timezone('America/Sao_Paulo')), onupdate=datetime.now(pytz.timezone('America/Sao_Paulo')))

    product_rel = relationship('Product', back_populates='exits')

    __table_args__ = (
        CheckConstraint('quantity > 0', name='ck_exit_quantity_positive'),
    )

    def __repr__(self):
        return f"<Exit {self.id}, Product: {self.product_id}, Quantity: {self.quantity}>"

    def serialize(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "exit_date": self.exit_date.isoformat() if self.exit_date else None,
            "quantity": float(self.quantity) if self.quantity else 0,
            "observation": self.observation,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "product_name": self.product_rel.name if self.product_rel else None
        }

def validate_exit_data(exit_data: Dict) -> Optional[str]:
    if 'product_id' not in exit_data or not exit_data['product_id']:
        return "Product ID is required"

    if 'quantity' not in exit_data:
        return "Quantity is required"

    if 'exit_date' not in exit_data:
        return "Exit date is required"

    from products.model import get_product
    product = get_product(exit_data['product_id'])
    if not product:
        return f"Invalid product ID: {exit_data['product_id']}"

    current_stock = product.get_current_stock() if product else 0
    try:
        quantity = float(exit_data['quantity'])
        if quantity <= 0:
            return "Quantity must be greater than 0"
        if quantity > current_stock:
            return f"Insufficient stock. Current: {current_stock}, Requested: {quantity}"
    except (ValueError, TypeError):
        return "Quantity must be a valid number"

    try:
        if isinstance(exit_data['exit_date'], str):
            exit_date = datetime.strptime(exit_data['exit_date'], '%Y-%m-%d').date()
        elif isinstance(exit_data['exit_date'], date):
            exit_date = exit_data['exit_date']
        else:
            return "Exit date must be a valid date (YYYY-MM-DD format)"
    except (ValueError, TypeError):
        return "Exit date must be a valid date (YYYY-MM-DD format)"

    return None

def create_exit(exit_data: Dict) -> Optional[Exit]:
    current_app.logger.info("Starting exit creation")

    validation_error = validate_exit_data(exit_data)
    if validation_error:
        raise ValueError(validation_error)

    try:
        new_exit = Exit(
            product_id=exit_data["product_id"],
            exit_date=exit_data["exit_date"],
            quantity=exit_data["quantity"],
            observation=exit_data.get("observation")
        )
        db.session.add(new_exit)
        db.session.commit()

        current_app.logger.info(f"Exit created successfully: Product {new_exit.product_id}, Quantity {new_exit.quantity}")
        return new_exit
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating exit: {str(e)}")
        raise

def get_exit(exit_id: str) -> Optional[Exit]:
    return Exit.query.get(exit_id)

def get_all_exits() -> List[Exit]:
    return Exit.query.order_by(Exit.exit_date.desc()).all()

def get_exits_by_product(product_id: str) -> List[Exit]:
    return Exit.query.filter_by(product_id=product_id).order_by(Exit.exit_date.desc()).all()

def get_exits_by_date_range(start_date: date, end_date: date) -> List[Exit]:
    return Exit.query.filter(
        Exit.exit_date >= start_date,
        Exit.exit_date <= end_date
    ).order_by(Exit.exit_date.desc()).all()

def get_exits_by_warehouse(warehouse_id: str) -> List[Exit]:
    return Exit.query.join(Product).filter(
        Product.warehouse_id == warehouse_id
    ).order_by(Exit.exit_date.desc()).all()

def update_exit(exit_id: str, exit_data: Dict) -> Optional[Exit]:
    exit_record = get_exit(exit_id)
    if not exit_record:
        return None

    validation_error = validate_exit_data(exit_data)
    if validation_error:
        raise ValueError(validation_error)

    try:
        if "product_id" in exit_data:
            exit_record.product_id = exit_data["product_id"]
        if "exit_date" in exit_data:
            exit_record.exit_date = exit_data["exit_date"]
        if "quantity" in exit_data:
            exit_record.quantity = exit_data["quantity"]
        if "observation" in exit_data:
            exit_record.observation = exit_data["observation"]

        exit_record.updated_at = datetime.now(pytz.timezone('America/Sao_Paulo'))
        db.session.commit()
        current_app.logger.info(f"Exit updated: {exit_record.id}")
        return exit_record
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating exit: {str(e)}")
        raise

def delete_exit(exit_id: str) -> Optional[Exit]:
    exit_record = get_exit(exit_id)
    if exit_record:
        db.session.delete(exit_record)
        db.session.commit()
        current_app.logger.info(f"Exit deleted: {exit_record.id}")
        return exit_record
    return None