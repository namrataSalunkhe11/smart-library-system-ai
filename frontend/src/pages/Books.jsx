import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";
import "./Books.css";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [reservingId, setReservingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API_BASE_URL}/books`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to load books.");
        return;
      }

      setBooks(data.books);
    } catch (error) {
      console.error("Books API error:", error);
      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = async () => {
    const query = searchQuery.trim();

    if (!query) {
      fetchBooks();
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${API_BASE_URL}/books/search?q=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Search failed.");
        return;
      }

      setBooks(data.books || []);
    } catch (error) {
      console.error("Book search error:", error);
      setError("Unable to search books.");
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async (bookId) => {
    try {
      setReservingId(bookId);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Please login before reserving a book.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          book_id: bookId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to reserve the book.");
        return;
      }

      setSuccessMessage(
        data.message || "Book reserved successfully."
      );
    } catch (error) {
      console.error("Reserve book error:", error);
      setError("Unable to reserve the book.");
    } finally {
      setReservingId(null);
    }
  };

  if (loading) {
    return (
      <div className="books-page">
        <h1>📚 Books</h1>
        <p>Loading books...</p>
      </div>
    );
  }

  return (
    <div className="books-page">
      <div className="books-header">
        <div>
          <h1>📚 Library Books</h1>
          <p>Browse books available in the Smart Library.</p>
        </div>

        <div className="book-count">
          {books.length} Books
        </div>
      </div>

      <div className="book-search">
        <input
          type="text"
          placeholder="Search by title, ISBN, author or category..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <button onClick={handleSearch}>
          🔎 Search
        </button>
      </div>

      {error && <p className="books-error">{error}</p>}

      {successMessage && (
        <p className="books-success">{successMessage}</p>
      )}

      {books.length === 0 ? (
        <div className="no-books">
          <p>No books found.</p>
        </div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div className="book-card" key={book.book_id}>
              <div className="book-icon">📖</div>

              <h2>{book.title}</h2>

              <p>
                <strong>Author:</strong> {book.author}
              </p>

              <p>
                <strong>Category:</strong> {book.category}
              </p>

              <p>
                <strong>ISBN:</strong> {book.isbn}
              </p>

              <p>
                <strong>Publisher:</strong>{" "}
                {book.publisher || "N/A"}
              </p>

              <p>
                <strong>Year:</strong>{" "}
                {book.publication_year || "N/A"}
              </p>

              <p>
                <strong>Language:</strong>{" "}
                {book.language || "N/A"}
              </p>

              <button
                className="reserve-book-btn"
                onClick={() => handleReserve(book.book_id)}
                disabled={reservingId === book.book_id}
              >
                {reservingId === book.book_id
                  ? "Reserving..."
                  : "Reserve Book"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Books;