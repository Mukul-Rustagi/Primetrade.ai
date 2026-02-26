import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getApiErrorMessage } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    adminInviteToken: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", form);
      setSession(response.data.data);
      navigate("/dashboard", { replace: true });
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="card auth-card">
        <h1>Register</h1>
        <p>Create your account and select a role.</p>
        <form className="auth-form" onSubmit={onSubmit}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            required
            value={form.name}
            onChange={onChange}
            placeholder="John Wick"
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            required
            value={form.email}
            onChange={onChange}
            placeholder="john@example.com"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            required
            value={form.password}
            onChange={onChange}
            placeholder="At least 8 chars with letters and numbers"
          />

          <label htmlFor="role">Role</label>
          <select id="role" name="role" value={form.role} onChange={onChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {form.role === "admin" ? (
            <>
              <label htmlFor="adminInviteToken">Admin Invite Token</label>
              <input
                id="adminInviteToken"
                type="text"
                name="adminInviteToken"
                required
                value={form.adminInviteToken}
                onChange={onChange}
                placeholder="Enter admin invite token"
              />
            </>
          ) : null}

          {error ? <p className="message error">{error}</p> : null}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
        <p className="auth-footer">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
};

export default RegisterPage;
