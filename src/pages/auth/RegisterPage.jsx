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
            Join the<br /><em>Community.</em>
          </h1>
          <p className="auth-sub">
            Register your account and wait for admin verification.
            Once approved, you'll receive your Unique ID and temporary
            password via email.
          </p>
          <div className="auth-steps">
            {[
              { step: "01", title: "Fill the form",     desc: "Submit your details for verification" },
              { step: "02", title: "Admin reviews",     desc: "Admin approves your application" },
              { step: "03", title: "Receive credentials", desc: "Get your ID & password by email" },
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
            <h2 className="auth-form-title">Create account</h2>
            <p className="auth-form-desc">Submit your details for admin approval</p>
          </div>
          <RegisterForm />
        </div>
      </div>

    </div>
  );
};

export default RegisterPage;
