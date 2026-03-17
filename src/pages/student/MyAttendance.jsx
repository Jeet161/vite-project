const ATTENDANCE = [
  { subject: "Data Structures",   code: "CS301", conducted: 40, attended: 36, pct: 90 },
  { subject: "Operating Systems", code: "CS401", conducted: 38, attended: 30, pct: 79 },
  { subject: "DBMS",              code: "CS402", conducted: 35, attended: 29, pct: 83 },
  { subject: "Maths III",         code: "MA301", conducted: 42, attended: 32, pct: 76 },
  { subject: "Physics Lab",       code: "PH201", conducted: 20, attended: 19, pct: 95 },
];

const overall = Math.round(
  ATTENDANCE.reduce((s, a) => s + a.pct, 0) / ATTENDANCE.length
);

const getColor = (pct) => {
  if (pct >= 85) return { bar: "green",  text: "#16a34a", bg: "#dcfce7", label: "Good" };
  if (pct >= 75) return { bar: "amber",  text: "#d97706", bg: "#fef3c7", label: "Low" };
  return               { bar: "red",    text: "#dc2626", bg: "#fee2e2", label: "Critical" };
};

const MyAttendance = () => (
  <div>
    <h1 className="stu-page-title">My Attendance</h1>
    <p className="stu-page-sub">Track your attendance across all subjects.</p>

    {/* Overall */}
    <div style={{
      background: overall >= 85 ? "linear-gradient(135deg, #16a34a, #4ade80)"
                : overall >= 75 ? "linear-gradient(135deg, #d97706, #fbbf24)"
                :                 "linear-gradient(135deg, #dc2626, #f87171)",
      borderRadius: 16, padding: "24px 28px", marginBottom: 24,
      color: "#fff", display: "flex", alignItems: "center", gap: 20,
    }}>
      <div>
        <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 4 }}>Overall Attendance</div>
        <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1 }}>{overall}%</div>
        <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
          {overall >= 85 ? "✅ You're on track" : overall >= 75 ? "⚠️ Attendance is low" : "🚨 Critical — attend classes"}
        </div>
      </div>
      <div style={{ marginLeft: "auto", textAlign: "right" }}>
        <div style={{ fontSize: 13, opacity: 0.85 }}>Min Required</div>
        <div style={{ fontSize: 28, fontWeight: 700 }}>75%</div>
      </div>
    </div>

    <div className="stu-panel">
      <table className="stu-table">
        <thead>
          <tr>
            <th>Subject</th><th>Code</th><th>Conducted</th>
            <th>Attended</th><th>Attendance</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {ATTENDANCE.map((a, i) => {
            const c = getColor(a.pct);
            return (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{a.subject}</td>
                <td style={{ fontFamily: "monospace", fontSize: 12, color: "var(--stu-accent)" }}>{a.code}</td>
                <td>{a.conducted}</td>
                <td>{a.attended}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 600, minWidth: 36 }}>{a.pct}%</span>
                    <div style={{ flex: 1, maxWidth: 100 }}>
                      <div className="stu-progress-bar">
                        <div className={`stu-progress-fill ${c.bar}`} style={{ width: `${a.pct}%` }} />
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "3px 9px",
                    borderRadius: 6, background: c.bg, color: c.text,
                    textTransform: "uppercase", letterSpacing: "0.04em",
                  }}>
                    {c.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default MyAttendance;