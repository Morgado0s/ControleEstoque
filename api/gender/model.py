from utils.db.connection import db
from datetime import datetime
import pytz
import uuid
from typing import Dict, Optional, List
from flask import current_app

class Gender(db.Model):
    __tablename__ = "genders"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(50), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(pytz.timezone('America/Sao_Paulo')))

    # Relationships
    users = db.relationship('User', back_populates='gender_rel', lazy='dynamic')

    def __repr__(self):
        return f"<Gender {self.id}, Name: {self.name}>"

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

def create_gender(gender_data: Dict) -> Optional[Gender]:
    """Create a new gender"""
    current_app.logger.info("Starting gender creation")
    try:
        new_gender = Gender(
            name=gender_data["name"]
        )
        db.session.add(new_gender)
        db.session.commit()

        current_app.logger.info(f"Gender created successfully: {new_gender.name}")
        return new_gender
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating gender: {str(e)}")
        raise

def get_gender(gender_id: str) -> Optional[Gender]:
    """Get gender by ID"""
    return Gender.query.get(gender_id)

def get_gender_by_name(name: str) -> Optional[Gender]:
    """Get gender by name"""
    return Gender.query.filter_by(name=name).first()

def get_all_genders() -> List[Gender]:
    """Get all genders"""
    return Gender.query.all()

def update_gender(gender_id: str, gender_data: Dict) -> Optional[Gender]:
    """Update an existing gender"""
    gender = get_gender(gender_id)
    if gender:
        if "name" in gender_data:
            gender.name = gender_data["name"]

        db.session.commit()
        current_app.logger.info(f"Gender updated: {gender.name}")
        return gender
    return None

def delete_gender(gender_id: str) -> Optional[Gender]:
    """Delete a gender"""
    gender = get_gender(gender_id)
    if gender:
        # Check if gender has users
        if gender.users.count() > 0:
            raise ValueError(f"Cannot delete gender '{gender.name}' because it has associated users")

        db.session.delete(gender)
        db.session.commit()
        current_app.logger.info(f"Gender deleted: {gender.name}")
        return gender
    return None

def ensure_default_genders_exist():
    """Ensure that default genders exist, creating them if necessary"""
    default_genders = ['Male', 'Female', 'Other', 'Prefer not to say']
    created_genders = []

    for gender_name in default_genders:
        gender = get_gender_by_name(gender_name)
        if not gender:
            try:
                gender = create_gender({'name': gender_name})
                created_genders.append(gender)
            except Exception as e:
                current_app.logger.error(f"Error creating gender {gender_name}: {str(e)}")

    return created_genders