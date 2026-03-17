import LoginForm from "../../components/auth/LoginForm";
import "../../assets/auth.css";

const LoginPage = () => {
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
            Knowledge<br /><em>Unlocked.</em>
          </h1>
          <p className="auth-sub">
            A unified platform for students, teachers, and administrators —
            managing academics, attendance, and assessments in one place.
          </p>
          <div className="auth-features">
            {[
              { icon: "📊", text: "Live grade tracking" },
              { icon: "📅", text: "Attendance management" },
              { icon: "📝", text: "Online exams & assignments" },
            ].map((f) => (
              <div key={f.text} className="auth-feature-item">
                <span>{f.icon}</span>
                <span>{f.text}</span>
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
            <h2 className="auth-form-title">Welcome back</h2>
            <p className="auth-form-desc">Select your role and sign in to continue</p>
          </div>
          <LoginForm />
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
