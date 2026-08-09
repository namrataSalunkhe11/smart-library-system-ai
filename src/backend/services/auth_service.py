from werkzeug.security import generate_password_hash

from database import db
from models.user import User
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token

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

def login_user(data):
    """
    Authenticate a user and generate a JWT token.
    """

    user = User.query.filter_by(email=data["email"]).first()

    if not user:
        return {
            "success": False,
            "message": "Invalid email or password."
        }, 401

    if not check_password_hash(user.password_hash, data["password"]):
        return {
            "success": False,
            "message": "Invalid email or password."
        }, 401

    access_token = create_access_token(
        identity=str(user.user_id),
        additional_claims={
            "role_id": user.role_id,
            "role": user.role.role_name
        }
    )

    return {
        "success": True,
        "message": "Login successful.",
        "access_token": access_token,
        "user": {
            "user_id": user.user_id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role_id": user.role_id
        }
    }, 200