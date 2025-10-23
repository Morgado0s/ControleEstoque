from utils.db.connection import db
from datetime import datetime
import pytz
import uuid
import bcrypt
from typing import Dict, Optional, List
from flask import current_app
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    gender_id = db.Column(db.String(36), ForeignKey('genders.id'), nullable=True)
    role_id = db.Column(db.String(36), ForeignKey('roles.id'), nullable=False)
    active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(pytz.timezone('America/Sao_Paulo')))
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now(pytz.timezone('America/Sao_Paulo')), onupdate=datetime.now(pytz.timezone('America/Sao_Paulo')))

    # Relationships
    gender_rel = relationship('Gender', back_populates='users')
    role_rel = relationship('Role', back_populates='users')

    def __repr__(self):
        return f"<User {self.id}, Name: {self.name}, Email: {self.email}>"

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "gender_id": self.gender_id,
            "gender_name": self.gender_rel.name if self.gender_rel else None,
            "role_id": self.role_id,
            "role_name": self.role_rel.name if self.role_rel else None,
            "active": self.active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    def serialize_safe(self):
        """Serialize without sensitive information"""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "gender_id": self.gender_id,
            "gender_name": self.gender_rel.name if self.gender_rel else None,
            "role_id": self.role_id,
            "role_name": self.role_rel.name if self.role_rel else None,
            "active": self.active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    def check_password(self, password: str) -> bool:
        """Check if provided password matches stored hash"""
        try:
            return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
        except:
            return False

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    try:
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    except Exception as e:
        current_app.logger.error(f"Error hashing password: {str(e)}")
        raise ValueError("Error processing password")

def validate_user_data(user_data: Dict, require_password: bool = True) -> Optional[str]:
    """Validate user data"""
    if 'name' not in user_data or not user_data['name']:
        return "Name is required"

    if 'email' not in user_data or not user_data['email']:
        return "Email is required"

    # Validate email format
    import re
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, user_data['email']):
        return "Invalid email format"

    if 'role_id' not in user_data or not user_data['role_id']:
        return "Role ID is required"

    # Validate password if required
    if require_password:
        if 'password' not in user_data or not user_data['password']:
            return "Password is required"

        password = user_data['password']
        if len(password) < 6:
            return "Password must be at least 6 characters long"

    # Validate gender if provided
    if 'gender_id' in user_data and user_data['gender_id']:
        from gender.model import get_gender
        gender = get_gender(user_data['gender_id'])
        if not gender:
            return f"Invalid gender ID: {user_data['gender_id']}"

    # Validate role
    from roles.model import get_role
    role = get_role(user_data['role_id'])
    if not role:
        return f"Invalid role ID: {user_data['role_id']}"

    # Check if email already exists (for new users)
    if 'email' in user_data:
        existing_user = find_user_by_email(user_data['email'])
        if existing_user:
            return "Email already registered"

    return None

def create_user(user_data: Dict) -> Optional[User]:
    """Create a new user"""
    current_app.logger.info("Starting user creation")

    # Validate data
    validation_error = validate_user_data(user_data, require_password=True)
    if validation_error:
        raise ValueError(validation_error)

    try:
        # Hash password
        password_hash = hash_password(user_data["password"])

        new_user = User(
            name=user_data["name"],
            email=user_data["email"],
            password_hash=password_hash,
            gender_id=user_data.get("gender_id"),
            role_id=user_data["role_id"],
            active=user_data.get("active", True)
        )
        db.session.add(new_user)
        db.session.commit()

        current_app.logger.info(f"User created successfully: {new_user.name}")
        return new_user
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating user: {str(e)}")
        raise

def get_user(user_id: str) -> Optional[User]:
    """Get user by ID"""
    return User.query.get(user_id)

def find_user_by_email(email: str) -> Optional[User]:
    """Find user by email"""
    return User.query.filter_by(email=email).first()

def get_all_users() -> List[User]:
    """Get all active users"""
    return User.query.filter_by(active=True).all()

def get_users_by_role(role_id: str) -> List[User]:
    """Get all users with a specific role"""
    return User.query.filter_by(role_id=role_id, active=True).all()

def update_user(user_id: str, user_data: Dict) -> Optional[User]:
    """Update an existing user"""
    user = get_user(user_id)
    if not user:
        return None

    # Store current email to check for uniqueness
    current_email = user.email

    try:
        if "name" in user_data:
            user.name = user_data["name"]
        if "email" in user_data and user_data["email"] != current_email:
            # Validate new email format
            import re
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, user_data["email"]):
                raise ValueError("Invalid email format")

            # Check if new email is already taken
            existing_user = find_user_by_email(user_data["email"])
            if existing_user:
                raise ValueError("Email already registered")

            user.email = user_data["email"]

        if "gender_id" in user_data:
            user.gender_id = user_data["gender_id"]
        if "role_id" in user_data:
            user.role_id = user_data["role_id"]
        if "password" in user_data and user_data["password"]:
            # Validate new password
            if len(user_data["password"]) < 6:
                raise ValueError("Password must be at least 6 characters long")

            user.password_hash = hash_password(user_data["password"])
        if "active" in user_data:
            user.active = user_data["active"]

        user.updated_at = datetime.now(pytz.timezone('America/Sao_Paulo'))
        db.session.commit()
        current_app.logger.info(f"User updated: {user.name}")
        return user
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating user: {str(e)}")
        raise

def delete_user(user_id: str) -> Optional[User]:
    """Delete a user (logical deletion)"""
    user = get_user(user_id)
    if user:
        user.active = False
        user.updated_at = datetime.now(pytz.timezone('America/Sao_Paulo'))
        db.session.commit()
        current_app.logger.info(f"User deleted: {user.name}")
        return user
    return None

def hard_delete_user(user_id: str) -> Optional[User]:
    """Hard delete a user"""
    user = get_user(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        current_app.logger.info(f"User hard deleted: {user.name}")
        return user
    return None

def authenticate_user(email: str, password: str) -> Optional[User]:
    """Authenticate user credentials"""
    user = find_user_by_email(email)
    if user and user.active and user.check_password(password):
        current_app.logger.info(f"User authenticated successfully: {user.email}")
        return user
    else:
        current_app.logger.warning(f"Authentication failed for email: {email}")
        return None

def create_admin_user() -> Optional[User]:
    """Create default admin user if it doesn't exist"""
    admin_email = "admin@inventory.com"
    existing_admin = find_user_by_email(admin_email)

    if existing_admin:
        return existing_admin

    try:
        from roles.model import get_admin_role
        admin_role = get_admin_role()
        if not admin_role:
            from roles.model import ensure_default_roles_exist
            ensure_default_roles_exist()
            admin_role = get_admin_role()

        admin_data = {
            "name": "System Administrator",
            "email": admin_email,
            "password": "admin123",  # Should be changed on first login
            "role_id": admin_role.id if admin_role else None,
            "active": True
        }

        admin_user = create_user(admin_data)
        current_app.logger.info("Default admin user created successfully")
        return admin_user
    except Exception as e:
        current_app.logger.error(f"Error creating admin user: {str(e)}")
        return None