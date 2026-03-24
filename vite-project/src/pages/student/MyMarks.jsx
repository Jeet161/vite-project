const SUBJECTS = [
  { name: "Data Structures",  code: "CS301", internal: 38, external: 62, total: 100, grade: "A+", credits: 4 },
  { name: "Operating Systems",code: "CS401", internal: 32, external: 54, total: 100, grade: "A",  credits: 4 },
  { name: "DBMS",             code: "CS402", internal: 35, external: 60, total: 100, grade: "A+", credits: 3 },
  { name: "Maths III",        code: "MA301", internal: 28, external: 52, total: 100, grade: "A",  credits: 4 },
  { name: "Physics Lab",      code: "PH201", internal: 45, external: 46, total: 100, grade: "O",  credits: 2 },
];

const GRADE_POINTS = { "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "D": 4, "F": 0 };
const GRADE_COLOR  = { "O": "#16a34a","A+": "#059669","A": "#0d9488","B+": "#d97706","B": "#ea580c","F": "#dc2626" };

const sgpa = () => {
  const totalPts  = SUBJECTS.reduce((sum, s) => sum + GRADE_POINTS[s.grade] * s.credits, 0);
  const totalCred = SUBJECTS.reduce((sum, s) => sum + s.credits, 0);
  return (totalPts / totalCred).toFixed(2);
};

const MyMarks = () => (
  <div>
    <h1 className="stu-page-title">My Marks</h1>
    <p className="stu-page-sub">Semester 4 performance overview.</p>

    {/* SGPA card */}
    <div style={{
      background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
      borderRadius: 16, padding: "24px 28px", marginBottom: 24,
      color: "#fff", display: "flex", alignItems: "center", gap: 20,
    }}>
      <div>
        <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 4 }}>Current SGPA — Semester 4</div>
        <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1 }}>{sgpa()}</div>
        <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>Out of 10.0</div>
      </div>
      <div style={{ marginLeft: "auto", textAlign: "right" }}>
        <div style={{ fontSize: 13, opacity: 0.85 }}>Total Credits</div>
        <div style={{ fontSize: 28, fontWeight: 700 }}>
          {SUBJECTS.reduce((s, x) => s + x.credits, 0)}
        </div>
      </div>
    </div>

    <div className="stu-panel">
      <table className="stu-table">
        <thead>
          <tr>
            <th>Subject</th><th>Code</th><th>Internal</th>
            <th>External</th><th>Total</th><th>Grade</th><th>Credits</th>
          </tr>
        </thead>
        <tbody>
          {SUBJECTS.map((s, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 500 }}>{s.name}</td>
              <td style={{ fontFamily: "monospace", fontSize: 12, color: "var(--stu-accent)" }}>{s.code}</td>
              <td>{s.internal}/40</td>
              <td>{s.external}/60</td>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>{s.total}</span>
                  <div style={{ flex: 1, maxWidth: 80 }}>
                    <div className="stu-progress-bar">
                      <div className="stu-progress-fill purple" style={{ width: `${s.total}%` }} />
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span style={{
                  fontWeight: 700, fontSize: 15,
                  color: GRADE_COLOR[s.grade] ?? "#64748b",
                }}>
                  {s.grade}
                </span>
              </td>
              <td>{s.credits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default MyMarks;