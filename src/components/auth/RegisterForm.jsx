import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerStudent, registerTeacher } from "../../services/authService";
import { isValidEmail, isValidPhone, isValidName } from "../../utils/validators";

const DEPARTMENTS = [
  "Computer Science", "Electronics", "Mechanical", "Civil",
  "Chemical", "Mathematics", "Physics", "Commerce", "Arts",
];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const INITIAL = {
  fullName: "", email: "", phone: "",
  department: "", rollNumber: "", year: "",
  employeeId: "", designation: "",
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const [role, setRole]               = useState("student");
  const [form, setForm]               = useState(INITIAL);
  const [errors, setErrors]           = useState({});
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!isValidName(form.fullName))  e.fullName   = "Enter a valid full name (min 2 chars)";
    if (!isValidEmail(form.email))    e.email      = "Enter a valid email address";
    if (!isValidPhone(form.phone))    e.phone      = "Enter a valid 10-digit mobile number";
    if (!form.department)             e.department = "Select your department";
    if (role === "student") {
      if (!form.rollNumber.trim()) e.rollNumber = "Roll number is required";
      if (!form.year)              e.year       = "Select your year";
    }
    if (role === "teacher") {
      if (!form.employeeId.trim())   e.employeeId   = "Employee ID is required";
      if (!form.designation.trim())  e.designation  = "Designation is required";
    }
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
      if (role === "student") {
        await registerStudent({
          fullName: form.fullName, email: form.email,
          phone: form.phone, department: form.department,
          rollNumber: form.rollNumber, year: form.year,
        });
      } else {
        await registerTeacher({
          fullName: form.fullName, email: form.email,
          phone: form.phone, department: form.department,
          employeeId: form.employeeId, designation: form.designation,
        });
      }
      setSuccess(true);
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rf-success">
        <div className="rf-success-icon">✅</div>
        <h3 className="rf-success-title">Registration Submitted!</h3>
        <p className="rf-success-msg">
          Your request has been received. The admin will review your application
          and send your <strong>Unique ID &amp; Password</strong> to{" "}
          <strong>{form.email}</strong> upon approval.
        </p>
        <button className="rf-btn-login" onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="rf-wrapper">
      {/* Role switcher */}
      <div className="rf-roles">
        {["student", "teacher"].map((r) => (
          <button
            key={r}
            type="button"
            className={`rf-role-btn ${role === r ? "active" : ""}`}
            onClick={() => { setRole(r); setErrors({}); setServerError(""); }}
          >
            {r === "student" ? "🎓 Student" : "📚 Teacher"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <Field label="Full Name" error={errors.fullName}>
          <input className={`rf-input ${errors.fullName ? "error" : ""}`}
            type="text" name="fullName" value={form.fullName}
            onChange={handleChange} placeholder="Your full name" />
        </Field>

        <Field label="Email Address" error={errors.email}>
          <input className={`rf-input ${errors.email ? "error" : ""}`}
            type="email" name="email" value={form.email}
            onChange={handleChange} placeholder="you@example.com" />
        </Field>

        <Field label="Mobile Number" error={errors.phone}>
          <input className={`rf-input ${errors.phone ? "error" : ""}`}
            type="tel" name="phone" value={form.phone}
            onChange={handleChange} placeholder="10-digit mobile number"
            maxLength={10} />
        </Field>

        <Field label="Department" error={errors.department}>
          <select className={`rf-input ${errors.department ? "error" : ""}`}
            name="department" value={form.department} onChange={handleChange}>
            <option value="">Select department</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>

        {role === "student" && (
          <>
            <Field label="Roll Number" error={errors.rollNumber}>
              <input className={`rf-input ${errors.rollNumber ? "error" : ""}`}
                type="text" name="rollNumber" value={form.rollNumber}
                onChange={handleChange} placeholder="e.g. 2023CS001" />
            </Field>
            <Field label="Year of Study" error={errors.year}>
              <select className={`rf-input ${errors.year ? "error" : ""}`}
                name="year" value={form.year} onChange={handleChange}>
                <option value="">Select year</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </Field>
          </>
        )}

        {role === "teacher" && (
          <>
            <Field label="Employee ID" error={errors.employeeId}>
              <input className={`rf-input ${errors.employeeId ? "error" : ""}`}
                type="text" name="employeeId" value={form.employeeId}
                onChange={handleChange} placeholder="e.g. EMP-2024-001" />
            </Field>
            <Field label="Designation" error={errors.designation}>
              <input className={`rf-input ${errors.designation ? "error" : ""}`}
                type="text" name="designation" value={form.designation}
                onChange={handleChange} placeholder="e.g. Assistant Professor" />
            </Field>
          </>
        )}

        {serverError && (
          <div className="rf-server-error">{serverError}</div>
        )}

        <button type="submit" className="rf-submit" disabled={loading}>
          {loading ? <span className="rf-spinner" /> : "Submit Registration"}
        </button>

        <p className="rf-footer-note">
          Already have an ID?{" "}
          <a href="/login" className="rf-link">Sign in here</a>
        </p>
      </form>
    </div>
  );
};

const Field = ({ label, error, children }) => (
  <div className="rf-field">
    <label className="rf-label">{label}</label>
    {children}
    {error && <span className="rf-error">{error}</span>}
  </div>
);

export default RegisterForm;
