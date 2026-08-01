from database import db
from models.book import Book
from models.author import Author
from models.category import Category


def create_book(data):
    """
    Create a new book.
    """

    # Check if ISBN already exists
    existing_book = Book.query.filter_by(isbn=data["isbn"]).first()

    if existing_book:
        return {
            "success": False,
            "message": "A book with this ISBN already exists."
        }, 409

    # Validate Author
    author = Author.query.get(data["author_id"])

    if not author:
        return {
            "success": False,
            "message": "Author not found."
        }, 404

    # Validate Category
    category = Category.query.get(data["category_id"])

    if not category:
        return {
            "success": False,
            "message": "Category not found."
        }, 404

    # Create Book
    new_book = Book(
        title=data["title"],
        isbn=data["isbn"],
        author_id=data["author_id"],
        category_id=data["category_id"],
        publisher=data.get("publisher"),
        publication_year=data.get("publication_year"),
        edition=data.get("edition"),
        language=data.get("language"),
        description=data.get("description")
    )

    db.session.add(new_book)
    db.session.commit()

    return {
        "success": True,
        "message": "Book added successfully.",
        "book_id": new_book.book_id
    }, 201
def get_all_books():
    """
    Fetch all books.
    """

    books = Book.query.all()

    book_list = []

    for book in books:
        book_list.append({
            "book_id": book.book_id,
            "title": book.title,
            "isbn": book.isbn,
            "author": book.author.author_name,
            "category": book.category.category_name,
            "publisher": book.publisher,
            "publication_year": book.publication_year,
            "language": book.language
        })

    return {
        "success": True,
        "books": book_list
    }, 200
def search_books(query):
    """
    Search books by title, ISBN, author, or category.
    """

    books = Book.query.join(Author).join(Category).filter(
        db.or_(
            Book.title.ilike(f"%{query}%"),
            Book.isbn.ilike(f"%{query}%"),
            Author.author_name.ilike(f"%{query}%"),
            Category.category_name.ilike(f"%{query}%")
        )
    ).all()

    book_list = []

    for book in books:
        book_list.append({
            "book_id": book.book_id,
            "title": book.title,
            "isbn": book.isbn,
            "author": book.author.author_name,
            "category": book.category.category_name
        })

    return {
        "success": True,
        "books": book_list
    }, 200
def update_book(book_id, data):
    """
    Update existing book details.
    """

    book = Book.query.get(book_id)

    if not book:
        return {
            "success": False,
            "message": "Book not found."
        }, 404

    if "isbn" in data:
        existing_book = Book.query.filter(
            Book.isbn == data["isbn"],
            Book.book_id != book_id
        ).first()

        if existing_book:
            return {
                "success": False,
                "message": "ISBN already belongs to another book."
            }, 409

    update_fields = [
        "title",
        "isbn",
        "author_id",
        "category_id",
        "publisher",
        "publication_year",
        "edition",
        "language",
        "description"
    ]

    for field in update_fields:
        if field in data:
            setattr(book, field, data[field])

    db.session.commit()

    return {
        "success": True,
        "message": "Book updated successfully."
    }, 200
def delete_book(book_id):
    """
    Delete a book.
    """

    book = Book.query.get(book_id)

    if not book:
        return {
            "success": False,
            "message": "Book not found."
        }, 404

    db.session.delete(book)
    db.session.commit()

    return {
        "success": True,
        "message": "Book deleted successfully."
    }, 200