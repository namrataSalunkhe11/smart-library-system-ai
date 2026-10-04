from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token

from database import db
from models.user import User



def register_user(data, is_admin=False):
    """
    Register a new user.

    Public student registration:
        status = PENDING

    Admin-created users:
        status = ACTIVE

    Rejected users:
        Can re-register using the same email.
        Their existing record is updated and status becomes PENDING.
    """

    role_id = int(data["role_id"])

    role_suffixes = {
        1: ".admin@library.com",
        2: ".librarian@library.com",
        3: ".student@library.com"
    }

    suffix = role_suffixes.get(role_id)

    if not suffix:
        return {
            "success": False,
            "message": "Invalid role."
        }, 400

    username_input = data["username"].strip().lower()

    if not username_input:
        return {
            "success": False,
            "message": "Username is required."
        }, 400

    # If only username part is entered
    if "@" not in username_input:
        username = username_input + suffix

    # If complete username is entered
    else:
        username = username_input

    # Validate role-specific username suffix
    if not username.endswith(suffix):
        return {
            "success": False,
            "message": f"Username must end with {suffix}"
        }, 400

    email = data["email"].strip().lower()

    # --------------------------------------------------
    # CHECK EXISTING USERNAME
    # --------------------------------------------------

    existing_username = User.query.filter_by(
        username=username
    ).first()

    # --------------------------------------------------
    # CHECK EXISTING EMAIL
    # --------------------------------------------------

    existing_email = User.query.filter_by(
        email=email
    ).first()

    # --------------------------------------------------
    # HANDLE REJECTED USER RE-REGISTRATION
    # --------------------------------------------------

    if existing_email:

        # ACTIVE account cannot register again
        if existing_email.status == "ACTIVE":
            return {
                "success": False,
                "message": "Email already exists. Please use another email address."
            }, 409

        # PENDING account cannot register again
        if existing_email.status == "PENDING":
            return {
                "success": False,
                "message": "This email already has a registration pending admin approval."
            }, 409

        # REJECTED account can register again
        if existing_email.status == "REJECTED":

            # Make sure the username isn't being used
            # by another user.
            if existing_username and (
                existing_username.user_id != existing_email.user_id
            ):
                return {
                    "success": False,
                    "message": "Username already exists."
                }, 409

            hashed_password = generate_password_hash(
                data["password"]
            )

            existing_email.role_id = role_id
            existing_email.first_name = data["first_name"].strip()
            existing_email.last_name = data["last_name"].strip()
            existing_email.username = username
            existing_email.password_hash = hashed_password
            existing_email.phone = data.get("phone")
            existing_email.status = (
                "ACTIVE" if is_admin else "PENDING"
            )

            db.session.commit()

            if is_admin:
                message = "User registered successfully."
                response_status = "ACTIVE"
            else:
                message = (
                    "Registration submitted successfully. "
                    "Your account is pending admin approval."
                )
                response_status = "PENDING"

            return {
                "success": True,
                "message": message,
                "username": username,
                "status": response_status
            }, 201

    # --------------------------------------------------
    # USERNAME UNIQUENESS FOR NEW USERS
    # --------------------------------------------------

    if existing_username:
        return {
            "success": False,
            "message": "Username already exists."
        }, 409

    # --------------------------------------------------
    # CREATE NEW USER
    # --------------------------------------------------

    hashed_password = generate_password_hash(
        data["password"]
    )

    # Public student registration = PENDING
    # Admin-created user = ACTIVE
    initial_status = (
        "ACTIVE"
        if is_admin
        else "PENDING"
    )

    new_user = User(
        role_id=role_id,
        first_name=data["first_name"].strip(),
        last_name=data["last_name"].strip(),
        username=username,
        email=email,
        password_hash=hashed_password,
        phone=data.get("phone"),
        status=initial_status
    )

    db.session.add(new_user)
    db.session.commit()

    if initial_status == "PENDING":
        message = (
            "Registration submitted successfully. "
            "Your account is pending admin approval."
        )
    else:
        message = "User registered successfully."

    return {
        "success": True,
        "message": message,
        "username": username,
        "status": initial_status
    }, 201




def login_user(data):
    """
    Authenticate a user using username or email
    and generate a JWT token.
    """

    login_value = data["email"].strip().lower()

    user = User.query.filter(
        (User.username == login_value) |
        (User.email == login_value)
    ).first()

    if not user:
        return {
            "success": False,
            "message": "Invalid username/email or password."
        }, 401

    # Check password
    if not check_password_hash(
        user.password_hash,
        data["password"]
    ):
        return {
            "success": False,
            "message": "Invalid username/email or password."
        }, 401

    # Pending account
    if user.status == "PENDING":
        return {
            "success": False,
            "message": "Your account is pending admin approval."
        }, 403

    # Rejected account
    if user.status == "REJECTED":
        return {
            "success": False,
            "message": (
                "Your registration has been rejected "
                "by the administrator."
            )
        }, 403

    # Only ACTIVE users can login
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
            "username": user.username,
            "email": user.email,
            "role_id": user.role_id,
            "status": user.status
        }
    }, 200