from flask import Blueprint, request, jsonify

from services.issue_transaction_service import (
    issue_book,
    return_book,
    pay_fine
)
issue_transaction_bp = Blueprint(
    "issue_transactions",
    __name__,
    url_prefix="/api/issues"
)


@issue_transaction_bp.route("", methods=["POST"])
def issue():

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
def return_book_copy(copy_id):

    response, status_code = return_book(copy_id)

    return jsonify(response), status_code

@issue_transaction_bp.route("/pay-fine/<int:transaction_id>", methods=["PUT"])
def pay_transaction_fine(transaction_id):

    response, status_code = pay_fine(transaction_id)

    return jsonify(response), status_code