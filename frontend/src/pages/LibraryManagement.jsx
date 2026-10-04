import CommonHeader from "../components/CommonHeader";
import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";
import "./LibraryManagement.css";

function LibraryManagement() {
  const token = localStorage.getItem("access_token");

  const [books, setBooks] = useState([]);
  const [copies, setCopies] = useState([]);

  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (sectionName) => {
    setOpenSection((current) =>
      current === sectionName ? null : sectionName
    );
  };

  const [bookForm, setBookForm] = useState({
    title: "",
    isbn: "",
    author_id: "",
    category_id: "",
    publisher: "",
    publication_year: "",
    edition: "",
    language: "",
    description: "",
  });

  const [copyForm, setCopyForm] = useState({
    book_id: "",
    accession_number: "",
    shelf_location: "",
  });

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  /* =========================================
     LOAD BOOKS
     ========================================= */

  const loadBooks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: "GET",
        headers,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load books.");
      }

      setBooks(data.books || []);
    } catch (err) {
      console.error("Load books error:", err);
      setError(err.message || "Unable to load books.");
    }
  };

  /* =========================================
     LOAD BOOK COPIES
     ========================================= */

  const loadCopies = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/book-copies`,
        {
          method: "GET",
          headers,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load book copies."
        );
      }

      setCopies(data.copies || []);
    } catch (err) {
      console.error("Load copies error:", err);
      setError(err.message || "Unable to load book copies.");
    }
  };

  /* =========================================
     LOAD AUTHORS
     ========================================= */

  const loadAuthors = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/authors`,
        {
          method: "GET",
          headers,
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setAuthors(data.authors || []);
      }
    } catch (err) {
      console.error("Load authors error:", err);
    }
  };

  /* =========================================
     LOAD CATEGORIES
     ========================================= */

  const loadCategories = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/categories`,
        {
          method: "GET",
          headers,
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Load categories error:", err);
    }
  };

  /* =========================================
     INITIAL LOAD
     ========================================= */

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError("");

      await Promise.all([
        loadBooks(),
        loadCopies(),
        loadAuthors(),
        loadCategories(),
      ]);

      setLoading(false);
    };

    loadAllData();
  }, []);

  /* =========================================
     BOOK FORM CHANGE
     ========================================= */

  const handleBookChange = (event) => {
    const { name, value } = event.target;

    setBookForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /* =========================================
     COPY FORM CHANGE
     ========================================= */


  const generateAccessionNumber = (bookId) => {
        if (!bookId) {
            return "";
        }

        const selectedBook = books.find(
            (book) => String(book.book_id) === String(bookId)
        );

        if (!selectedBook) {
            return "";
        }

        // Create a short prefix from the book title
        const prefix = selectedBook.title
            .replace(/[^a-zA-Z0-9 ]/g, "")
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((word) => word.substring(0, 4).toUpperCase())
            .join("-");

        // Find existing copies for this book
        const bookCopies = copies.filter(
            (copy) =>
            String(copy.book_id) === String(bookId)
        );

        const nextNumber = bookCopies.length + 1;

        return `${prefix}-${String(nextNumber).padStart(3, "0")}`;
  };
  const handleCopyChange = (event) => {
        const { name, value } = event.target;

        if (name === "book_id") {
            const accessionNumber =
            generateAccessionNumber(value);

            setCopyForm((current) => ({
            ...current,
            book_id: value,
            accession_number: accessionNumber,
            }));

            return;
        }

        setCopyForm((current) => ({
            ...current,
            [name]: value,
        }));
  };

  /* =========================================
     ADD BOOK
     ========================================= */

  const addBook = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      setActionLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/books`,
        {
          method: "POST",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: bookForm.title,
            isbn: bookForm.isbn,
            author_id: Number(bookForm.author_id),
            category_id: Number(bookForm.category_id),
            publisher: bookForm.publisher || null,
            publication_year: bookForm.publication_year
              ? Number(bookForm.publication_year)
              : null,
            edition: bookForm.edition || null,
            language: bookForm.language || null,
            description: bookForm.description || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to add book.");
        return;
      }

      setMessage("Book added successfully.");

      setBookForm({
        title: "",
        isbn: "",
        author_id: "",
        category_id: "",
        publisher: "",
        publication_year: "",
        edition: "",
        language: "",
        description: "",
      });

      await loadBooks();
    } catch (err) {
      console.error("Add book error:", err);
      setError("Unable to connect to the server.");
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================
     DELETE BOOK
     ========================================= */

  const deleteBook = async (bookId, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${title}"?`
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      setActionLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/books/${bookId}`,
        {
          method: "DELETE",
          headers,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to remove book.");
        return;
      }

      setMessage("Book removed successfully.");

      await loadBooks();
      await loadCopies();
    } catch (err) {
      console.error("Delete book error:", err);
      setError("Unable to connect to the server.");
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================
     ADD BOOK COPY
     ========================================= */

  const addBookCopy = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      setActionLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/book-copies`,
        {
          method: "POST",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            book_id: Number(copyForm.book_id),
            accession_number: copyForm.accession_number,
            shelf_location:
              copyForm.shelf_location || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message || "Unable to add book copy."
        );
        return;
      }

      setMessage("Book copy added successfully.");

      setCopyForm({
        book_id: "",
        accession_number: "",
        shelf_location: "",
      });

      await loadCopies();
    } catch (err) {
      console.error("Add book copy error:", err);
      setError("Unable to connect to the server.");
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================
     DELETE BOOK COPY
     ========================================= */

  const deleteBookCopy = async (copyId) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove Book Copy ${copyId}?`
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      setActionLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/book-copies/${copyId}`,
        {
          method: "DELETE",
          headers,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message || "Unable to remove book copy."
        );
        return;
      }

      setMessage("Book copy removed successfully.");

      await loadCopies();
    } catch (err) {
      console.error("Delete book copy error:", err);
      setError("Unable to connect to the server.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <CommonHeader />

        <div className="management-loading">
          Loading library management data...
        </div>
      </>
    );
  }

  return (
    <>
      <CommonHeader />

      <div className="library-management-page">

        {/* =========================================
            TITLE
            ========================================= */}

        <div className="management-title">
          <h1>Library Management</h1>

          <p>
            Manage books and physical book copies in
            the library.
          </p>
        </div>

        {/* =========================================
            MESSAGES
            ========================================= */}

        {message && (
          <div className="management-message">
            {message}
          </div>
        )}

        {error && (
          <div className="management-error">
            {error}
          </div>
        )}

        {/* =========================================
        ADD NEW BOOK - DRAWER
        ========================================= */}

        <section className="management-section drawer-section">

        <button
            type="button"
            className="drawer-header"
            onClick={() => toggleSection("add-book")}
        >
            <div>
            <h2>Add New Book</h2>

            <p>
                Add a new book to the library catalogue.
            </p>
            </div>

            <span className="drawer-icon">
            {openSection === "add-book" ? "▲" : "▼"}
            </span>
        </button>

        {openSection === "add-book" && (
            <div className="drawer-content">

            <div className="management-form-card">

                <form
                className="management-form"
                onSubmit={addBook}
                >

                <div className="form-field">
                    <label>Book Title *</label>

                    <input
                    type="text"
                    name="title"
                    value={bookForm.title}
                    onChange={handleBookChange}
                    placeholder="Enter book title"
                    required
                    />
                </div>

                <div className="form-field">
                    <label>ISBN *</label>

                    <input
                    type="text"
                    name="isbn"
                    value={bookForm.isbn}
                    onChange={handleBookChange}
                    placeholder="Enter ISBN"
                    required
                    />
                </div>

                <div className="form-field">
                    <label>Author *</label>

                    <select
                    name="author_id"
                    value={bookForm.author_id}
                    onChange={handleBookChange}
                    required
                    >
                    <option value="">
                        Select author
                    </option>

                    {authors.map((author) => (
                        <option
                        key={
                            author.author_id ||
                            author.id
                        }
                        value={
                            author.author_id ||
                            author.id
                        }
                        >
                        {author.name ||
                            author.author_name}
                        </option>
                    ))}
                    </select>
                </div>

                <div className="form-field">
                    <label>Category *</label>

                    <select
                    name="category_id"
                    value={bookForm.category_id}
                    onChange={handleBookChange}
                    required
                    >
                    <option value="">
                        Select category
                    </option>

                    {categories.map((category) => (
                        <option
                        key={
                            category.category_id ||
                            category.id
                        }
                        value={
                            category.category_id ||
                            category.id
                        }
                        >
                        {category.name ||
                            category.category_name}
                        </option>
                    ))}
                    </select>
                </div>

                <div className="form-field">
                    <label>Publisher</label>

                    <input
                    type="text"
                    name="publisher"
                    value={bookForm.publisher}
                    onChange={handleBookChange}
                    placeholder="Enter publisher"
                    />
                </div>

                <div className="form-field">
                    <label>Publication Year</label>

                    <input
                    type="number"
                    name="publication_year"
                    value={bookForm.publication_year}
                    onChange={handleBookChange}
                    placeholder="e.g. 2025"
                    min="1000"
                    max="2100"
                    />
                </div>

                <div className="form-field">
                    <label>Edition</label>

                    <input
                    type="text"
                    name="edition"
                    value={bookForm.edition}
                    onChange={handleBookChange}
                    placeholder="e.g. 3rd Edition"
                    />
                </div>

                <div className="form-field">
                    <label>Language</label>

                    <input
                    type="text"
                    name="language"
                    value={bookForm.language}
                    onChange={handleBookChange}
                    placeholder="e.g. English"
                    />
                </div>

                <div className="form-field form-field-full">
                    <label>Description</label>

                    <textarea
                    name="description"
                    value={bookForm.description}
                    onChange={handleBookChange}
                    placeholder="Enter book description"
                    rows="3"
                    />
                </div>

                <div className="form-actions">
                    <button
                    type="submit"
                    className="management-primary-btn"
                    disabled={actionLoading}
                    >
                    {actionLoading
                        ? "Adding..."
                        : "Add Book"}
                    </button>
                </div>

                </form>

            </div>

            </div>
        )}
        </section>


        {/* =========================================
            ADD BOOK COPY - DRAWER
            ========================================= */}

        <section className="management-section drawer-section">

        <button
            type="button"
            className="drawer-header"
            onClick={() => toggleSection("add-copy")}
        >
            <div>
            <h2>Add Book Copy</h2>

            <p>
                Add a physical copy of an existing book
                to the library.
            </p>
            </div>

            <span className="drawer-icon">
            {openSection === "add-copy" ? "▲" : "▼"}
            </span>
        </button>

        {openSection === "add-copy" && (
            <div className="drawer-content">

            <div className="management-form-card">

                <form
                className="management-copy-form"
                onSubmit={addBookCopy}
                >

                <div className="form-field">
                    <label>Book *</label>

                    <select
                    name="book_id"
                    value={copyForm.book_id}
                    onChange={handleCopyChange}
                    required
                    >
                    <option value="">
                        Select book
                    </option>

                    {books.map((book) => (
                        <option
                        key={book.book_id}
                        value={book.book_id}
                        >
                        {book.title}
                        </option>
                    ))}
                    </select>
                </div>

                <div className="form-field">
                    <label>Accession Number *</label>

                    <input
                    type="text"
                    name="accession_number"
                    value={copyForm.accession_number}
                    onChange={handleCopyChange}
                    readOnly
                    placeholder="e.g. LIB-001"
                    required
                    />
                </div>

                <div className="form-field">
                    <label>Shelf Location</label>

                    <input
                    type="text"
                    name="shelf_location"
                    value={copyForm.shelf_location}
                    onChange={handleCopyChange}
                    placeholder="e.g. A-12"
                    />
                </div>

                <div className="form-actions">
                    <button
                    type="submit"
                    className="management-primary-btn"
                    disabled={actionLoading}
                    >
                    {actionLoading
                        ? "Adding..."
                        : "Add Copy"}
                    </button>
                </div>

                </form>

            </div>

            </div>
        )}
        </section>


        {/* =========================================
            BOOK COPIES - DRAWER
            ========================================= */}

        <section className="management-section drawer-section">

        <button
            type="button"
            className="drawer-header"
            onClick={() => toggleSection("book-copies")}
        >
            <div>
            <h2>Book Copies</h2>

            <p>
                View and remove physical copies.
            </p>
            </div>

            <div className="drawer-header-right">

            <span className="management-count">
                {copies.length} Copies
            </span>

            <span className="drawer-icon">
                {openSection === "book-copies"
                ? "▲"
                : "▼"}
            </span>

            </div>
        </button>

        {openSection === "book-copies" && (
            <div className="drawer-content">

            <div className="management-table-wrapper">

                <table className="management-table">

                <thead>
                    <tr>
                    <th>Copy ID</th>
                    <th>Book</th>
                    <th>Accession Number</th>
                    <th>Shelf</th>
                    <th>Status</th>
                    <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                    {copies.length === 0 ? (
                    <tr>
                        <td
                        colSpan="6"
                        className="management-empty"
                        >
                        No book copies found.
                        </td>
                    </tr>
                    ) : (
                    copies.map((copy) => (
                        <tr key={copy.copy_id}>

                        <td>
                            {copy.copy_id}
                        </td>

                        <td>
                            <strong>
                            {copy.book_title}
                            </strong>
                        </td>

                        <td>
                            {copy.accession_number}
                        </td>

                        <td>
                            {copy.shelf_location || "-"}
                        </td>

                        <td>
                            <span
                            className={
                                copy.status === "AVAILABLE"
                                ? "copy-status-available"
                                : "copy-status-issued"
                            }
                            >
                            {copy.status}
                            </span>
                        </td>

                        <td>
                            <button
                            className="management-delete-btn"
                            onClick={() =>
                                deleteBookCopy(
                                copy.copy_id
                                )
                            }
                            disabled={
                                actionLoading ||
                                copy.status === "ISSUED"
                            }
                            >
                            {copy.status === "ISSUED"
                                ? "Issued"
                                : "Remove"}
                            </button>
                        </td>

                        </tr>
                    ))
                    )}

                </tbody>

                </table>

            </div>

            </div>
        )}
        </section>


        {/* =========================================
            BOOKS - NORMAL SECTION / ALWAYS VISIBLE
            MUST BE LAST
            ========================================= */}

        <section className="management-section">

        <div className="management-section-header">

            <div>
            <h2>Books</h2>

            <p>
                View and remove books from the catalogue.
            </p>
            </div>

            <span className="management-count">
            {books.length} Books
            </span>

        </div>

        <div className="management-table-wrapper">

            <table className="management-table">

            <thead>
                <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>ISBN</th>
                <th>Year</th>
                <th>Action</th>
                </tr>
            </thead>

            <tbody>

                {books.length === 0 ? (
                <tr>
                    <td
                    colSpan="7"
                    className="management-empty"
                    >
                    No books found.
                    </td>
                </tr>
                ) : (
                books.map((book) => (
                    <tr key={book.book_id}>

                    <td>
                        {book.book_id}
                    </td>

                    <td>
                        <strong>
                        {book.title}
                        </strong>
                    </td>

                    <td>
                        {book.author || "-"}
                    </td>

                    <td>
                        {book.category || "-"}
                    </td>

                    <td>
                        {book.isbn || "-"}
                    </td>

                    <td>
                        {book.publication_year || "-"}
                    </td>

                    <td>
                        <button
                        className="management-delete-btn"
                        onClick={() =>
                            deleteBook(
                            book.book_id,
                            book.title
                            )
                        }
                        disabled={actionLoading}
                        >
                        Remove
                        </button>
                    </td>

                    </tr>
                ))
                )}

            </tbody>

            </table>

        </div>

        </section>

      </div>
    </>
  );
}

export default LibraryManagement;