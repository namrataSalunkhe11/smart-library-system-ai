import CommonHeader from "../components/CommonHeader";
import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";
import "./Borrowings.css";

function Borrowings() {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBorrowings = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("Authentication token not found. Please login again.");
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/issues/my-borrowings`,
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
          setError(data.message || "Failed to load borrowings.");
          return;
        }

        setBorrowings(data.borrowings || []);
      } catch (error) {
        console.error("Borrowings API error:", error);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowings();
  }, []);

  if (loading) {
    return (
      <>
      <CommonHeader />
      <div className="borrowings-page">
        <h1>📖 My Borrowings</h1>
        <p>Loading borrowing history...</p>
      </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="borrowings-page">
        <h1>📖 My Borrowings</h1>
        <p className="borrowings-error">{error}</p>
      </div>
    );
  }

  return (
    <>
    <CommonHeader />
    <div className="borrowings-page">
      

      {borrowings.length === 0 ? (
        <div className="no-borrowings">
          <div className="empty-icon">📚</div>
          <h2>No Borrowing History</h2>
          <p>You have not borrowed any books yet.</p>
        </div>
      ) : (
        <div className="borrowings-grid">
          {borrowings.map((borrowing) => (
            <div
              className="borrowing-card"
              key={borrowing.transaction_id}
            >
              <div className="borrowing-icon">📖</div>

              <h2>{borrowing.title}</h2>

              <p>
                <strong>Author:</strong> {borrowing.author}
              </p>

              <p>
                <strong>Category:</strong> {borrowing.category}
              </p>

              <p>
                <strong>Issue Date:</strong>{" "}
                {borrowing.issue_date}
              </p>

              <p>
                <strong>Due Date:</strong>{" "}
                {borrowing.due_date}
              </p>

              <p>
                <strong>Return Date:</strong>{" "}
                {borrowing.return_date || "Not returned"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`borrowing-status ${borrowing.status.toLowerCase()}`}
                >
                  {borrowing.status}
                </span>
              </p>

              <p>
                <strong>Fine:</strong> ₹
                {Number(borrowing.fine_amount || 0).toFixed(2)}
              </p>

              <p>
                <strong>Fine Paid:</strong>{" "}
                {borrowing.fine_paid ? "Yes" : "No"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}

export default Borrowings;

