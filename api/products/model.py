from utils.db.connection import db
from datetime import datetime
import pytz
import uuid
from typing import Dict, Optional, List
from flask import current_app
from sqlalchemy import ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship

class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(200), nullable=False)
    category_id = db.Column(db.String(36), ForeignKey('categories.id'), nullable=True)
    warehouse_id = db.Column(db.String(36), ForeignKey('warehouses.id'), nullable=False)
    min_quantity = db.Column(db.Numeric(10, 2), nullable=False)
    unit_cost = db.Column(db.Numeric(10, 2), nullable=False)
    observation = db.Column(db.Text, nullable=True)
    active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(pytz.timezone('America/Sao_Paulo')))
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now(pytz.timezone('America/Sao_Paulo')), onupdate=datetime.now(pytz.timezone('America/Sao_Paulo')))

    category_rel = relationship('Category', back_populates='products')
    warehouse_rel = relationship('Warehouse', back_populates='products')
    entries = relationship('Entry', back_populates='product_rel', lazy='dynamic', cascade='all, delete-orphan')
    exits = relationship('Exit', back_populates='product_rel', lazy='dynamic', cascade='all, delete-orphan')

    __table_args__ = (
        CheckConstraint('min_quantity >= 0', name='ck_min_quantity_positive'),
        CheckConstraint('unit_cost >= 0', name='ck_unit_cost_positive'),
    )

    def __repr__(self):
        return f"<Product {self.id}, Name: {self.name}>"

    def serialize(self):
        current_stock = get_product_current_stock(self.id)
        stock_status = get_stock_status(current_stock, float(self.min_quantity) if self.min_quantity else 0)

        return {
            "id": self.id,
            "name": self.name,
            "category_id": self.category_id,
            "warehouse_id": self.warehouse_id,
            "min_quantity": float(self.min_quantity) if self.min_quantity else 0,
            "unit_cost": float(self.unit_cost) if self.unit_cost else 0,
            "observation": self.observation,
            "active": self.active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "current_stock": current_stock,
            "stock_status": stock_status,
            "category_name": self.category_rel.name if self.category_rel else None,
            "warehouse_name": self.warehouse_rel.name if self.warehouse_rel else None
        }

    
def validate_product_data(product_data: Dict) -> Optional[str]:
    if 'name' not in product_data or not product_data['name']:
        return "Product name is required"

    if 'warehouse_id' not in product_data or not product_data['warehouse_id']:
        return "Warehouse ID is required"

    if 'min_quantity' in product_data:
        try:
            min_qty = float(product_data['min_quantity'])
            if min_qty < 0:
                return "Minimum quantity must be greater than or equal to 0"
        except (ValueError, TypeError):
            return "Minimum quantity must be a valid number"

    if 'unit_cost' in product_data:
        try:
            cost = float(product_data['unit_cost'])
            if cost < 0:
                return "Unit cost must be greater than or equal to 0"
        except (ValueError, TypeError):
            return "Unit cost must be a valid number"

    if 'category_id' in product_data and product_data['category_id']:
        from categories.model import get_category
        category = get_category(product_data['category_id'])
        if not category:
            return f"Invalid category ID: {product_data['category_id']}"

    from warehouses.model import get_warehouse
    warehouse = get_warehouse(product_data['warehouse_id'])
    if not warehouse:
        return f"Invalid warehouse ID: {product_data['warehouse_id']}"

    return None

def create_product(product_data: Dict) -> Optional[Product]:
    current_app.logger.info("Starting product creation")

    validation_error = validate_product_data(product_data)
    if validation_error:
        raise ValueError(validation_error)

    try:
        new_product = Product(
            name=product_data["name"],
            category_id=product_data.get("category_id"),
            warehouse_id=product_data["warehouse_id"],
            min_quantity=product_data.get("min_quantity", 0),
            unit_cost=product_data.get("unit_cost", 0),
            observation=product_data.get("observation"),
            active=product_data.get("active", True)
        )
        db.session.add(new_product)
        db.session.commit()

        current_app.logger.info(f"Product created successfully: {new_product.name}")
        return new_product
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating product: {str(e)}")
        raise

def get_product(product_id: str) -> Optional[Product]:
    return Product.query.get(product_id)

def get_all_products() -> List[Product]:
    return Product.query.filter_by(active=True).all()

def get_products_by_warehouse(warehouse_id: str) -> List[Product]:
    return Product.query.filter_by(warehouse_id=warehouse_id, active=True).all()

def get_products_by_category(category_id: str) -> List[Product]:
    return Product.query.filter_by(category_id=category_id, active=True).all()

def get_low_stock_products() -> List[Product]:
    products = Product.query.filter_by(active=True).all()
    low_stock = []

    for product in products:
        current_stock = get_product_current_stock(product.id)
        min_quantity = float(product.min_quantity) if product.min_quantity else 0

        if current_stock <= min_quantity:
            low_stock.append(product)

    return low_stock

def update_product(product_id: str, product_data: Dict) -> Optional[Product]:
    product = get_product(product_id)
    if not product:
        return None

    validation_error = validate_product_data(product_data)
    if validation_error:
        raise ValueError(validation_error)

    try:
        if "name" in product_data:
            product.name = product_data["name"]
        if "category_id" in product_data:
            product.category_id = product_data["category_id"]
        if "warehouse_id" in product_data:
            product.warehouse_id = product_data["warehouse_id"]
        if "min_quantity" in product_data:
            product.min_quantity = product_data["min_quantity"]
        if "unit_cost" in product_data:
            product.unit_cost = product_data["unit_cost"]
        if "observation" in product_data:
            product.observation = product_data["observation"]
        if "active" in product_data:
            product.active = product_data["active"]

        product.updated_at = datetime.now(pytz.timezone('America/Sao_Paulo'))
        db.session.commit()
        current_app.logger.info(f"Product updated: {product.name}")
        return product
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating product: {str(e)}")
        raise

def delete_product(product_id: str) -> Optional[Product]:
    product = get_product(product_id)
    if product:
        product.active = False
        product.updated_at = datetime.now(pytz.timezone('America/Sao_Paulo'))
        db.session.commit()
        current_app.logger.info(f"Product deleted: {product.name}")
        return product
    return None

def hard_delete_product(product_id: str) -> Optional[Product]:
    product = get_product(product_id)
    if product:
        db.session.delete(product)
        db.session.commit()
        current_app.logger.info(f"Product hard deleted: {product.name}")
        return product
    return None