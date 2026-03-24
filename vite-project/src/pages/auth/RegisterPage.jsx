import RegisterForm from "../../components/auth/RegisterForm";

const RegisterPage = () => {
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
            Don't have an account yet? Submit your details —
            the admin will review and email you a unique ID +
            temporary password to get started.
          </p>
          <div className="auth-steps">
            {[
              { step: "01", title: "Submit your info",      desc: "Fill in your name, email & department" },
              { step: "02", title: "Admin reviews",         desc: "Admin approves & generates your ID" },
              { step: "03", title: "Get credentials",       desc: "Your ID & password arrive by email" },
              { step: "04", title: "Activate & login",      desc: "Sign in with your credentials" },
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
            <p className="auth-form-desc">
              Fill in your details to send a request to the admin
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>

    </div>
  );
};

export default RegisterPage;