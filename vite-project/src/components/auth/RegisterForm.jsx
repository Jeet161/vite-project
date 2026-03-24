import { useState } from "react";
import { submitRegistrationRequest } from "../../services/authService.js";

const DEPARTMENTS = ["CSE", "ECE", "EE", "ME", "CE", "IT", "CHE", "BT", "AE", "MME"];
const ROLES = [
  { id: "STUDENT", label: "Student", icon: "🎓" },
  { id: "TEACHER", label: "Teacher", icon: "📚" },
];

const RegisterForm = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    role: "STUDENT",
  });

  const [errors, setErrors]           = useState({});
  const [loading, setLoading]         = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess]         = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())    e.fullName    = "Full name is required";
    if (!form.email.trim())       e.email       = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.department)         e.department  = "Please select a department";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
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
      await submitRegistrationRequest(form);
      setSuccess(true);
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="rf-wrapper">
        <div style={{
          textAlign: "center", padding: "40px 20px",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h3 style={{ marginBottom: 8 }}>Request Submitted!</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
            Your registration request has been sent to the admin.
            Once approved, your Unique ID and password will be sent to your email.
          </p>
          <a href="/login" className="rf-link">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="rf-wrapper">

      {/* Role selector */}
      <div className="rf-roles">
        {ROLES.map((r) => (
          <button
            key={r.id}
            type="button"
            className={`rf-role-btn${form.role === r.id ? " active" : ""}`}
            onClick={() => {
              setForm((p) => ({ ...p, role: r.id }));
              setErrors({});
              setServerError("");
            }}
          >
            <span>{r.icon}</span>
            <span>{r.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate>

        {/* Full Name */}
        <div className="rf-field">
          <label className="rf-label">Full Name *</label>
          <input
            className={`rf-input${errors.fullName ? " error" : ""}`}
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
          {errors.fullName && <span className="rf-error">{errors.fullName}</span>}
        </div>

        {/* Email */}
        <div className="rf-field">
          <label className="rf-label">Email Address *</label>
          <input
            className={`rf-input${errors.email ? " error" : ""}`}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Gmail address"
          />
          {errors.email && <span className="rf-error">{errors.email}</span>}
          <p className="rf-hint">Your credentials will be sent to this email.</p>
        </div>

        {/* Phone */}
        <div className="rf-field">
          <label className="rf-label">Phone Number (optional)</label>
          <input
            className="rf-input"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            maxLength={10}
          />
        </div>

        {/* Department */}
        <div className="rf-field">
          <label className="rf-label">Department *</label>
          <select
            className={`rf-input${errors.department ? " error" : ""}`}
            name="department"
            value={form.department}
            onChange={handleChange}
          >
            <option value="">Select department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.department && <span className="rf-error">{errors.department}</span>}
        </div>

        {/* Server error */}
        {serverError && (
          <div className="rf-server-error">{serverError}</div>
        )}

        {/* Submit */}
        <button type="submit" className="rf-submit" disabled={loading}>
          {loading ? <span className="rf-spinner" /> : "Submit Request →"}
        </button>

        <p className="rf-footer-note">
          Already have credentials?{" "}
          <a href="/login" className="rf-link">Sign in here</a>
        </p>

      </form>
    </div>
  );
};

export default RegisterForm;