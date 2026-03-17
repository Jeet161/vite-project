import { useState } from "react";

const PENDING = [
  { name: "Amit Verma",        role: "student", dept: "Mechanical",  email: "amit@example.com",   applied: "2 hours ago" },
  { name: "Rohan Mehta",       role: "student", dept: "CS",          email: "rohan@example.com",  applied: "3 hours ago" },
  { name: "Dr. Ramesh Pillai", role: "teacher", dept: "Electronics", email: "ramesh@example.com", applied: "1 day ago" },
];

const genId = (role) => {
  const prefix = role === "student" ? "STU" : "TCH";
  const chars  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const suffix = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${prefix}-${suffix}`;
};

const genPass = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!";
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const IDGeneration = () => {
  const [generated, setGenerated] = useState({});
  const [sent, setSent]           = useState({});

  const handleGenerate = (idx, role) => {
    setGenerated((p) => ({
      ...p,
      [idx]: { id: genId(role), password: genPass() },
    }));
  };

  const handleSendEmail = (idx, user) => {
    // In real app: call API to send email via Gmail/nodemailer
    console.log("Sending to", user.email, generated[idx]);
    setSent((p) => ({ ...p, [idx]: true }));
  };

  return (
    <div>
      <h1 className="adm-page-title">ID Generation</h1>
      <p className="adm-page-sub">
        Generate unique IDs and passwords for approved users, then send via email.
      </p>

      <div className="adm-panel">
        <div className="adm-panel-header">
          <span className="adm-panel-title">Pending Registrations ({PENDING.length})</span>
        </div>
        <div className="adm-panel-body" style={{ padding: 0 }}>
          {PENDING.map((u, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                padding: "20px 24px",
                borderBottom: i < PENDING.length - 1 ? "1px solid var(--adm-border)" : "none",
                flexWrap: "wrap",
              }}
            >
              {/* User info */}
              <div className={`adm-user-row-avatar ${u.role === "student" ? "s" : "t"}`}
                   style={{ width: 42, height: 42, borderRadius: 10, fontSize: 15 }}>
                {u.name[0]}
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontWeight: 500, fontSize: 14, color: "var(--adm-text)" }}>{u.name}</div>
                <div style={{ fontSize: 12, color: "var(--adm-muted)", marginTop: 2 }}>
                  {u.dept} · {u.email}
                </div>
                <div style={{ fontSize: 11, color: "var(--adm-muted)", marginTop: 2 }}>
                  Applied {u.applied}
                </div>
                <span className={`adm-badge ${u.role}`} style={{ marginTop: 6, display: "inline-block" }}>
                  {u.role}
                </span>
              </div>

              {/* Generated credentials */}
              {generated[i] && (
                <div
                  style={{
                    background: "var(--adm-surface2)",
                    border: "1px solid var(--adm-border)",
                    borderRadius: 10,
                    padding: "10px 16px",
                    fontSize: 13,
                    minWidth: 220,
                  }}
                >
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: "var(--adm-muted)", fontSize: 11 }}>UNIQUE ID</span>
                    <div style={{ fontFamily: "monospace", color: "#818cf8", fontSize: 16, fontWeight: 700 }}>
                      {generated[i].id}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: "var(--adm-muted)", fontSize: 11 }}>PASSWORD</span>
                    <div style={{ fontFamily: "monospace", color: "var(--adm-green)", fontSize: 14 }}>
                      {generated[i].password}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 140 }}>
                {!generated[i] ? (
                  <button
                    className="adm-btn primary"
                    onClick={() => handleGenerate(i, u.role)}
                  >
                    🔑 Generate ID
                  </button>
                ) : sent[i] ? (
                  <div style={{
                    padding: "9px 18px",
                    borderRadius: 9,
                    background: "rgba(16,185,129,0.12)",
                    color: "var(--adm-green)",
                    fontSize: 13,
                    fontWeight: 500,
                    textAlign: "center",
                  }}>
                    ✅ Email Sent
                  </div>
                ) : (
                  <>
                    <button
                      className="adm-btn primary"
                      onClick={() => handleSendEmail(i, u)}
                    >
                      📧 Send via Email
                    </button>
                    <button
                      className="adm-btn ghost"
                      onClick={() => handleGenerate(i, u.role)}
                    >
                      ↻ Regenerate
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IDGeneration;