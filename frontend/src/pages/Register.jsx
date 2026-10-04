import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../services/api";
import "./Register.css";

function Register() {
const navigate = useNavigate();

const currentUser = JSON.parse(
localStorage.getItem("user") || "{}"
);

const isAdmin = Number(currentUser.role_id) === 1;

const [roleId, setRoleId] = useState(3);
const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [phone, setPhone] = useState("");
const [password, setPassword] = useState("");

const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [loading, setLoading] = useState(false);

const roleSuffix = {
  1: ".admin@library.com",
  2: ".librarian@library.com",
  3: ".student@library.com",
};

const getFinalUsername = () => {
  const value = username.trim().toLowerCase();

  if (!value) {
    return "";
  }

  const suffix = roleSuffix[roleId];

  if (value.endsWith(suffix)) {
    return value;
  }

  if (value.includes("@")) {
    return value;
  }

  return `${value}${suffix}`;
};

const handleRoleChange = (event) => {
setRoleId(Number(event.target.value));
setUsername("");
setError("");
};

const handleUsernameChange = (event) => {
setUsername(event.target.value);
setError("");
};


const handleSubmit = async (event) => {
  event.preventDefault();

  setError("");
  setSuccess("");

  const finalUsername = getFinalUsername();

  if (!username.trim()) {
    setError("Username is required.");
    return;
  }

  if (!finalUsername.endsWith(roleSuffix[roleId])) {
    setError(
      `Username must end with ${roleSuffix[roleId]}`
    );
    return;
  }

  setLoading(true);

  try {
    const token = localStorage.getItem("access_token");

    const headers = {
      "Content-Type": "application/json",
    };

    // Send Admin JWT when Admin is creating a user
    if (isAdmin && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_BASE_URL}/auth/register`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          username: finalUsername,
          email: email,
          password: password,
          phone: phone,
          role_id: roleId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      setError(data.message || "Registration failed.");
      return;
    }

    setSuccess(
      `${data.message} Username: ${data.username}`
    );

    setUsername("");
    setEmail("");
    setFirstName("");
    setLastName("");
    setPhone("");
    setPassword("");

    if (!isAdmin) {
      setTimeout(() => {
        navigate("/");
      }, 5000);
    }

  } catch (error) {
    console.error("Registration error:", error);

    setError(
      "Unable to connect to the server. Please make sure the backend is running."
    );
  } finally {
    setLoading(false);
  }
};



const suffix = roleSuffix[roleId];

return ( <div className="register-page"> <div className="register-card">


    <div className="register-icon">📚</div>

    <h1>
      {isAdmin
        ? "Create Library User"
        : "Create Your Account"}
    </h1>

    <p className="register-subtitle">
      {isAdmin
        ? "Register an Admin, Librarian or Student"
        : "Register for your Smart Library account"}
    </p>

    <form onSubmit={handleSubmit}>

      {isAdmin && (
        <div className="form-group">
          <label htmlFor="role">
            Register As
          </label>

          <select
            id="role"
            value={roleId}
            onChange={handleRoleChange}
          >
            <option value={1}>Admin</option>
            <option value={2}>Librarian</option>
            <option value={3}>Student</option>
          </select>
        </div>
      )}

      <div className="form-row">

        <div className="form-group">
          <label htmlFor="firstName">
            First Name
          </label>

          <input
            id="firstName"
            type="text"
            placeholder="Enter first name"
            value={firstName}
            onChange={(event) =>
              setFirstName(event.target.value)
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">
            Last Name
          </label>

          <input
            id="lastName"
            type="text"
            placeholder="Enter last name"
            value={lastName}
            onChange={(event) =>
              setLastName(event.target.value)
            }
            required
          />
        </div>

      </div>

      <div className="form-group">
        <label htmlFor="username">Username</label>

        <div className="username-input-wrapper">
            <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter username"
            required
            />

            <span className="username-suffix">
            {suffix}
            </span>
        </div>

        <small>
            Enter only the username part. The library suffix will be added automatically.
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="email">
          Email Address
        </label>

        <input
          id="email"
          type="email"
          placeholder="Enter your personal email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          required
        />

        <small>
          This email must be unique and will be used
          for future communication.
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="phone">
          Phone Number
        </label>

        <input
          id="phone"
          type="tel"
          placeholder="Enter phone number"
          value={phone}
          onChange={(event) =>
            setPhone(event.target.value)
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">
          Password
        </label>

        <input
          id="password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          required
        />
      </div>

      <div className="username-preview">
        <strong>Library Username:</strong>
        <span>
          {getFinalUsername() || `yourname${suffix}`}
        </span>
      </div>

      {error && (
        <p className="register-error">
          {error}
        </p>
      )}

      {success && (
        <p className="register-success">
          {success}
        </p>
      )}

      <button
        type="submit"
        className="register-submit"
        disabled={loading}
      >
        {loading
          ? "Creating Account..."
          : "Create Account"}
      </button>

    </form>

    {!isAdmin && (
      <p className="register-footer">
        Already have an account?{" "}
        <span onClick={() => navigate("/")}>
          Login here
        </span>
      </p>
    )}

    {isAdmin && (
      <p className="register-footer">
        <span onClick={() => navigate("/admin")}>
          Back to Admin Dashboard
        </span>
      </p>
    )}

  </div>
</div>


);
}

export default Register;
