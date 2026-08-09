from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from constants.roles import ADMIN, LIBRARIAN

from services.recommendation_service import get_recommendations

recommendation_bp = Blueprint(
    "recommendations",
    __name__,
    url_prefix="/api/recommendations"
)


@recommendation_bp.route("/<int:user_id>", methods=["GET"])
@jwt_required()
def recommend_books(user_id):

    current_user_id = int(get_jwt_identity())
    claims = get_jwt()

    if (
        current_user_id != user_id
        and claims.get("role") not in [ADMIN, LIBRARIAN]
    ):
        return jsonify({
            "success": False,
            "message": "You can only access your own recommendations."
        }), 403

    response, status_code = get_recommendations(user_id)

    return jsonify(response), status_code