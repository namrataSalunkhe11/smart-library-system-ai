from database import db


class Author(db.Model):
    __tablename__ = "authors"

    author_id = db.Column(db.Integer, primary_key=True)
    author_name = db.Column(db.String(150), nullable=False, unique=True)
    biography = db.Column(db.Text)

    books = db.relationship("Book", back_populates="author")

    def __repr__(self):
        return f"<Author {self.author_name}>"