import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("access_token");
  const storedUser = localStorage.getItem("user");

  if (!token || !storedUser) {
    return <Navigate to="/" replace />;
  }

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }

  const roleId = Number(user.role_id);

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(roleId)
  ) {
    if (roleId === 1) {
      return <Navigate to="/admin" replace />;
    }

    if (roleId === 2) {
      return <Navigate to="/librarian" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;