import { useState } from "react";
import { Link } from "react-router-dom";
import { submitRegistrationRequest } from "../../services/authService";

const ROLES = [
  { id: "TEACHER", label: "Teacher", icon: "📚", desc: "I teach courses at the institution" },
  { id: "STUDENT", label: "Student", icon: "🎓", desc: "I'm enrolled or want to enroll" },
];

const RequestAccessPage = () => {
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
  const [submitted, setSubmitted]     = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2)
      e.fullName = "Please enter your full name (at least 2 characters).";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Please enter a valid email address.";
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\s/g, "")))
      e.phone  = "Phone must be 10 digits.";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setServerError("");
    try {
      await submitRegistrationRequest(form);
      setSubmitted(true);
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="auth-page">
        <div className="auth-brand">
          <div className="auth-brand-inner">
            <div className="auth-logo">
              <div className="auth-logo-icon">⬡</div>
              <span className="auth-logo-text">EduPortal</span>
            </div>
            <h1 className="auth-tagline">Request<br /><em>Sent!</em></h1>
            <p className="auth-sub">Your registration request has been submitted to the administrator for review.</p>
            <div className="auth-decor-circle c1" />
            <div className="auth-decor-circle c2" />
            <div className="auth-decor-circle c3" />
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-form-container">
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
              <h2 style={{ color: "var(--text-primary)", fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
                Request Received!
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                We've sent a confirmation to <strong style={{ color: "var(--accent)" }}>{form.email}</strong>.
                Once the admin approves your request, you'll receive your <strong>Unique ID</strong> and{" "}
                <strong>temporary password</strong> via email.
              </p>
              <div style={{
                background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.2)",
                borderRadius: 12, padding: "20px 24px", marginBottom: 28, textAlign: "left"
              }}>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  <strong style={{ color: "var(--accent)" }}>Next steps:</strong><br />
                  1. Check your inbox for a confirmation email.<br />
                  2. Wait for the admin to approve your request.<br />
                  3. You'll receive your credentials by email.<br />
                  4. Visit <Link to="/register" style={{ color: "var(--accent)" }}>/register</Link> to activate your account.
                </p>
              </div>
              <Link to="/login" className="rf-submit" style={{ display: "inline-block", textDecoration: "none", padding: "12px 28px" }}>
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Form screen ───────────────────────────────────────────────
  return (
    <div className="auth-page">

      {/* ── Left branding panel ── */}
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <div className="auth-logo">
            <div className="auth-logo-icon">⬡</div>
            <span className="auth-logo-text">EduPortal</span>
          </div>
          <h1 className="auth-tagline">
            Request<br /><em>Access.</em>
          </h1>
          <p className="auth-sub">
            Don't have an account yet? Submit your details — the admin will
            review and email you a unique ID + temporary password to get started.
          </p>
          <div className="auth-steps">
            {[
              { step: "01", title: "Submit your info",    desc: "Fill in your name, email & department" },
              { step: "02", title: "Admin reviews",       desc: "Admin approves & generates your ID" },
              { step: "03", title: "Get credentials",     desc: "Your ID & password arrive by email" },
              { step: "04", title: "Activate & login",    desc: "Set your password at /register" },
            ].map((s) => (
              <div key={s.step} className="auth-step-item">
                <span className="auth-step-num">{s.step}</span>
                <div>
                  <p className="auth-step-title">{s.title}</p>
                  <p className="auth-step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="auth-decor-circle c1" />
          <div className="auth-decor-circle c2" />
          <div className="auth-decor-circle c3" />
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Request Access</h2>
            <p className="auth-form-desc">Fill in your details to send a request to the admin</p>
          </div>

          {/* Role chooser */}
          <div className="rf-roles" style={{ marginBottom: 24 }}>
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                className={`rf-role-btn${form.role === r.id ? " active" : ""}`}
                onClick={() => setForm((p) => ({ ...p, role: r.id }))}
              >
                <span>{r.icon}</span> {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* Full Name */}
            <div className="rf-field">
              <label className="rf-label">Full Name *</label>
              <input
                className={`rf-input${errors.fullName ? " error" : ""}`}
                type="text" name="fullName" value={form.fullName}
                onChange={handleChange} placeholder="Your full name"
              />
              {errors.fullName && <span className="rf-error">{errors.fullName}</span>}
            </div>

            {/* Email */}
            <div className="rf-field">
              <label className="rf-label">Email Address *</label>
              <input
                className={`rf-input${errors.email ? " error" : ""}`}
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com"
              />
              {errors.email && <span className="rf-error">{errors.email}</span>}
              <p className="lf-hint">Your credentials will be sent to this email — make sure it's correct!</p>
            </div>

            {/* Phone */}
            <div className="rf-field">
              <label className="rf-label">Phone Number (optional)</label>
              <input
                className={`rf-input${errors.phone ? " error" : ""}`}
                type="tel" name="phone" value={form.phone}
                onChange={handleChange} placeholder="10-digit mobile number"
                maxLength={10}
              />
              {errors.phone && <span className="rf-error">{errors.phone}</span>}
            </div>

            {/* Department */}
            <div className="rf-field">
              <label className="rf-label">Department (optional)</label>
              <input
                className="rf-input"
                type="text" name="department" value={form.department}
                onChange={handleChange} placeholder="e.g. Computer Science, Mathematics"
              />
            </div>

            {serverError && <div className="rf-server-error">{serverError}</div>}

            <button type="submit" className="rf-submit" disabled={loading}>
              {loading ? <span className="rf-spinner" /> : "Submit Request →"}
            </button>

            <p className="rf-footer-note">
              Already have credentials?{" "}
              <Link to="/register" className="rf-link">Activate your account</Link>
              {" · "}
              <Link to="/login" className="rf-link">Sign in</Link>
            </p>
          </form>
        </div>
      </div>

    </div>
  );
};

export default RequestAccessPage;
