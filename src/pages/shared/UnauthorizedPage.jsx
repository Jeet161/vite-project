import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "100vh",
      fontFamily: "Outfit, DM Sans, sans-serif", background: "#fafaf9",
      gap: 16, textAlign: "center", padding: 24,
    }}>
      <div style={{ fontSize: 72, lineHeight: 1 }}>🚫</div>
      <h1 style={{ fontSize: 48, fontWeight: 700, color: "#1c1917" }}>403</h1>
      <p style={{ fontSize: 18, color: "#78716c", maxWidth: 360 }}>
        You don't have permission to access this page.
      </p>
      <button
        onClick={() => navigate("/login")}
        style={{
          marginTop: 8, padding: "11px 28px", background: "#7c3aed",
          color: "#fff", border: "none", borderRadius: 10,
          fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}
      >
        Back to Login
      </button>
    </div>
  );
};

export default UnauthorizedPage;