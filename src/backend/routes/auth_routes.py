from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt

from services.auth_service import register_user, login_user


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


@auth_bp.route("/test", methods=["GET"])
def test():
    return jsonify({
        "success": True,
        "message": "Authentication API is working."
    })


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    required_fields = [
        "first_name",
        "last_name",
        "username",
        "email",
        "password",
        "role_id"
    ]

    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({
                "success": False,
                "message": f"{field} is required."
            }), 400

    # Public registration starts as non-admin.
    # Only an authenticated Admin can create
    # Admin/Librarian/Student accounts as ACTIVE.
    is_admin = False

    # Check whether an Authorization header was provided.
    auth_header = request.headers.get("Authorization")

    if auth_header and auth_header.startswith("Bearer "):
        try:
            from flask_jwt_extended import verify_jwt_in_request

            verify_jwt_in_request()

            claims = get_jwt()

            if int(claims.get("role_id", 0)) == 1:
                is_admin = True

        except Exception:
            return jsonify({
                "success": False,
                "message": "Invalid or expired authentication token."
            }), 401

    response, status_code = register_user(
        data,
        is_admin=is_admin
    )

    return jsonify(response), status_code


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    required_fields = [
        "email",
        "password"
    ]

    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({
                "success": False,
                "message": f"{field} is required."
            }), 400

    response, status_code = login_user(data)

    return jsonify(response), status_code