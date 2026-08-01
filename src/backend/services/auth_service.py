from werkzeug.security import generate_password_hash

from database import db
from models.user import User


def register_user(data):
    """
    Register a new user.
    """

    # Check if email already exists
    existing_user = User.query.filter_by(email=data["email"]).first()

    if existing_user:
        return {
            "success": False,
            "message": "Email already exists."
        }, 409

    # Hash the password
    hashed_password = generate_password_hash(data["password"])

    # Create new user
    new_user = User(
        role_id=data["role_id"],
        first_name=data["first_name"],
        last_name=data["last_name"],
        email=data["email"],
        password_hash=hashed_password,
        phone=data.get("phone")
    )

    db.session.add(new_user)
    db.session.commit()

    return {
        "success": True,
        "message": "User registered successfully."
    }, 201