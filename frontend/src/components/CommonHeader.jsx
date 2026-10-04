import { useNavigate, useLocation } from "react-router-dom";
import "./CommonHeader.css";

function CommonHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const roleId = Number(user.role_id);
  const isAdmin = roleId === 1;

  const isDashboard =
    location.pathname === "/dashboard";

  const isAdminDashboard =
    location.pathname === "/admin";

  const isLibrarianDashboard = 
    location.pathname ==="/librarian"

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="common-header">

      {/* LEFT */}
      <div className="common-header-left">

        <div className="app-logo">
          📚
        </div>

        <div>
          <h1>Smart Library</h1>
          <span>
            Library Management System with AI Recommendations
          </span>
        </div>

      </div>

      {/* RIGHT */}
      <div className="common-header-right">

        {/* Home button only on internal pages */}
        {!isDashboard && !isAdminDashboard && !isLibrarianDashboard && (
          <button
                className="home-btn"
                onClick={() => {
                    if (roleId === 1) {
                        navigate("/admin");
                    } else if (roleId === 2) {
                        navigate("/librarian");
                    } else {
                        navigate("/dashboard");
                    }
                }}
            >
            🏠
            </button>
        )}

        {/* Admin-only Create User button */}
        {isAdmin && isAdminDashboard && (
          <button
            className="create-user-header-btn"
            onClick={() => navigate("/register")}
          >
            + Create New User
          </button>
        )}

        {/* User information */}
        <div className="header-user">

          <div className="header-user-info">
            <strong>
              {user.first_name} {user.last_name}
            </strong>

            <span>
              {roleId === 1
                ? "Admin"
                : roleId === 2
                ? "Librarian"
                : "Student"}
            </span>
          </div>

          {/* Logout always at top-right */}
          <button
            className="header-logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </div>

    </header>
  );
}

export default CommonHeader;