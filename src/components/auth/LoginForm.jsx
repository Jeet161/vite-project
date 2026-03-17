import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { adminLogin, userLogin } from "../../services/authService";
import { isValidEmail } from "../../utils/validators";

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
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.identifier.trim()) {
      e.identifier = role === "admin" ? "Email is required" : "Unique ID is required";
    } else if (role === "admin" && !isValidEmail(form.identifier)) {
      e.identifier = "Enter a valid email address";
    }
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: name === "identifier" && role !== "admin"
        ? value.toUpperCase()
        : value,
    }));
    setErrors((p) => ({ ...p, [name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setServerError("");
    try {
      let res;
      if (role === "admin") {
        res = await adminLogin(form.identifier, form.password);
      } else {
        res = await userLogin(form.identifier, form.password, role);
      }
      const { user, token } = res.data;
      login(user, token);
      navigate(
        role === "admin" ? "/admin"
        : role === "teacher" ? "/teacher"
        : "/student"
      );
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Login failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lf-wrapper">
      {/* Role Switcher */}
      <div className="lf-roles">
        {ROLES.map((r) => (
          <button
            key={r.id}
            type="button"
            className={`lf-role-btn ${role === r.id ? "active" : ""}`}
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
        {/* Identifier field */}
        <div className="lf-field">
          <label className="lf-label">
            {role === "admin"
              ? "Admin Email"
              : `${role === "student" ? "Student" : "Teacher"} ID`}
          </label>
          <input
            className={`lf-input ${errors.identifier ? "error" : ""}`}
            type={role === "admin" ? "email" : "text"}
            name="identifier"
            value={form.identifier}
            onChange={handleChange}
            placeholder={
              role === "admin" ? "admin@school.edu"
              : role === "student" ? "STU-XXXX"
              : "TCH-XXXX"
            }
            autoComplete="username"
          />
          {errors.identifier && (
            <span className="lf-error">{errors.identifier}</span>
          )}
          {role !== "admin" && (
            <p className="lf-hint">
              Your unique ID was sent to your email by the admin.
            </p>
          )}
        </div>

        {/* Password field */}
        <div className="lf-field">
          <label className="lf-label">Password</label>
          <div className="lf-input-wrap">
            <input
              className={`lf-input ${errors.password ? "error" : ""}`}
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="lf-eye-btn"
              onClick={() => setShowPassword((p) => !p)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.password && (
            <span className="lf-error">{errors.password}</span>
          )}
        </div>

        {serverError && (
          <div className="lf-server-error">{serverError}</div>
        )}

        <button type="submit" className="lf-submit" disabled={loading}>
          {loading ? <span className="lf-spinner" /> : "Sign In"}
        </button>

        {role !== "admin" && (
          <p className="lf-footer-note">
            New here?{" "}
            <a href="/register" className="lf-link">
              Register your account
            </a>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
