from flask import Flask, jsonify, current_app
from sqlalchemy import text
from utils.db.config import database_uri
from utils.db.connection import init_db, db
from blueprints import register_blueprints
from flask_cors import CORS
from utils.db.create_tables import create_tables, insert_default_data
import os

# Initialize Flask application
application = Flask(__name__)

# CORS configuration for React frontend
CORS(application, resources={
    r"/*": {
        "origins": [
            "http://localhost:5173",    # Vite frontend
            "http://localhost:3000",    # Alternative frontend
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
        "supports_credentials": True
    }
})

# Database configuration
application.config["SQLALCHEMY_DATABASE_URI"] = database_uri()
application.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize database
init_db(application)

# Create database tables and insert default data
with application.app_context():
    create_tables()
    insert_default_data()

# Register blueprints
register_blueprints(application)

# Health check endpoint
@application.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    try:
        with application.app_context():
            db.session.execute(text('SELECT 1'))
            return jsonify({
                "message": "API is up and running!",
                "database": "connected",
                "version": "1.0.0"
            }), 200
    except Exception as e:
        current_app.logger.error(f"Health check failed: {str(e)}")
        return jsonify({
            "message": "API health check failed",
            "database": "disconnected",
            "error": str(e)
        }), 503

if __name__ == "__main__":
    application.run(debug=True, host='0.0.0.0', port=5000)