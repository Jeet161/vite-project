import { useState } from "react";

// ── GradeSubmissions ─────────────────────────────────────────────
const SUBS = [
  { student:"Rahul Sharma",  id:"STU-A1B2", assignment:"Assignment 3 — DS", submitted:"Mar 17", marks:null },
  { student:"Priya Nair",    id:"STU-C3D4", assignment:"Assignment 3 — DS", submitted:"Mar 17", marks:null },
  { student:"Sneha Das",     id:"STU-G7H8", assignment:"Assignment 2",      submitted:"Mar 10", marks:85   },
  { student:"Amit Verma",    id:"STU-E5F6", assignment:"Assignment 2",      submitted:"Mar 10", marks:72   },
];

export const GradeSubmissions = () => {
  const [subs, setSubs] = useState(SUBS);

  const handleGrade = (i, val) => {
    setSubs((p) => p.map((s, idx) => idx === i ? { ...s, marks: Number(val) } : s));
  };

  return (
    <div>
      <h1 className="tch-page-title">Grade Submissions</h1>
      <p className="tch-page-sub">Review and grade student work.</p>
      <div className="tch-panel">
        <table className="tch-table">
          <thead><tr><th>Student</th><th>ID</th><th>Assignment</th><th>Submitted</th><th>Marks (/100)</th><th>Status</th></tr></thead>
          <tbody>
            {subs.map((s, i) => (
              <tr key={i}>
                <td style={{ fontWeight:500 }}>{s.student}</td>
                <td style={{ fontFamily:"monospace", fontSize:12 }}>{s.id}</td>
                <td style={{ color:"var(--tch-muted)", fontSize:13 }}>{s.assignment}</td>
                <td>{s.submitted}</td>
                <td>
                  <input
                    type="number" min={0} max={100}
                    className="tch-input" style={{ maxWidth:80 }}
                    value={s.marks ?? ""}
                    placeholder="—"
                    onChange={(e) => handleGrade(i, e.target.value)}
                  />
                </td>
                <td>
                  <span className={`tch-badge ${s.marks !== null ? "graded" : "pending"}`}>
                    {s.marks !== null ? "graded" : "pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default GradeSubmissions;