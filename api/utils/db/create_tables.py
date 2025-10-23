from utils.db.connection import db
from categories.model import Category
from warehouses.model import Warehouse
from products.model import Product
from entries.model import Entry
from exits.model import Exit
from users.model import User
from gender.model import Gender
from roles.model import Role
from flask import current_app
from sqlalchemy import inspect

def create_tables():
    """Create all database tables"""
    try:
        db.create_all()
        current_app.logger.info("Database tables created successfully")
        return True
    except Exception as e:
        current_app.logger.error(f"Error creating database tables: {str(e)}")
        return False

def insert_default_data():
    """Insert default data into database"""
    try:
        # Create admin user if doesn't exist
        from users.model import create_admin_user
        admin_user = create_admin_user()
        if admin_user:
            current_app.logger.info("Default admin user created or verified")
        else:
            current_app.logger.info("Admin user already exists")

        current_app.logger.info("Default data insertion completed")
        return True
    except Exception as e:
        current_app.logger.error(f"Error inserting default data: {str(e)}")
        return False

def check_tables_exist():
    """Check if database tables already exist"""
    try:
        inspector = inspect(db.engine)
        existing_tables = inspector.get_table_names()
        current_app.logger.info(f"Existing tables: {existing_tables}")
        return len(existing_tables) > 0
    except Exception as e:
        current_app.logger.error(f"Error checking existing tables: {str(e)}")
        return False

def get_existing_tables():
    """Get list of existing database tables"""
    try:
        inspector = inspect(db.engine)
        return inspector.get_table_names()
    except Exception as e:
        current_app.logger.error(f"Error getting existing tables: {str(e)}")
        return []