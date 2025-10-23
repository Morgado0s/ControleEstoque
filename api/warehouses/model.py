from utils.db.connection import db
from datetime import datetime
import pytz
import uuid
from typing import Dict, Optional, List
from flask import current_app

class Warehouse(db.Model):
    __tablename__ = "warehouses"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(pytz.timezone('America/Sao_Paulo')))
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now(pytz.timezone('America/Sao_Paulo')), onupdate=datetime.now(pytz.timezone('America/Sao_Paulo')))

    # Relationships
    products = db.relationship('Product', back_populates='warehouse_rel', lazy='dynamic')

    def __repr__(self):
        return f"<Warehouse {self.id}, Name: {self.name}>"

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "active": self.active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

def create_warehouse(warehouse_data: Dict) -> Optional[Warehouse]:
    """Create a new warehouse"""
    current_app.logger.info("Starting warehouse creation")
    try:
        new_warehouse = Warehouse(
            name=warehouse_data["name"],
            description=warehouse_data.get("description"),
            active=warehouse_data.get("active", True)
        )
        db.session.add(new_warehouse)
        db.session.commit()

        current_app.logger.info(f"Warehouse created successfully: {new_warehouse.name}")
        return new_warehouse
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating warehouse: {str(e)}")
        raise

def get_warehouse(warehouse_id: str) -> Optional[Warehouse]:
    """Get warehouse by ID"""
    return Warehouse.query.get(warehouse_id)

def get_warehouse_by_name(name: str) -> Optional[Warehouse]:
    """Get warehouse by name"""
    return Warehouse.query.filter_by(name=name).first()

def get_all_warehouses() -> List[Warehouse]:
    """Get all active warehouses"""
    return Warehouse.query.filter_by(active=True).all()

def update_warehouse(warehouse_id: str, warehouse_data: Dict) -> Optional[Warehouse]:
    """Update an existing warehouse"""
    warehouse = get_warehouse(warehouse_id)
    if warehouse:
        if "name" in warehouse_data:
            warehouse.name = warehouse_data["name"]
        if "description" in warehouse_data:
            warehouse.description = warehouse_data["description"]
        if "active" in warehouse_data:
            warehouse.active = warehouse_data["active"]

        warehouse.updated_at = datetime.now(pytz.timezone('America/Sao_Paulo'))
        db.session.commit()
        current_app.logger.info(f"Warehouse updated: {warehouse.name}")
        return warehouse
    return None

def delete_warehouse(warehouse_id: str) -> Optional[Warehouse]:
    """Delete a warehouse (logical deletion)"""
    warehouse = get_warehouse(warehouse_id)
    if warehouse:
        # Check if warehouse has products
        if warehouse.products.count() > 0:
            raise ValueError(f"Cannot delete warehouse '{warehouse.name}' because it has associated products")

        warehouse.active = False
        warehouse.updated_at = datetime.now(pytz.timezone('America/Sao_Paulo'))
        db.session.commit()
        current_app.logger.info(f"Warehouse deleted: {warehouse.name}")
        return warehouse
    return None

def hard_delete_warehouse(warehouse_id: str) -> Optional[Warehouse]:
    """Hard delete a warehouse"""
    warehouse = get_warehouse(warehouse_id)
    if warehouse:
        # Check if warehouse has products
        if warehouse.products.count() > 0:
            raise ValueError(f"Cannot delete warehouse '{warehouse.name}' because it has associated products")

        db.session.delete(warehouse)
        db.session.commit()
        current_app.logger.info(f"Warehouse hard deleted: {warehouse.name}")
        return warehouse
    return None