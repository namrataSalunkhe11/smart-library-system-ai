from database import db
from models.author import Author


def create_author(data):
    """
    Create a new author.
    """

    existing_author = Author.query.filter_by(
        author_name=data["author_name"]
    ).first()

    if existing_author:
        return {
            "success": False,
            "message": "Author already exists."
        }, 409

    author = Author(
        author_name=data["author_name"],
        biography=data.get("biography")
    )

    db.session.add(author)
    db.session.commit()

    return {
        "success": True,
        "message": "Author created successfully.",
        "author_id": author.author_id
    }, 201