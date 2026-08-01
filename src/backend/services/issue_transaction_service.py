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
    Return an issued book copy and calculate fine.
    Fine: ₹10 per day after due date.
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

    return_date = datetime.utcnow()

    transaction.return_date = return_date
    transaction.status = "RETURNED"

    # Calculate fine
    fine = 0

    if return_date > transaction.due_date:
        late_days = (return_date - transaction.due_date).days

        if late_days > 0:
            fine = late_days * 10

    transaction.fine_amount = fine

    copy.status = "AVAILABLE"

    db.session.commit()

    return {
        "success": True,
        "message": "Book returned successfully.",
        "fine_amount": float(fine)
    }, 200

def pay_fine(transaction_id):
    """
    Mark a fine as paid.
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

    transaction.fine_paid = True
    db.session.commit()

    return {
        "success": True,
        "message": "Fine paid successfully.",
        "fine_amount": float(transaction.fine_amount)
    }, 200