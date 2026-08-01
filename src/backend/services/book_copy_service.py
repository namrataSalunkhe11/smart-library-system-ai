from database import db
from models.book_copy import BookCopy
from models.book import Book


def create_book_copy(data):
    """
    Create a new physical copy of a book.
    """

    book = Book.query.get(data["book_id"])

    if not book:
        return {
            "success": False,
            "message": "Book not found."
        }, 404

    existing_copy = BookCopy.query.filter_by(
        accession_number=data["accession_number"]
    ).first()

    if existing_copy:
        return {
            "success": False,
            "message": "Accession number already exists."
        }, 409

    copy = BookCopy(
        book_id=data["book_id"],
        accession_number=data["accession_number"],
        status="AVAILABLE",
        shelf_location=data.get("shelf_location")
    )

    db.session.add(copy)
    db.session.commit()

    return {
        "success": True,
        "message": "Book copy created successfully.",
        "copy_id": copy.copy_id
    }, 201
def get_all_book_copies():
    """
    Fetch all book copies.
    """

    copies = BookCopy.query.all()

    copy_list = []

    for copy in copies:
        copy_list.append({
            "copy_id": copy.copy_id,
            "book_id": copy.book_id,
            "book_title": copy.book.title,
            "accession_number": copy.accession_number,
            "status": copy.status,
            "shelf_location": copy.shelf_location
        })

    return {
        "success": True,
        "copies": copy_list
    }, 200
def update_book_copy(copy_id, data):
    """
    Update an existing book copy.
    """

    copy = BookCopy.query.get(copy_id)

    if not copy:
        return {
            "success": False,
            "message": "Book copy not found."
        }, 404

    if "accession_number" in data:
        existing = BookCopy.query.filter(
            BookCopy.accession_number == data["accession_number"],
            BookCopy.copy_id != copy_id
        ).first()

        if existing:
            return {
                "success": False,
                "message": "Accession number already exists."
            }, 409

    update_fields = [
        "accession_number",
        "status",
        "shelf_location"
    ]

    for field in update_fields:
        if field in data:
            setattr(copy, field, data[field])

    db.session.commit()

    return {
        "success": True,
        "message": "Book copy updated successfully."
    }, 200

def delete_book_copy(copy_id):
    """
    Delete a book copy.
    """

    copy = BookCopy.query.get(copy_id)

    if not copy:
        return {
            "success": False,
            "message": "Book copy not found."
        }, 404

    db.session.delete(copy)
    db.session.commit()

    return {
        "success": True,
        "message": "Book copy deleted successfully."
    }, 200