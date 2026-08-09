from flask import Blueprint, request, jsonify

from services.author_service import create_author

author_bp = Blueprint(
    "authors",
    __name__,
    url_prefix="/api/authors"
)


@author_bp.route("", methods=["POST"])
def add_author():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    if "author_name" not in data:
        return jsonify({
            "success": False,
            "message": "author_name is required."
        }), 400

    response, status_code = create_author(data)

    return jsonify(response), status_code