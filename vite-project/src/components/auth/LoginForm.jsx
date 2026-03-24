import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { loginUser } from "../../services/authService.js";

const ROLES = [
  { id: "student", label: "Student", icon: "🎓" },
  { id: "teacher", label: "Teacher", icon: "📚" },
  { id: "admin",   label: "Admin",   icon: "🛡️" },
];

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole]               = useState("student");
  const [form, setForm]               = useState({ identifier: "", password: "" });
  const [errors, setErrors]           = useState({});
  const [loading, setLoading]         = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPass, setShowPass]       = useState(false);

  const getPlaceholder = () => {
    if (role === "admin")   return "ADM-2024-001";
    if (role === "student") return "STD-2024-001";
    return "TCH-2024-001";
  };

  const getLabel = () => {
    if (role === "admin")   return "Admin ID";
    if (role === "student") return "Student ID";
    return "Teacher ID";
  };

  const validate = () => {
    const e = {};
    if (!form.identifier.trim()) {
      e.identifier = `${getLabel()} is required`;
    }
    if (!form.password)                e.password = "Password is required";
    else if (form.password.length < 3) e.password = "Minimum 3 characters";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: name === "identifier" ? value.toUpperCase() : value,
    }));
    setErrors((p)    => ({ ...p, [name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setServerError("");

    try {
      const res = await loginUser(form.identifier, form.password);
      const { user } = res.data;

      login(user);

      const r = user.role?.toUpperCase();
      if      (r === "ADMIN")   navigate("/admin");
      else if (r === "TEACHER") navigate("/teacher");
      else                      navigate("/student");

    } catch (err) {
      setServerError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lf-wrapper">

      {/* Role tabs */}
      <div className="lf-roles">
        {ROLES.map((r) => (
          <button
            key={r.id}
            type="button"
            className={`lf-role-btn${role === r.id ? " active" : ""}`}
            onClick={() => {
              setRole(r.id);
              setForm({ identifier: "", password: "" });
              setErrors({});
              setServerError("");
            }}
          >
            <span className="lf-role-icon">{r.icon}</span>
            <span>{r.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate>

        {/* Identifier */}
        <div className="lf-field">
          <label className="lf-label">{getLabel()}</label>
          <input
            className={`lf-input${errors.identifier ? " error" : ""}`}
            type="text"
            name="identifier"
            value={form.identifier}
            onChange={handleChange}
            placeholder={getPlaceholder()}
            autoComplete="username"
          />
          {errors.identifier && (
            <span className="lf-error">{errors.identifier}</span>
          )}
          <p className="lf-hint">
            {role === "admin"
              ? "Use your admin ID provided during setup."
              : "Your unique ID was sent to your email by the admin."}
          </p>
        </div>

        {/* Password */}
        <div className="lf-field">
          <label className="lf-label">Password</label>
          <div className="lf-input-wrap">
            <input
              className={`lf-input${errors.password ? " error" : ""}`}
              type={showPass ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="lf-eye-btn"
              onClick={() => setShowPass((p) => !p)}
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.password && (
            <span className="lf-error">{errors.password}</span>
          )}
        </div>

        {/* Server error message */}
        {serverError && (
          <div className="lf-server-error">{serverError}</div>
        )}

        {/* Submit button */}
        <button type="submit" className="lf-submit" disabled={loading}>
          {loading ? <span className="lf-spinner" /> : "Sign In"}
        </button>

        {/* Register link */}
        {role !== "admin" && (
          <p className="lf-footer-note">
            First time here?{" "}
            <a href="/request-access" className="lf-link">
              Request access
            </a>
          </p>
        )}

      </form>
    </div>
  );
};

export default LoginForm;