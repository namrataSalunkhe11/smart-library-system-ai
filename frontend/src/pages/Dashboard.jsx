import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        navigate("/");
    };
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Smart Library</h1>
          <p>Library Management System with AI Recommendations</p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
            Logout
        </button>
      </header>

      <main className="dashboard-content">
        <h2>Welcome to Smart Library</h2>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>📚 Books</h3>
            <p>Browse and search books available in the library.</p>
            <button onClick={() => navigate("/books")}>
                View Books
            </button>
          </div>

          <div className="dashboard-card">
            <h3>🔖 My Borrowings</h3>
            <p>View your current and previous borrowed books.</p>
            <button onClick={() => navigate("/borrowings")}>
                View Borrowings
            </button>
          </div>

          <div className="dashboard-card">
            <h3>🤖 AI Recommendations</h3>
            <p>Get personalized book recommendations based on your borrowing history.</p>
            <button onClick={() => navigate("/recommendations")}>
                View Recommendations
            </button>
          </div>

          <div className="dashboard-card">
            <h3>📅 Reservations</h3>
            <p>View and manage your book reservations.</p>
            <button onClick={() => navigate("/reservations")}>
              View Reservations
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;