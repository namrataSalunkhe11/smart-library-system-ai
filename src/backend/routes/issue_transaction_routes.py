from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from constants.roles import ADMIN, LIBRARIAN

from services.issue_transaction_service import (
    issue_book,
    return_book,
    pay_fine,
    get_my_borrowings
)
issue_transaction_bp = Blueprint(
    "issue_transactions",
    __name__,
    url_prefix="/api/issues"
)

@issue_transaction_bp.route("/my-borrowings", methods=["GET"])
@jwt_required()
def my_borrowings():

    user_id = get_jwt().get("sub")

    if not user_id:
        return jsonify({
            "success": False,
            "message": "User identity not found in token."
        }), 401

    response, status_code = get_my_borrowings(int(user_id))

    return jsonify(response), status_code

@issue_transaction_bp.route("", methods=["POST"])
@jwt_required()
def issue():

    claims = get_jwt()

    if claims.get("role") not in [ADMIN, LIBRARIAN]:
        return jsonify({
            "success": False,
            "message": "Only Admin and Librarian can issue books."
        }), 403
    
    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    required_fields = [
        "user_id",
        "copy_id"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "success": False,
                "message": f"{field} is required."
            }), 400

    response, status_code = issue_book(data)

    return jsonify(response), status_code

@issue_transaction_bp.route("/return/<int:copy_id>", methods=["PUT"])
@jwt_required()
def return_book_copy(copy_id):

    response, status_code = return_book(copy_id)

    return jsonify(response), status_code

@issue_transaction_bp.route("/pay-fine/<int:transaction_id>", methods=["PUT"])
@jwt_required()
def pay_transaction_fine(transaction_id):

    response, status_code = pay_fine(transaction_id)

    return jsonify(response), status_code