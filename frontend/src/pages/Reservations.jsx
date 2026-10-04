
import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";
import "./Reservations.css";

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to load reservations.");
        return;
      }

      setReservations(data.reservations || []);
    } catch (error) {
      console.error("Reservations API error:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (reservationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(reservationId);
      setError("");

      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${API_BASE_URL}/reservations/${reservationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to cancel reservation.");
        return;
      }

      await fetchReservations();
    } catch (error) {
      console.error("Cancel reservation error:", error);
      setError("Unable to cancel the reservation.");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="reservations-page">
        <h1>📅 My Reservations</h1>
        <p>Loading reservations...</p>
      </div>
    );
  }

  return (
    <div className="reservations-page">
      <div className="reservations-header">
        <div>
          <h1>📅 My Reservations</h1>
          <p>View and manage your book reservations.</p>
        </div>

        <div className="reservation-count">
          {reservations.length} Reservations
        </div>
      </div>

      {error && <p className="reservations-error">{error}</p>}

      {reservations.length === 0 ? (
        <div className="no-reservations">
          <div className="empty-icon">📚</div>

          <h2>No Reservations</h2>

          <p>You have not reserved any books yet.</p>
        </div>
      ) : (
        <div className="reservations-grid">
          {reservations.map((reservation) => (
            <div
              className="reservation-card"
              key={reservation.reservation_id}
            >
              <div className="reservation-icon">📖</div>

              <h2>{reservation.book_title}</h2>

              <p>
                <strong>Reservation ID:</strong>{" "}
                {reservation.reservation_id}
              </p>

              <p>
                <strong>Reservation Date:</strong>{" "}
                {reservation.reservation_date}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    reservation.status === "ACTIVE"
                      ? "status-active"
                      : reservation.status === "FULFILLED"
                      ? "status-fulfilled"
                      : "status-cancelled"
                  }
                >
                  {reservation.status}
                </span>
              </p>

              {reservation.status === "ACTIVE" && (
                <>
                  <p className="reservation-info">
                    Your reservation is waiting for collection. Please
                    collect the book from the library after it is issued
                    by the librarian.
                  </p>

                  <button
                    className="cancel-reservation-btn"
                    onClick={() =>
                      handleCancel(reservation.reservation_id)
                    }
                    disabled={
                      cancellingId === reservation.reservation_id
                    }
                  >
                    {cancellingId === reservation.reservation_id
                      ? "Cancelling..."
                      : "Cancel Reservation"}
                  </button>
                </>
              )}

              {reservation.status === "FULFILLED" && (
                <p className="reservation-info">
                  This reservation has been fulfilled. The book has been
                  issued to you.
                </p>
              )}

              {reservation.status === "CANCELLED" && (
                <p className="reservation-info">
                  This reservation has been cancelled.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reservations;

