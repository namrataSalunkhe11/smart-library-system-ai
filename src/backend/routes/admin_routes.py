from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt

from database import db
from models.user import User
from services.auth_service import register_user


admin_bp = Blueprint(
    "admin",
    __name__,
    url_prefix="/api/admin"
)


def admin_only():
    """
    Check whether the logged-in user is an Admin.
    """
    claims = get_jwt()

    return int(claims.get("role_id", 0)) == 1

@admin_bp.route("/users", methods=["POST"])
@jwt_required()
def create_user():

    if not admin_only():
        return jsonify({
            "success": False,
            "message": "Admin access required."
        }), 403

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

    try:
        role_id = int(data["role_id"])
    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "message": "Invalid role ID."
        }), 400

    if role_id not in [1, 2, 3]:
        return jsonify({
            "success": False,
            "message": "Invalid role. Use Admin, Librarian, or Student."
        }), 400

    response, status_code = register_user(
        data,
        is_admin=True
    )

    return jsonify(response), status_code

@admin_bp.route("/pending-users", methods=["GET"])
@jwt_required()
def get_pending_users():

    if not admin_only():
        return jsonify({
            "success": False,
            "message": "Admin access required."
        }), 403

    users = User.query.filter_by(
        status="PENDING"
    ).order_by(
        User.created_at.asc()
    ).all()

    return jsonify({
        "success": True,
        "users": [
            {
                "user_id": user.user_id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "username": user.username,
                "email": user.email,
                "phone": user.phone,
                "role_id": user.role_id,
                "status": user.status,
                "created_at": user.created_at.isoformat()
                if user.created_at else None
            }
            for user in users
        ]
    }), 200


@admin_bp.route("/users/<int:user_id>/approve", methods=["PUT"])
@jwt_required()
def approve_user(user_id):

    if not admin_only():
        return jsonify({
            "success": False,
            "message": "Admin access required."
        }), 403

    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    if user.status != "PENDING":
        return jsonify({
            "success": False,
            "message": f"User is already {user.status}."
        }), 400

    user.status = "ACTIVE"

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "User approved successfully.",
        "user_id": user.user_id,
        "status": user.status
    }), 200


@admin_bp.route("/users/<int:user_id>/reject", methods=["PUT"])
@jwt_required()
def reject_user(user_id):

    if not admin_only():
        return jsonify({
            "success": False,
            "message": "Admin access required."
        }), 403

    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    if user.status != "PENDING":
        return jsonify({
            "success": False,
            "message": f"User is already {user.status}."
        }), 400

    user.status = "REJECTED"

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "User registration rejected.",
        "user_id": user.user_id,
        "status": user.status
    }), 200