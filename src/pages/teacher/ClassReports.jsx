import { useState } from "react";

const SUBJECTS = ["CS301", "CS401", "CS402"];

const REPORT_DATA = {
  CS301: {
    name: "Data Structures",
    avgMarks: 74,
    passRate: 88,
    attendance: 82,
    topStudents: [
      { name: "Priya Nair",  marks: 94 },
      { name: "Sneha Das",   marks: 91 },
      { name: "Rahul Sharma",marks: 87 },
    ],
    gradeBreakdown: [
      { grade: "O",  count: 5  },
      { grade: "A+", count: 8  },
      { grade: "A",  count: 12 },
      { grade: "B+", count: 9  },
      { grade: "B",  count: 5  },
      { grade: "F",  count: 3  },
    ],
  },
  CS401: {
    name: "Operating Systems",
    avgMarks: 68,
    passRate: 81,
    attendance: 78,
    topStudents: [
      { name: "Rahul Sharma", marks: 91 },
      { name: "Amit Verma",   marks: 85 },
      { name: "Rohan Mehta",  marks: 82 },
    ],
    gradeBreakdown: [
      { grade: "O",  count: 3  },
      { grade: "A+", count: 6  },
      { grade: "A",  count: 10 },
      { grade: "B+", count: 11 },
      { grade: "B",  count: 6  },
      { grade: "F",  count: 2  },
    ],
  },
  CS402: {
    name: "DBMS",
    avgMarks: 71,
    passRate: 85,
    attendance: 80,
    topStudents: [
      { name: "Sneha Das",    marks: 95 },
      { name: "Priya Nair",   marks: 88 },
      { name: "Rahul Sharma", marks: 84 },
    ],
    gradeBreakdown: [
      { grade: "O",  count: 6  },
      { grade: "A+", count: 9  },
      { grade: "A",  count: 11 },
      { grade: "B+", count: 8  },
      { grade: "B",  count: 4  },
      { grade: "F",  count: 2  },
    ],
  },
};

const GRADE_COLORS = {
  "O": "#10b981", "A+": "#22c55e", "A": "#84cc16",
  "B+": "#f59e0b", "B": "#fb923c", "F": "#ef4444",
};

const ClassReports = () => {
  const [subject, setSubject] = useState("CS301");
  const data = REPORT_DATA[subject];

  return (
    <div>
      <h1 className="tch-page-title">Class Reports</h1>
      <p className="tch-page-sub">Performance overview for your classes.</p>

      {/* Subject selector */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        {SUBJECTS.map((s) => (
          <button
            key={s}
            className={`tch-btn ${subject === s ? "primary" : "ghost"}`}
            onClick={() => setSubject(s)}
          >
            {s} — {REPORT_DATA[s].name}
          </button>
        ))}
      </div>

      {/* Summary stats */}
      <div className="tch-stats" style={{ marginBottom: 24 }}>
        {[
          { label: "Average Marks",  value: `${data.avgMarks}%`,  icon: "📊", color: "blue"   },
          { label: "Pass Rate",      value: `${data.passRate}%`,  icon: "✅",  color: "green"  },
          { label: "Avg Attendance", value: `${data.attendance}%`,icon: "📅",  color: "purple" },
        ].map((s) => (
          <div className="tch-stat-card" key={s.label}>
            <div className={`tch-stat-icon ${s.color}`}>{s.icon}</div>
            <div className="tch-stat-value">{s.value}</div>
            <div className="tch-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="tch-grid-2">

        {/* Grade breakdown */}
        <div className="tch-panel">
          <div className="tch-panel-header">
            <span className="tch-panel-title">Grade Distribution</span>
          </div>
          <div className="tch-panel-body">
            {data.gradeBreakdown.map((g) => {
              const max   = Math.max(...data.gradeBreakdown.map((x) => x.count));
              const width = Math.round((g.count / max) * 100);
              return (
                <div key={g.grade} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: GRADE_COLORS[g.grade] }}>
                      {g.grade}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--tch-muted)" }}>
                      {g.count} students
                    </span>
                  </div>
                  <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: `${width}%`,
                      background: GRADE_COLORS[g.grade],
                      borderRadius: 4,
                      transition: "width 0.4s ease",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top students */}
        <div className="tch-panel">
          <div className="tch-panel-header">
            <span className="tch-panel-title">Top Performers</span>
          </div>
          <div className="tch-panel-body">
            {data.topStudents.map((s, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 0",
                borderBottom: i < data.topStudents.length - 1 ? "1px solid var(--tch-border)" : "none",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: i === 0 ? "#fef3c7" : i === 1 ? "#f1f5f9" : "#fef3c7",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 14,
                  color: i === 0 ? "#92400e" : "#475569",
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{s.name}</div>
                </div>
                <div style={{
                  fontSize: 16, fontWeight: 700,
                  color: s.marks >= 90 ? "#10b981" : s.marks >= 75 ? "#0ea5e9" : "#f59e0b",
                }}>
                  {s.marks}%
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClassReports;