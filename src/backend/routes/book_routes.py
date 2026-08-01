from flask import Blueprint, request, jsonify

from services.book_service import (
    create_book,
    get_all_books,
    search_books,
    update_book,
    delete_book
)

book_bp = Blueprint(
    "books",
    __name__,
    url_prefix="/api/books"
)


@book_bp.route("/test", methods=["GET"])
def test():
    return jsonify({
        "success": True,
        "message": "Book API is working."
    })
@book_bp.route("", methods=["GET"])
def get_books():

    response, status_code = get_all_books()

    return jsonify(response), status_code

@book_bp.route("", methods=["POST"])
def add_book():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    required_fields = [
        "title",
        "isbn",
        "author_id",
        "category_id"
    ]

    for field in required_fields:
        if field not in data or data[field] in (None, ""):
            return jsonify({
                "success": False,
                "message": f"{field} is required."
            }), 400

    response, status_code = create_book(data)

    return jsonify(response), status_code
@book_bp.route("/search", methods=["GET"])
def search():

    query = request.args.get("q")

    if not query:
        return jsonify({
            "success": False,
            "message": "Search query is required."
        }), 400

    response, status_code = search_books(query)

    return jsonify(response), status_code
@book_bp.route("/<int:book_id>", methods=["PUT"])
def edit_book(book_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    response, status_code = update_book(book_id, data)

    return jsonify(response), status_code

@book_bp.route("/<int:book_id>", methods=["DELETE"])
def remove_book(book_id):

    response, status_code = delete_book(book_id)

    return jsonify(response), status_code