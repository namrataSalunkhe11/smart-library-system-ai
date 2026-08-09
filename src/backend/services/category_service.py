from database import db
from models.category import Category


def create_category(data):
    """
    Create a new category.
    """

    existing_category = Category.query.filter_by(
        category_name=data["category_name"]
    ).first()

    if existing_category:
        return {
            "success": False,
            "message": "Category already exists."
        }, 409

    category = Category(
        category_name=data["category_name"],
        description=data.get("description")
    )

    db.session.add(category)
    db.session.commit()

    return {
        "success": True,
        "message": "Category created successfully.",
        "category_id": category.category_id
    }, 201