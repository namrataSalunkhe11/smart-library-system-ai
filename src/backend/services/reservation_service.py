from datetime import datetime, timedelta

from database import db
from models.reservation import Reservation
from models.book import Book
from models.book_copy import BookCopy
from models.user import User
from models.issue_transaction import IssueTransaction


def create_reservation(user_id, book_id):
    """
    Create a reservation for a book using an available copy.
    """

    # Check user
    user = User.query.get(user_id)

    if not user:
        return {
            "success": False,
            "message": "User not found."
        }, 404

    # Check book
    book = Book.query.get(book_id)

    if not book:
        return {
            "success": False,
            "message": "Book not found."
        }, 404

    # Check existing active reservation
    existing_reservation = Reservation.query.filter_by(
        user_id=user_id,
        book_id=book_id,
        status="ACTIVE"
    ).first()

    if existing_reservation:
        return {
            "success": False,
            "message": "You have already reserved this book."
        }, 409

    # Find an available copy of this book
    available_copy = BookCopy.query.filter_by(
        book_id=book_id,
        status="AVAILABLE"
    ).first()

    if not available_copy:
        return {
            "success": False,
            "message": "No available copy found for this book."
        }, 409

    # Create reservation
    reservation = Reservation(
        user_id=user_id,
        book_id=book_id,
        copy_id=available_copy.copy_id,
        status="ACTIVE"
    )

    db.session.add(reservation)
    db.session.commit()

    return {
        "success": True,
        "message": "Book reserved successfully.",
        "reservation_id": reservation.reservation_id,
        "copy_id": available_copy.copy_id
    }, 201

def get_user_reservations(user_id):
    """
    Get all reservations for a user.
    """

    reservations = Reservation.query.filter_by(
        user_id=user_id
    ).order_by(
        Reservation.reservation_date.desc()
    ).all()

    reservation_list = []

    for reservation in reservations:
        reservation_list.append({
            "reservation_id": reservation.reservation_id,
            "book_id": reservation.book_id,
            "book_title": reservation.book.title,
            "reservation_date": reservation.reservation_date.strftime(
                "%Y-%m-%d"
            ),
            "status": reservation.status
        })

    return {
        "success": True,
        "reservations": reservation_list
    }, 200


def cancel_reservation(reservation_id, user_id=None, staff_action=False):
    """
    Cancel a reservation.
    """

    if staff_action:
        reservation = Reservation.query.filter_by(
            reservation_id=reservation_id
        ).first()
    else:
        reservation = Reservation.query.filter_by(
            reservation_id=reservation_id,
            user_id=user_id
        ).first()

    if not reservation:
        return {
            "success": False,
            "message": "Reservation not found."
        }, 404

    if reservation.status != "ACTIVE":
        return {
            "success": False,
            "message": "Reservation is already completed or cancelled."
        }, 400

    reservation.status = "CANCELLED"

    db.session.commit()

    return {
        "success": True,
        "message": "Reservation cancelled successfully."
    }, 200

def get_all_reservations():
    """
    Get all reservations for Admin/Librarian.
    """

    reservations = Reservation.query.order_by(
        Reservation.reservation_date.desc()
    ).all()

    reservation_list = []

    for reservation in reservations:
        reservation_list.append({
            "reservation_id": reservation.reservation_id,
            "user_id": reservation.user_id,
            "student_name": (
                f"{reservation.user.first_name} "
                f"{reservation.user.last_name}"
            ),
            "book_id": reservation.book_id,
            "book_title": reservation.book.title,
            "copy_id": reservation.copy_id,
            "reservation_date": reservation.reservation_date.strftime(
                "%Y-%m-%d"
            ),
            "status": reservation.status
        })

    return {
        "success": True,
        "reservations": reservation_list
    }, 200

def fulfill_reservation(reservation_id):
    """
    Issue a reserved book to the student and fulfill the reservation.
    """

    reservation = Reservation.query.get(reservation_id)

    if not reservation:
        return {
            "success": False,
            "message": "Reservation not found."
        }, 404

    if reservation.status != "ACTIVE":
        return {
            "success": False,
            "message": "Only active reservations can be fulfilled."
        }, 400

    copy = BookCopy.query.get(reservation.copy_id)

    if not copy:
        return {
            "success": False,
            "message": "Reserved book copy not found."
        }, 404

    if copy.status != "AVAILABLE":
        return {
            "success": False,
            "message": "The reserved book copy is not available."
        }, 409

    issue_date = datetime.utcnow()
    due_date = issue_date + timedelta(days=14)

    transaction = IssueTransaction(
        copy_id=copy.copy_id,
        user_id=reservation.user_id,
        issue_date=issue_date,
        due_date=due_date,
        status="ISSUED"
    )

    copy.status = "ISSUED"
    reservation.status = "FULFILLED"

    db.session.add(transaction)
    db.session.commit()

    return {
        "success": True,
        "message": "Reserved book issued successfully.",
        "transaction_id": transaction.transaction_id,
        "reservation_id": reservation.reservation_id,
        "copy_id": copy.copy_id,
        "due_date": due_date.strftime("%Y-%m-%d")
    }, 201

def collect_reserved_book(reservation_id, user_id):
    """
    Allow a user to collect/borrow their reserved book.
    """

    reservation = Reservation.query.filter_by(
        reservation_id=reservation_id,
        user_id=user_id
    ).first()

    if not reservation:
        return {
            "success": False,
            "message": "Reservation not found."
        }, 404

    if reservation.status != "ACTIVE":
        return {
            "success": False,
            "message": "Only active reservations can be collected."
        }, 400

    if not reservation.copy_id:
        return {
            "success": False,
            "message": "No book copy is assigned to this reservation."
        }, 400

    copy = BookCopy.query.get(reservation.copy_id)

    if not copy:
        return {
            "success": False,
            "message": "Reserved book copy not found."
        }, 404

    if copy.status != "AVAILABLE":
        return {
            "success": False,
            "message": "The reserved book copy is not currently available."
        }, 409

    issue_date = datetime.utcnow()
    due_date = issue_date + timedelta(days=14)

    transaction = IssueTransaction(
        copy_id=copy.copy_id,
        user_id=user_id,
        issue_date=issue_date,
        due_date=due_date,
        status="ISSUED"
    )

    copy.status = "ISSUED"
    reservation.status = "FULFILLED"

    db.session.add(transaction)
    db.session.commit()

    return {
        "success": True,
        "message": "Book collected successfully.",
        "transaction_id": transaction.transaction_id,
        "due_date": due_date.strftime("%Y-%m-%d")
    }, 200