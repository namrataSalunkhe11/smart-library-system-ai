import CommonHeader from "../components/CommonHeader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../services/api";
import "./LibrarianDashboard.css";

function LibrarianDashboard() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [copies, setCopies] = useState([]);
  const [reservations, setReservations] = useState([]);

  const [userId, setUserId] = useState("");
  const [copyId, setCopyId] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reservationLoading, setReservationLoading] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [finePopup, setFinePopup] = useState(null);
  const [finePaying, setFinePaying] = useState(false);

  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (sectionName) => {
    setOpenSection((current) =>
      current === sectionName ? null : sectionName
    );
  };

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

      const [booksResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/books`, {
          method: "GET",
          headers,
        }),
      ]);

      const booksData = await booksResponse.json();
      

      if (booksData.success) {
        setBooks(booksData.books || []);
      }

      

      if (!booksData.success) {
        setError("Unable to load library data.");
      }
    } catch (err) {
      console.error("Admin dashboard error:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };
  const loadCopies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/book-copies`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message || "Unable to load book copies."
        );
        return;
      }

      setCopies(data.copies || []);
    } catch (err) {
      console.error("Librarian dashboard error:", err);
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
        setError(
          data.message || "Unable to load reservations."
        );
        return;
      }

      setReservations(data.reservations || []);
    } catch (err) {
      console.error("Reservations error:", err);
      setError("Unable to load reservations.");
    }
  };

  useEffect(() => {
    loadCopies();
    loadData();
    loadReservations();
  }, []);

  const issueBook = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!userId || !copyId) {
      setError(
        "User ID and Book Copy ID are required."
      );
      return;
    }

    try {
      setActionLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/issues`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: Number(userId),
            copy_id: Number(copyId),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message || "Unable to issue book."
        );
        return;
      }

      setMessage(
        `Book issued successfully. Transaction ID: ${data.transaction_id}`
      );

      setUserId("");
      setCopyId("");

      await loadCopies();
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
      await loadCopies();
    } catch (err) {
      console.error(
        "Issue reserved book error:",
        err
      );
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

      // Fine exists → show popup
      if (data.fine_required) {
        setFinePopup({
          transactionId: data.transaction_id,
          copyId: data.copy_id,
          fineAmount: data.fine_amount,
        });

        return;
      }

      // No fine → return immediately
      setMessage("Book returned successfully.");

      await loadCopies();

    } catch (err) {
      console.error("Return book error:", err);
      setError("Unable to connect to the server.");
    } finally {
      setActionLoading(false);
    }
  };

  const payFineAndReturn = async () => {
    if (!finePopup) {
      return;
    }

    setFinePaying(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/issues/pay-fine/${finePopup.transactionId}`,
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
          data.message || "Unable to process fine payment."
        );
        return;
      }

      setFinePopup(null);

      setMessage(
        `Fine of ₹${data.fine_amount} paid. Book returned successfully.`
      );

      await loadCopies();

    } catch (err) {
      console.error("Fine payment error:", err);
      setError("Unable to connect to the server.");
    } finally {
      setFinePaying(false);
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
      <>
      <CommonHeader />
      <div className="librarian-page">
        <h1>Librarian Dashboard</h1>
        <p>Loading library data...</p>
      </div>
      </>
    );
  }

  return (
    <>
    <CommonHeader />
    
    {finePopup && (
      <div className="fine-modal-overlay">
        <div className="fine-modal">

          <div className="fine-modal-icon">
            💰
          </div>

          <h2>Fine Payment Required</h2>

          <p>
            This book is overdue and has an outstanding fine.
          </p>

          <div className="fine-amount">
            ₹{finePopup.fineAmount}
          </div>

          <p className="fine-modal-note">
            Please collect the fine payment before completing
            the book return.
          </p>

          <button
            className="fine-paid-btn"
            onClick={payFineAndReturn}
            disabled={finePaying}
          >
            {finePaying ? "Processing..." : "PAID"}
          </button>

        </div>
      </div>
    )}
    <div className="librarian-page">
      

      {message && (
        <div className="librarian-message">
          {message}
        </div>
      )}

      {error && (
        <div className="librarian-error">
          {error}
        </div>
      )}

      <section className="librarian-stats">
        <div className="librarian-stat">
          <h3>{books.length}</h3>
          <p>Total Books</p>
        </div>
        <div className="librarian-stat">
          <h3>{copies.length}</h3>
          <p>Total Copies</p>
        </div>

        <div className="librarian-stat">
          <h3>{availableCopies.length}</h3>
          <p>Available Copies</p>
        </div>

        <div className="librarian-stat">
          <h3>{issuedCopies.length}</h3>
          <p>Issued Copies</p>
        </div>

        <div
          className="librarian-stat inventory-stat"
          onClick={() => navigate("/library-management")}
        >
          <h3>📚</h3>
          <p>Book Inventory</p>
        </div>
      </section>

      
      {/* ================================
          BOOK RESERVATIONS
          ================================ */}
      <section className="librarian-section">

        <button
          type="button"
          className="drawer-header"
          onClick={() => toggleSection("reservations")}
        >
          <div>
            <h2>Book Reservations</h2>
            <p>Students who have reserved books for collection.</p>
          </div>

          <span className="drawer-icon">
            {openSection === "reservations" ? "▲" : "▼"}
          </span>
        </button>

        {openSection === "reservations" && (
          <div className="drawer-content">

            {activeReservations.length === 0 ? (
              <div className="empty-librarian">
                No active reservations.
              </div>
            ) : (
              <div className="librarian-table-wrapper">
                <table className="librarian-table">
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

                        <td>{reservation.reservation_date}</td>

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

          </div>
        )}

      </section>


      {/* ================================
          ISSUE BOOK
          ================================ */}
      <section className="librarian-section">

        <button
          type="button"
          className="drawer-header"
          onClick={() => toggleSection("issue")}
        >
          <div>
            <h2>Issue Book</h2>
            <p>Issue an available book copy to a student.</p>
          </div>

          <span className="drawer-icon">
            {openSection === "issue" ? "▲" : "▼"}
          </span>
        </button>

        {openSection === "issue" && (
          <div className="drawer-content">

            <form
              className="issue-form"
              onSubmit={issueBook}
            >

              <div>
                <label>Student User ID</label>

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
                <label>Book Copy</label>

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

          </div>
        )}

      </section>


      {/* ================================
          ISSUED BOOKS
          ================================ */}
      <section className="librarian-section">

        <button
          type="button"
          className="drawer-header"
          onClick={() => toggleSection("issued")}
        >
          <div>
            <h2>Issued Books</h2>
            <p>Books currently issued from the library.</p>
          </div>

          <span className="drawer-icon">
            {openSection === "issued" ? "▲" : "▼"}
          </span>
        </button>

        {openSection === "issued" && (
          <div className="drawer-content">

            {issuedCopies.length === 0 ? (
              <div className="empty-librarian">
                No books are currently issued.
              </div>
            ) : (
              <div className="librarian-table-wrapper">

                <table className="librarian-table">

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

          </div>
        )}

      </section>


      {/* ================================
          BOOK COPIES
          ================================ */}
      <section className="librarian-section">

        <button
          type="button"
          className="drawer-header"
          onClick={() => toggleSection("copies")}
        >
          <div>
            <h2>Book Copies</h2>
            <p>Monitor the availability of library copies.</p>
          </div>

          <span className="drawer-icon">
            {openSection === "copies" ? "▲" : "▼"}
          </span>
        </button>

        {openSection === "copies" && (
          <div className="drawer-content">

            <div className="librarian-table-wrapper">

              <table className="librarian-table">

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

                      <td>
                        {copy.shelf_location || "-"}
                      </td>

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

          </div>
        )}

      </section>
    </div>
    </>
  );
}

export default LibrarianDashboard;

