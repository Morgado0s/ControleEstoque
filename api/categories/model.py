from utils.db.connection import db
from datetime import datetime
import pytz
import uuid
from typing import Dict, Optional, List
from flask import current_app

class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(pytz.timezone('America/Sao_Paulo')))
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now(pytz.timezone('America/Sao_Paulo')), onupdate=datetime.now(pytz.timezone('America/Sao_Paulo')))

    products = db.relationship('Product', back_populates='category_rel', lazy='dynamic')

    def __repr__(self):
        return f"<Category {self.id}, Name: {self.name}>"

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "active": self.active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

def create_category(category_data: Dict) -> Optional[Category]:
    current_app.logger.info("Starting category creation")
    try:
        new_category = Category(
            name=category_data["name"],
            description=category_data.get("description"),
            active=category_data.get("active", True)
        )
        db.session.add(new_category)
        db.session.commit()

        current_app.logger.info(f"Category created successfully: {new_category.name}")
        return new_category
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating category: {str(e)}")
        raise

def get_category(category_id: str) -> Optional[Category]:
    return Category.query.get(category_id)

def get_category_by_name(name: str) -> Optional[Category]:
    return Category.query.filter_by(name=name).first()

def get_all_categories() -> List[Category]:
    return Category.query.filter_by(active=True).all()

def update_category(category_id: str, category_data: Dict) -> Optional[Category]:
    category = get_category(category_id)
    if category:
        if "name" in category_data:
            category.name = category_data["name"]
        if "description" in category_data:
            category.description = category_data["description"]
        if "active" in category_data:
            category.active = category_data["active"]

        category.updated_at = datetime.now(pytz.timezone('America/Sao_Paulo'))
        db.session.commit()
        current_app.logger.info(f"Category updated: {category.name}")
        return category
    return None

def delete_category(category_id: str) -> Optional[Category]:
    category = get_category(category_id)
    if category:
        category.active = False
        category.updated_at = datetime.now(pytz.timezone('America/Sao_Paulo'))
        db.session.commit()
        current_app.logger.info(f"Category deleted: {category.name}")
        return category
    return None

def hard_delete_category(category_id: str) -> Optional[Category]:
    category = get_category(category_id)
    if category:
        db.session.delete(category)
        db.session.commit()
        current_app.logger.info(f"Category hard deleted: {category.name}")
        return category
    return None