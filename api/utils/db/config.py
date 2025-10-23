from flask import abort
from dotenv import load_dotenv
import os

load_dotenv()

def database_uri():
    required_vars = ["DB_HOST", "DB_PORT", "DB_DATABASE",
                     "DB_USER", "DB_PASSWORD"]

    for var in required_vars:
        if not os.getenv(var):
            raise ValueError(f"Missing required environment variable: {var}")

    db_host = os.getenv("DB_HOST")
    db_port = os.getenv("DB_PORT")
    db_database = os.getenv("DB_DATABASE")
    db_username = os.getenv("DB_USER")
    db_password = os.getenv("DB_PASSWORD")

    return f'mysql+mysqlconnector://{db_username}:{db_password}@{db_host}:{db_port}/{db_database}'