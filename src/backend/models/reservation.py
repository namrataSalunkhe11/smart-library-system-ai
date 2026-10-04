from datetime import datetime

from database import db


class Reservation(db.Model):
    __tablename__ = "reservations"

    reservation_id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.user_id"),
        nullable=False
    )

    book_id = db.Column(
        db.Integer,
        db.ForeignKey("books.book_id"),
        nullable=False
    )

    copy_id = db.Column(
        db.Integer,
        db.ForeignKey("book_copies.copy_id"),
        nullable=False
    )

    reservation_date = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    status = db.Column(
        db.Enum("ACTIVE", "FULFILLED", "CANCELLED"),
        default="ACTIVE",
        nullable=False
    )

    user = db.relationship(
        "User",
        back_populates="reservations"
    )

    book = db.relationship(
        "Book",
        back_populates="reservations"
    )

    book_copy = db.relationship(
        "BookCopy",
        back_populates="reservations"
    )