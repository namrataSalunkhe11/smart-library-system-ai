from flask import Flask
from flask_cors import CORS

from config import Config
from database import db, migrate

# Import models so Flask-Migrate can detect them
from models import Role, User, Author, Category,Book,BookCopy
# Import Blueprints
from routes.auth_routes import auth_bp
from routes.book_routes import book_bp
from routes.book_copy_routes import book_copy_bp
from routes.issue_transaction_routes import issue_transaction_bp
from flask_jwt_extended import JWTManager


def create_app():
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(Config)

    # Enable CORS
    CORS(app)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    jwt = JWTManager(app)

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(book_bp)
    app.register_blueprint(book_copy_bp)
    app.register_blueprint(issue_transaction_bp)

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