from flask import Blueprint, request, jsonify

from services.category_service import create_category

category_bp = Blueprint(
    "categories",
    __name__,
    url_prefix="/api/categories"
)


@category_bp.route("", methods=["POST"])
def add_category():

    data = request.get_json()

    response, status_code = create_category(data)

    return jsonify(response), status_code