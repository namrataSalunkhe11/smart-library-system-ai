from datetime import datetime
from database import db


class IssueTransaction(db.Model):
    __tablename__ = "issue_transactions"

    transaction_id = db.Column(db.Integer, primary_key=True)

    copy_id = db.Column(
        db.Integer,
        db.ForeignKey("book_copies.copy_id"),
        nullable=False
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.user_id"),
        nullable=False
    )

    issue_date = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    due_date = db.Column(
        db.DateTime,
        nullable=False
    )

    return_date = db.Column(
        db.DateTime,
        nullable=True
    )

    status = db.Column(
        db.String(20),
        nullable=False,
        default="ISSUED"
    )

    fine_amount = db.Column(
        db.Numeric(10, 2),
        default=0.00
    )

    fine_paid = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )
    # Relationships
    book_copy = db.relationship(
        "BookCopy",
        back_populates="transactions"
    )

    user = db.relationship(
        "User",
        back_populates="transactions"
    )

    def __repr__(self):
        return f"<IssueTransaction {self.transaction_id}>"