from flask_sqlalchemy import SQLAlchemy
import time
from sqlalchemy.exc import OperationalError
from flask import current_app

db = SQLAlchemy()

def init_db(app):
    """Initialize database with Flask app"""
    db.init_app(app)

def connect_to_db(app, max_retries=5, delay=5):
    """Test database connection with retries"""
    for attempt in range(max_retries):
        try:
            with app.app_context():
                db.session.commit()
                current_app.logger.info(f"Database connection successful on attempt {attempt + 1}")
                return True
        except OperationalError as e:
            if attempt < max_retries - 1:
                current_app.logger.warning(f"Database connection attempt {attempt + 1} failed. Retrying in {delay} seconds...")
                time.sleep(delay)
            else:
                current_app.logger.error("Database connection failed after all attempts")
                raise e