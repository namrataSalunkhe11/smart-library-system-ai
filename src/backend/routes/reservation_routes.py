from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from constants.roles import ADMIN, LIBRARIAN

from services.reservation_service import (
    create_reservation,
    get_user_reservations,
    get_all_reservations,
    cancel_reservation,
    fulfill_reservation,
    collect_reserved_book
)


reservation_bp = Blueprint(
    "reservations",
    __name__,
    url_prefix="/api/reservations"
)


@reservation_bp.route("", methods=["POST"])
@jwt_required()
def reserve_book():

    current_user_id = int(get_jwt_identity())

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    if "book_id" not in data:
        return jsonify({
            "success": False,
            "message": "book_id is required."
        }), 400

    response, status_code = create_reservation(
        current_user_id,
        data["book_id"]
    )

    return jsonify(response), status_code


@reservation_bp.route("", methods=["GET"])
@jwt_required()
def get_reservations():

    current_user_id = int(get_jwt_identity())

    response, status_code = get_user_reservations(
        current_user_id
    )

    return jsonify(response), status_code


@reservation_bp.route("/<int:reservation_id>", methods=["DELETE"])
@jwt_required()
def cancel_book_reservation(reservation_id):

    current_user_id = int(get_jwt_identity())

    response, status_code = cancel_reservation(
        reservation_id,
        current_user_id
    )

    return jsonify(response), status_code

@reservation_bp.route("/<int:reservation_id>/collect", methods=["PUT"])
@jwt_required()
def collect_reserved_book_route(reservation_id):

    current_user_id = int(get_jwt_identity())

    response, status_code = collect_reserved_book(
        reservation_id,
        current_user_id
    )

    return jsonify(response), status_code

@reservation_bp.route("/all", methods=["GET"])
@jwt_required()
def get_all_library_reservations():

    claims = get_jwt()

    if claims.get("role") not in [ADMIN, LIBRARIAN]:
        return jsonify({
            "success": False,
            "message": "Only Admin or Librarian can view all reservations."
        }), 403

    response, status_code = get_all_reservations()

    return jsonify(response), status_code


@reservation_bp.route("/<int:reservation_id>/fulfill", methods=["PUT"])
@jwt_required()
def fulfill_book_reservation(reservation_id):

    claims = get_jwt()

    if claims.get("role") not in [ADMIN, LIBRARIAN]:
        return jsonify({
            "success": False,
            "message": "Only Admin or Librarian can fulfill reservations."
        }), 403

    response, status_code = fulfill_reservation(
        reservation_id
    )

    return jsonify(response), status_code


@reservation_bp.route("/<int:reservation_id>/admin-cancel", methods=["PUT"])
@jwt_required()
def librarian_cancel_reservation(reservation_id):

    claims = get_jwt()

    if claims.get("role") not in [ADMIN, LIBRARIAN]:
        return jsonify({
            "success": False,
            "message": "Only Admin or Librarian can cancel reservations."
        }), 403

    response, status_code = cancel_reservation(
        reservation_id,
        None,
        staff_action=True
    )

    return jsonify(response), status_code
    