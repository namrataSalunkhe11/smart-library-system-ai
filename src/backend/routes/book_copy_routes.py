from flask import Blueprint, request, jsonify

from services.book_copy_service import (
    create_book_copy,
    get_all_book_copies,
    update_book_copy,
    delete_book_copy
)


book_copy_bp = Blueprint(
    "book_copies",
    __name__,
    url_prefix="/api/book-copies"
)


@book_copy_bp.route("", methods=["POST"])
def add_book_copy():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    required_fields = [
        "book_id",
        "accession_number"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "success": False,
                "message": f"{field} is required."
            }), 400

    response, status_code = create_book_copy(data)

    return jsonify(response), status_code

@book_copy_bp.route("", methods=["GET"])
def get_book_copies():

    response, status_code = get_all_book_copies()

    return jsonify(response), status_code

@book_copy_bp.route("/<int:copy_id>", methods=["PUT"])
def edit_book_copy(copy_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    response, status_code = update_book_copy(copy_id, data)

    return jsonify(response), status_code

@book_copy_bp.route("/<int:copy_id>", methods=["DELETE"])
def remove_book_copy(copy_id):

    response, status_code = delete_book_copy(copy_id)

    return jsonify(response), status_code