import { useNavigate } from "react-router-dom";

const STATS = [
  { icon: "📋", label: "Assignments Due",    value: 3,      sub: "2 this week",     color: "amber"  },
  { icon: "📝", label: "Upcoming Exams",     value: 2,      sub: "Next: Mar 18",    color: "purple" },
  { icon: "📊", label: "Current SGPA",       value: "8.4",  sub: "Semester 4",      color: "green"  },
  { icon: "📅", label: "Attendance",         value: "84%",  sub: "This semester",   color: "blue"   },
];

const UPCOMING_ASSIGNMENTS = [
  { title: "Assignment 3 — Data Structures", subject: "CS301", due: "Mar 20", status: "pending"   },
  { title: "Lab Report 2 — OS",              subject: "CS401", due: "Mar 22", status: "pending"   },
  { title: "Assignment 2 — DBMS",            subject: "CS402", due: "Mar 10", status: "submitted" },
];

const UPCOMING_EXAMS = [
  { name: "OS Mid-Term",  subject: "CS401", date: "Mar 18", time: "10:00 AM", duration: "90 min" },
  { name: "DBMS Final",   subject: "CS402", date: "Mar 20", time: "2:00 PM",  duration: "120 min" },
];

const RECENT_MARKS = [
  { subject: "Data Structures", code: "CS301", marks: 87, total: 100, grade: "A+" },
  { subject: "Maths III",       code: "MA301", marks: 74, total: 100, grade: "A"  },
  { subject: "Physics Lab",     code: "PH201", marks: 91, total: 100, grade: "O"  },
];

const GRADE_COLOR = {
  "O": "#16a34a", "A+": "#059669", "A": "#0d9488",
  "B+": "#d97706", "B": "#ea580c", "F": "#dc2626",
};

const StudentHome = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="stu-page-title">My Dashboard</h1>
      <p className="stu-page-sub">Here's your academic overview for today.</p>

      {/* Stats */}
      <div className="stu-stats">
        {STATS.map((s) => (
          <div className="stu-stat-card" key={s.label}>
            <div className={`stu-stat-icon ${s.color}`}>{s.icon}</div>
            <div className="stu-stat-value">{s.value}</div>
            <div className="stu-stat-label">{s.label}</div>
            <div className="stu-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="stu-grid-2">

        {/* Upcoming assignments */}
        <div className="stu-panel">
          <div className="stu-panel-header">
            <span className="stu-panel-title">Upcoming Assignments</span>
            <button
              className="stu-panel-action"
              onClick={() => navigate("/student/assignments")}
            >
              View all →
            </button>
          </div>
          <div className="stu-panel-body" style={{ padding: 0 }}>
            <table className="stu-table">
              <thead>
                <tr><th>Title</th><th>Subject</th><th>Due</th><th>Status</th></tr>
              </thead>
              <tbody>
                {UPCOMING_ASSIGNMENTS.map((a, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500, maxWidth: 180 }}>{a.title}</td>
                    <td>
                      <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--stu-accent)" }}>
                        {a.subject}
                      </span>
                    </td>
                    <td style={{ color: "var(--stu-muted)" }}>{a.due}</td>
                    <td><span className={`stu-badge ${a.status}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming exams */}
        <div className="stu-panel">
          <div className="stu-panel-header">
            <span className="stu-panel-title">Upcoming Exams</span>
            <button
              className="stu-panel-action"
              onClick={() => navigate("/student/exams")}
            >
              View all →
            </button>
          </div>
          <div className="stu-panel-body">
            {UPCOMING_EXAMS.map((e, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "12px 0",
                borderBottom: i < UPCOMING_EXAMS.length - 1 ? "1px solid var(--stu-border)" : "none",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: "#ede9fe",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 20, flexShrink: 0,
                }}>
                  📝
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{e.name}</div>
                  <div style={{ fontSize: 12, color: "var(--stu-muted)", marginTop: 2 }}>
                    {e.subject} · {e.date} · {e.time}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "var(--stu-accent)", fontWeight: 500 }}>
                  {e.duration}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent marks */}
      <div className="stu-panel">
        <div className="stu-panel-header">
          <span className="stu-panel-title">Recent Marks</span>
          <button className="stu-panel-action" onClick={() => navigate("/student/marks")}>
            View all →
          </button>
        </div>
        <div className="stu-panel-body" style={{ padding: 0 }}>
          <table className="stu-table">
            <thead>
              <tr><th>Subject</th><th>Code</th><th>Marks</th><th>Grade</th></tr>
            </thead>
            <tbody>
              {RECENT_MARKS.map((m, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{m.subject}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12, color: "var(--stu-accent)" }}>
                    {m.code}
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontWeight: 600 }}>{m.marks}/{m.total}</span>
                      <div style={{ flex: 1, maxWidth: 100 }}>
                        <div className="stu-progress-bar">
                          <div
                            className="stu-progress-fill purple"
                            style={{ width: `${m.marks}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontWeight: 700, fontSize: 14,
                      color: GRADE_COLOR[m.grade] ?? "#64748b",
                    }}>
                      {m.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;