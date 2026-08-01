from flask import Blueprint, request, jsonify

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

    response, status_code = register_user(data)

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
