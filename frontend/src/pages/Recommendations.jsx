import CommonHeader from "../components/CommonHeader";
import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";
import "./Recommendations.css";

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          setError("User information not found. Please login again.");
          return;
        }

        const user = JSON.parse(storedUser);

        if (!user.user_id) {
          setError("User ID not found. Please login again.");
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/recommendations/${user.user_id}`,
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
          setError(
            data.message || "Failed to load recommendations."
          );
          return;
        }

        setRecommendations(data.recommendations || []);

        if (data.message) {
          setMessage(data.message);
        }
      } catch (error) {
        console.error("Recommendation API error:", error);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <>
      <CommonHeader />
      <div className="recommendations-page">
        <h1>🤖 AI Recommendations</h1>
        <p>Generating personalized recommendations...</p>
      </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="recommendations-page">
        <h1>🤖 AI Recommendations</h1>
        <p className="recommendations-error">{error}</p>
      </div>
    );
  }

  return (
    <>
    <CommonHeader />
    <div className="recommendations-page">
      

      {recommendations.length === 0 ? (
        <div className="no-recommendations">
          <div className="empty-icon">🤖</div>

          <h2>No Recommendations Yet</h2>

          <p>
            {message ||
              "Borrow some books to receive personalized recommendations."}
          </p>
        </div>
      ) : (
        <div className="recommendations-grid">
          {recommendations.map((book) => (
            <div
              className="recommendation-card"
              key={book.book_id}
            >
              <div className="recommendation-icon">
                🤖
              </div>

              <h2>{book.title}</h2>

              <p>
                <strong>Author:</strong> {book.author}
              </p>

              <p>
                <strong>Category:</strong> {book.category}
              </p>

              <p>
                <strong>Publisher:</strong>{" "}
                {book.publisher || "N/A"}
              </p>

              <div className="recommendation-score">
                ⭐ Recommendation Score:{" "}
                {book.recommendation_score}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}

export default Recommendations;