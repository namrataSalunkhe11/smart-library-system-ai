from database import db


class BookCopy(db.Model):
    __tablename__ = "book_copies"

    copy_id = db.Column(db.Integer, primary_key=True)

    book_id = db.Column(
        db.Integer,
        db.ForeignKey("books.book_id"),
        nullable=False
    )

    accession_number = db.Column(db.String(50), unique=True, nullable=False)

    status = db.Column(
        db.Enum(
            "AVAILABLE",
            "ISSUED",
            "RESERVED",
            "LOST",
            name="copy_status"
        ),
        default="AVAILABLE",
        nullable=False
    )

    shelf_location = db.Column(db.String(100))

    book = db.relationship("Book", back_populates="copies")

    transactions = db.relationship(
        "IssueTransaction",
        back_populates="book_copy",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<BookCopy {self.accession_number}>"