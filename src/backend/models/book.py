from database import db


class Book(db.Model):
    __tablename__ = "books"

    book_id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(255), nullable=False)
    isbn = db.Column(db.String(20), unique=True, nullable=False)

    author_id = db.Column(
        db.Integer,
        db.ForeignKey("authors.author_id"),
        nullable=False
    )

    category_id = db.Column(
        db.Integer,
        db.ForeignKey("categories.category_id"),
        nullable=False
    )

    publisher = db.Column(db.String(150))
    publication_year = db.Column(db.Integer)
    edition = db.Column(db.String(50))
    language = db.Column(db.String(50))
    description = db.Column(db.Text)

    author = db.relationship("Author", back_populates="books")
    category = db.relationship("Category", back_populates="books")
    copies = db.relationship("BookCopy", back_populates="book")

    reservations = db.relationship(
        "Reservation",
        back_populates="book",
        cascade="all, delete-orphan"
    ) 

    def __repr__(self):
        return f"<Book {self.title}>"