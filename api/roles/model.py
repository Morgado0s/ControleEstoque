from utils.db.connection import db
from datetime import datetime
import pytz
import uuid
from typing import Dict, Optional, List
from flask import current_app

class Role(db.Model):
    __tablename__ = "roles"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(pytz.timezone('America/Sao_Paulo')))

    # Relationships
    users = db.relationship('User', back_populates='role_rel', lazy='dynamic')

    def __repr__(self):
        return f"<Role {self.id}, Name: {self.name}>"

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

def create_role(role_data: Dict) -> Optional[Role]:
    """Create a new role"""
    current_app.logger.info("Starting role creation")
    try:
        new_role = Role(
            name=role_data["name"],
            description=role_data.get("description")
        )
        db.session.add(new_role)
        db.session.commit()

        current_app.logger.info(f"Role created successfully: {new_role.name}")
        return new_role
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating role: {str(e)}")
        raise

def get_role(role_id: str) -> Optional[Role]:
    """Get role by ID"""
    return Role.query.get(role_id)

def get_role_by_name(name: str) -> Optional[Role]:
    """Get role by name"""
    return Role.query.filter_by(name=name).first()

def get_all_roles() -> List[Role]:
    """Get all roles"""
    return Role.query.all()

def update_role(role_id: str, role_data: Dict) -> Optional[Role]:
    """Update an existing role"""
    role = get_role(role_id)
    if role:
        if "name" in role_data:
            role.name = role_data["name"]
        if "description" in role_data:
            role.description = role_data["description"]

        db.session.commit()
        current_app.logger.info(f"Role updated: {role.name}")
        return role
    return None

def delete_role(role_id: str) -> Optional[Role]:
    """Delete a role"""
    role = get_role(role_id)
    if role:
        # Check if role has users
        if role.users.count() > 0:
            raise ValueError(f"Cannot delete role '{role.name}' because it has associated users")

        db.session.delete(role)
        db.session.commit()
        current_app.logger.info(f"Role deleted: {role.name}")
        return role
    return None

def ensure_default_roles_exist():
    """Ensure that default roles exist, creating them if necessary"""
    default_roles = [
        {'name': 'Administrator', 'description': 'System administrator with full access'},
        {'name': 'Manager', 'description': 'Warehouse manager with operational access'},
        {'name': 'Employee', 'description': 'Regular employee with limited access'},
        {'name': 'Operator', 'description': 'Operator with basic operational access'}
    ]
    created_roles = []

    for role_data in default_roles:
        role = get_role_by_name(role_data['name'])
        if not role:
            try:
                role = create_role(role_data)
                created_roles.append(role)
            except Exception as e:
                current_app.logger.error(f"Error creating role {role_data['name']}: {str(e)}")

    return created_roles

def get_admin_role() -> Optional[Role]:
    """Get the administrator role"""
    return get_role_by_name('Administrator')