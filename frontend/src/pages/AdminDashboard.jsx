
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [copies, setCopies] = useState([]);
  const [reservations, setReservations] = useState([]);

  const [userId, setUserId] = useState("");
  const [copyId, setCopyId] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reservationLoading, setReservationLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("access_token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [booksResponse, copiesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/books`, {
          method: "GET",
          headers,
        }),
        fetch(`${API_BASE_URL}/book-copies`, {
          method: "GET",
          headers,
        }),
      ]);

      const booksData = await booksResponse.json();
      const copiesData = await copiesResponse.json();

      if (booksData.success) {
        setBooks(booksData.books || []);
      }

      if (copiesData.success) {
        setCopies(copiesData.copies || []);
      }

      if (!booksData.success || !copiesData.success) {
        setError("Unable to load library data.");
      }
    } catch (err) {
      console.error("Admin dashboard error:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const loadReservations = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/reservations/all`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to load reservations.");
        return;
      }

      setReservations(data.reservations || []);
    } catch (err) {
      console.error("Reservations error:", err);
      setError("Unable to load reservations.");
    }
  };

  useEffect(() => {
    loadData();
    loadReservations();
  }, []);

  const issueBook = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!userId || !copyId) {
      setError("User ID and Copy ID are required.");
      return;
    }

    try {
      setActionLoading(true);

      const response = await fetch(`${API_BASE_URL}/issues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: Number(userId),
          copy_id: Number(copyId),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to issue book.");
        return;
      }

      setMessage(
        `Book issued successfully. Transaction ID: ${data.transaction_id}`
      );

      setUserId("");
      setCopyId("");

      await loadData();
    } catch (err) {
      console.error("Issue book error:", err);
      setError("Unable to connect to the server.");
    } finally {
      setActionLoading(false);
    }
  };

  const issueReservedBook = async (reservationId) => {
    try {
      setReservationLoading(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/reservations/${reservationId}/fulfill`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message || "Unable to issue reserved book."
        );
        return;
      }

      setMessage(
        `Book issued successfully. Due date: ${data.due_date}`
      );

      await loadReservations();
      await loadData();
    } catch (err) {
      console.error("Issue reserved book error:", err);
      setError("Unable to connect to the server.");
    } finally {
      setReservationLoading(false);
    }
  };

  const returnBook = async (copyId) => {
    setMessage("");
    setError("");

    try {
      setActionLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/issues/return/${copyId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to return book.");
        return;
      }

      setMessage(
        `Book returned successfully. Fine: ₹${data.fine_amount}`
      );

      await loadData();
    } catch (err) {
      console.error("Return book error:", err);
      setError("Unable to connect to the server.");
    } finally {
      setActionLoading(false);
    }
  };

  const availableCopies = copies.filter(
    (copy) => copy.status === "AVAILABLE"
  );

  const issuedCopies = copies.filter(
    (copy) => copy.status === "ISSUED"
  );

  const activeReservations = reservations.filter(
    (reservation) => reservation.status === "ACTIVE"
  );

  if (loading) {
    return (
      <div className="admin-page">
        <h1>Admin / Librarian Dashboard</h1>
        <p>Loading library management data...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Smart Library Management</h1>
          <p>
            Welcome, {user.first_name} {user.last_name}
          </p>
        </div>

        <div className="admin-header-actions">
          <span className="role-badge">
            {Number(user.role_id) === 1 ? "Admin" : "Librarian"}
          </span>

          <button onClick={() => navigate("/dashboard")}>
            User Dashboard
          </button>

          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {message && (
        <div className="admin-message">
          {message}
        </div>
      )}

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      <section className="admin-stats">
        <div className="admin-stat">
          <h3>{books.length}</h3>
          <p>Total Books</p>
        </div>

        <div className="admin-stat">
          <h3>{copies.length}</h3>
          <p>Total Copies</p>
        </div>

        <div className="admin-stat">
          <h3>{availableCopies.length}</h3>
          <p>Available Copies</p>
        </div>

        <div className="admin-stat">
          <h3>{issuedCopies.length}</h3>
          <p>Issued Copies</p>
        </div>
      </section>

      <section className="admin-section">
        <div className="section-heading">
          <div>
            <h2>Book Reservations</h2>
            <p>
              Students who have reserved books for collection.
            </p>
          </div>
        </div>

        {activeReservations.length === 0 ? (
          <div className="empty-admin">
            No active reservations.
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Book</th>
                  <th>Copy ID</th>
                  <th>Reservation Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {activeReservations.map((reservation) => (
                  <tr key={reservation.reservation_id}>
                    <td>{reservation.student_name}</td>

                    <td>{reservation.book_title}</td>

                    <td>{reservation.copy_id}</td>

                    <td>
                      {reservation.reservation_date}
                    </td>

                    <td>
                      <span className="status-available">
                        {reservation.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="return-btn"
                        onClick={() =>
                          issueReservedBook(
                            reservation.reservation_id
                          )
                        }
                        disabled={reservationLoading}
                      >
                        {reservationLoading
                          ? "Processing..."
                          : "Issue Book"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-section">
        <h2>Issue Book</h2>

        <form className="issue-form" onSubmit={issueBook}>
          <div>
            <label>User ID</label>

            <input
              type="number"
              value={userId}
              onChange={(event) =>
                setUserId(event.target.value)
              }
              placeholder="Enter student user ID"
              min="1"
              required
            />
          </div>

          <div>
            <label>Book Copy ID</label>

            <select
              value={copyId}
              onChange={(event) =>
                setCopyId(event.target.value)
              }
              required
            >
              <option value="">
                Select available copy
              </option>

              {availableCopies.map((copy) => (
                <option
                  key={copy.copy_id}
                  value={copy.copy_id}
                >
                  Copy {copy.copy_id} - {copy.book_title}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={actionLoading}
          >
            {actionLoading
              ? "Processing..."
              : "Issue Book"}
          </button>
        </form>
      </section>

      <section className="admin-section">
        <div className="section-heading">
          <div>
            <h2>Issued Books</h2>
            <p>
              Books currently issued from the library.
            </p>
          </div>
        </div>

        {issuedCopies.length === 0 ? (
          <div className="empty-admin">
            No books are currently issued.
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Copy ID</th>
                  <th>Book</th>
                  <th>Accession Number</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {issuedCopies.map((copy) => (
                  <tr key={copy.copy_id}>
                    <td>{copy.copy_id}</td>

                    <td>{copy.book_title}</td>

                    <td>{copy.accession_number}</td>

                    <td>
                      <span className="status-issued">
                        {copy.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="return-btn"
                        onClick={() =>
                          returnBook(copy.copy_id)
                        }
                        disabled={actionLoading}
                      >
                        Return
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-section">
        <h2>Book Copies</h2>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Copy ID</th>
                <th>Book</th>
                <th>Accession Number</th>
                <th>Shelf</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {copies.map((copy) => (
                <tr key={copy.copy_id}>
                  <td>{copy.copy_id}</td>
                  <td>{copy.book_title}</td>
                  <td>{copy.accession_number}</td>
                  <td>{copy.shelf_location || "-"}</td>
                  <td>
                    <span
                      className={
                        copy.status === "AVAILABLE"
                          ? "status-available"
                          : "status-issued"
                      }
                    >
                      {copy.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section">
        <h2>Books</h2>

        <div className="books-admin-grid">
          {books.map((book) => (
            <div
              className="book-admin-card"
              key={book.book_id}
            >
              <h3>{book.title}</h3>

              <p>
                <strong>Author:</strong>{" "}
                {book.author || "-"}
              </p>

              <p>
                <strong>Category:</strong>{" "}
                {book.category || "-"}
              </p>

              <p>
                <strong>ISBN:</strong>{" "}
                {book.isbn || "-"}
              </p>

              <p>
                <strong>Year:</strong>{" "}
                {book.publication_year || "-"}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;

