from flask import Flask
from flask_cors import CORS

from config import Config
from database import db, migrate

# Import models so Flask-Migrate can detect them
from models import Role, User


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)

    @app.route("/")
    def home():
        return {
            "project": "Smart Library System with AI Recommendations",
            "status": "Running"
        }

    @app.route("/health")
    def health():
        return {
            "status": "success",
            "database": "Connected",
            "orm": "SQLAlchemy"
        }

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)