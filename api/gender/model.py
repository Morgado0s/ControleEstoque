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
    return Gender.query.get(gender_id)

def get_gender_by_name(name: str) -> Optional[Gender]:
    return Gender.query.filter_by(name=name).first()

def get_all_genders() -> List[Gender]:
    return Gender.query.all()

def update_gender(gender_id: str, gender_data: Dict) -> Optional[Gender]:
    gender = get_gender(gender_id)
    if gender:
        if "name" in gender_data:
            gender.name = gender_data["name"]

        db.session.commit()
        current_app.logger.info(f"Gender updated: {gender.name}")
        return gender
    return None

def delete_gender(gender_id: str) -> Optional[Gender]:
    gender = get_gender(gender_id)
    if gender:
        if gender.users.count() > 0:
            raise ValueError(f"Cannot delete gender '{gender.name}' because it has associated users")

        db.session.delete(gender)
        db.session.commit()
        current_app.logger.info(f"Gender deleted: {gender.name}")
        return gender
    return None

