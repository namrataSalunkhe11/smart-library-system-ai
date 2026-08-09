from sqlalchemy import func

from database import db
from models.issue_transaction import IssueTransaction
from models.book_copy import BookCopy
from models.book import Book


def get_recommendations(user_id):
    """
    Recommend books based on the user's borrowing history.
    """

    # Find the category the user borrows most
    favorite_categories  = (
        db.session.query(
            Book.category_id,
            func.count(Book.category_id).label("borrow_count")
        )
        .join(BookCopy, Book.book_id == BookCopy.book_id)
        .join(IssueTransaction, BookCopy.copy_id == IssueTransaction.copy_id)
        .filter(IssueTransaction.user_id == user_id)
        .group_by(Book.category_id)
        .order_by(func.count(Book.category_id).desc())
        .all()
    )

    if not favorite_categories :
        return {
            "success": True,
            "recommendations": [],
            "message": "No borrowing history found."
        }, 200

    category_scores = {
    category.category_id: category.borrow_count
    for category in favorite_categories
    }

    category_ids = list(category_scores.keys())

    # Books already borrowed by the user
    borrowed_books = (
        db.session.query(Book.book_id)
        .join(BookCopy, Book.book_id == BookCopy.book_id)
        .join(IssueTransaction, BookCopy.copy_id == IssueTransaction.copy_id)
        .filter(IssueTransaction.user_id == user_id)
        .distinct()
        .all()
    )

    borrowed_book_ids = [book.book_id for book in borrowed_books]

    # First try to recommend books from the user's preferred categories
    recommendations = (
        Book.query
        .join(BookCopy, Book.book_id == BookCopy.book_id)
        .filter(
            Book.category_id.in_(category_ids),
            ~Book.book_id.in_(borrowed_book_ids),
            BookCopy.status == "AVAILABLE"
        )
        .distinct()
        .all()
    )

    # If no books are available in preferred categories,
    # recommend books from other categories
    if not recommendations:
        recommendations = (
            Book.query
            .join(BookCopy, Book.book_id == BookCopy.book_id)
            .filter(
                ~Book.book_id.in_(borrowed_book_ids),
                BookCopy.status == "AVAILABLE"
            )
            .distinct()
            .all()
        )

    # Find authors whose books the user has already borrowed
    borrowed_authors = (
        db.session.query(Book.author_id)
        .join(BookCopy, Book.book_id == BookCopy.book_id)
        .join(IssueTransaction, BookCopy.copy_id == IssueTransaction.copy_id)
        .filter(IssueTransaction.user_id == user_id)
        .distinct()
        .all()
    )

    borrowed_author_ids = {
        author.author_id
        for author in borrowed_authors
    }

    # Build recommendation list with a simple similarity score
    recommendation_list = []

    for book in recommendations:

        score = 0

        # Higher score when the user has borrowed
        # another book by the same author
        # Same author preference
        if book.author_id in borrowed_author_ids:
            score += 2

        # Preferred category preference
        score += category_scores.get(book.category_id, 0)

        # Small preference for recent publications
        if book.publication_year and book.publication_year >= 2020:
            score += 1

        recommendation_list.append({
            "book_id": book.book_id,
            "title": book.title,
            "author": book.author.author_name,
            "category": book.category.category_name,
            "publisher": book.publisher,
            "recommendation_score": score
        })

    # Highest-scoring books appear first
    recommendation_list.sort(
        key=lambda item: item["recommendation_score"],
        reverse=True
    )

    recommendation_list = recommendation_list[:5]

    return {
        "success": True,
        "recommendations": recommendation_list
    }, 200