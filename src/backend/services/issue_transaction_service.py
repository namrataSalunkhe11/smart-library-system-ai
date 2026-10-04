from datetime import datetime, timedelta

from database import db
from models.issue_transaction import IssueTransaction
from models.book_copy import BookCopy
from models.user import User


def issue_book(data):
    """
    Issue a book copy to a user.
    """

    user = User.query.get(data["user_id"])

    if not user:
        return {
            "success": False,
            "message": "User not found."
        }, 404

    copy = BookCopy.query.get(data["copy_id"])

    if not copy:
        return {
            "success": False,
            "message": "Book copy not found."
        }, 404

    if copy.status != "AVAILABLE":
        return {
            "success": False,
            "message": "Book copy is not available."
        }, 409

    issue_date = datetime.utcnow()
    due_date = issue_date + timedelta(days=14)

    transaction = IssueTransaction(
        copy_id=copy.copy_id,
        user_id=user.user_id,
        issue_date=issue_date,
        due_date=due_date,
        status="ISSUED"
    )

    copy.status = "ISSUED"

    db.session.add(transaction)
    db.session.commit()

    return {
        "success": True,
        "message": "Book issued successfully.",
        "transaction_id": transaction.transaction_id,
        "due_date": due_date.strftime("%Y-%m-%d")
    }, 201




def return_book(copy_id):
    """
    Check book return and calculate fine.

    If there is no fine:
        Book is returned immediately.

    If there is a fine:
        Book remains ISSUED until the fine is paid.
    """

    transaction = IssueTransaction.query.filter_by(
        copy_id=copy_id,
        status="ISSUED"
    ).first()

    if not transaction:
        return {
            "success": False,
            "message": "No active issue transaction found."
        }, 404

    copy = BookCopy.query.get(copy_id)

    if not copy:
        return {
            "success": False,
            "message": "Book copy not found."
        }, 404

    return_date = datetime.utcnow()

    # Calculate fine
    fine = 0

    if return_date > transaction.due_date:
        late_days = (return_date - transaction.due_date).days

        if late_days > 0:
            fine = late_days * 10

    transaction.fine_amount = fine

    # =========================================
    # NO FINE
    # =========================================

    if fine <= 0:

        transaction.return_date = return_date
        transaction.status = "RETURNED"
        transaction.fine_paid = False

        copy.status = "AVAILABLE"

        db.session.commit()

        return {
            "success": True,
            "returned": True,
            "fine_required": False,
            "message": "Book returned successfully.",
            "fine_amount": 0
        }, 200

    # =========================================
    # FINE EXISTS
    # =========================================

    db.session.commit()

    return {
        "success": True,
        "returned": False,
        "fine_required": True,
        "message": "Fine payment is required before returning the book.",
        "transaction_id": transaction.transaction_id,
        "copy_id": copy.copy_id,
        "fine_amount": float(fine)
    }, 200


def pay_fine(transaction_id):
    """
    Pay the fine and complete the book return.
    """

    transaction = IssueTransaction.query.get(transaction_id)

    if not transaction:
        return {
            "success": False,
            "message": "Transaction not found."
        }, 404

    if transaction.fine_amount <= 0:
        return {
            "success": False,
            "message": "No fine due for this transaction."
        }, 400

    if transaction.fine_paid:
        return {
            "success": False,
            "message": "Fine has already been paid."
        }, 400

    copy = BookCopy.query.get(transaction.copy_id)

    if not copy:
        return {
            "success": False,
            "message": "Book copy not found."
        }, 404

    # Mark fine as paid
    transaction.fine_paid = True

    # Complete return
    transaction.return_date = datetime.utcnow()
    transaction.status = "RETURNED"

    copy.status = "AVAILABLE"

    db.session.commit()

    return {
        "success": True,
        "returned": True,
        "message": "Fine paid and book returned successfully.",
        "fine_amount": float(transaction.fine_amount)
    }, 200

def get_my_borrowings(user_id):
    """
    Get borrowing history for a specific user.
    """

    transactions = IssueTransaction.query.filter_by(
        user_id=user_id
    ).order_by(
        IssueTransaction.issue_date.desc()
    ).all()

    borrowing_list = []

    for transaction in transactions:
        book = transaction.book_copy.book

        borrowing_list.append({
            "transaction_id": transaction.transaction_id,
            "book_id": book.book_id,
            "title": book.title,
            "author": book.author.author_name,
            "category": book.category.category_name,
            "copy_id": transaction.copy_id,
            "issue_date": transaction.issue_date.strftime("%Y-%m-%d"),
            "due_date": transaction.due_date.strftime("%Y-%m-%d"),
            "return_date": (
                transaction.return_date.strftime("%Y-%m-%d")
                if transaction.return_date
                else None
            ),
            "status": transaction.status,
            "fine_amount": float(transaction.fine_amount or 0),
            "fine_paid": transaction.fine_paid
        })

    return {
        "success": True,
        "borrowings": borrowing_list
    }, 200