// ── TeacherHome.jsx ──────────────────────────────────────────────
const STATS = [
  { icon:"📋", label:"My Assignments",   value: 8,  color:"blue"   },
  { icon:"📝", label:"Active Exams",     value: 2,  color:"purple" },
  { icon:"📅", label:"Classes Today",    value: 4,  color:"green"  },
  { icon:"✏️", label:"Pending Grading",  value: 14, color:"amber"  },
];

const RECENT_SUBMISSIONS = [
  { student:"Rahul Sharma",  assignment:"Assignment 3 — DS",       time:"5 min ago",  status:"pending" },
  { student:"Priya Nair",    assignment:"Assignment 3 — DS",       time:"20 min ago", status:"pending" },
  { student:"Sneha Das",     assignment:"Assignment 2 — Algo",     time:"2h ago",     status:"graded"  },
  { student:"Amit Verma",    assignment:"Assignment 2 — Algo",     time:"3h ago",     status:"graded"  },
];

const UPCOMING_EXAMS = [
  { name:"DBMS Final",          date:"Mar 20", students:42, status:"upcoming" },
  { name:"OS Mid-Term",         date:"Mar 18", students:38, status:"active"   },
];

const TeacherHome = () => (
  <div>
    <h1 className="tch-page-title">Dashboard</h1>
    <p className="tch-page-sub">Good morning! Here's your teaching overview.</p>

    <div className="tch-stats">
      {STATS.map((s) => (
        <div className="tch-stat-card" key={s.label}>
          <div className={`tch-stat-icon ${s.color}`}>{s.icon}</div>
          <div className="tch-stat-value">{s.value}</div>
          <div className="tch-stat-label">{s.label}</div>
        </div>
      ))}
    </div>

    <div className="tch-grid-2">
      <div className="tch-panel">
        <div className="tch-panel-header">
          <span className="tch-panel-title">Recent Submissions</span>
        </div>
        <div className="tch-panel-body" style={{ padding: 0 }}>
          <table className="tch-table">
            <thead><tr><th>Student</th><th>Assignment</th><th>Time</th><th>Status</th></tr></thead>
            <tbody>
              {RECENT_SUBMISSIONS.map((r, i) => (
                <tr key={i}>
                  <td>{r.student}</td>
                  <td style={{ color:"var(--tch-muted)", fontSize:12 }}>{r.assignment}</td>
                  <td style={{ color:"var(--tch-muted)" }}>{r.time}</td>
                  <td><span className={`tch-badge ${r.status}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tch-panel">
        <div className="tch-panel-header">
          <span className="tch-panel-title">Upcoming Exams</span>
        </div>
        <div className="tch-panel-body" style={{ padding: 0 }}>
          <table className="tch-table">
            <thead><tr><th>Exam</th><th>Date</th><th>Students</th><th>Status</th></tr></thead>
            <tbody>
              {UPCOMING_EXAMS.map((e, i) => (
                <tr key={i}>
                  <td style={{ fontWeight:500 }}>{e.name}</td>
                  <td>{e.date}</td>
                  <td>{e.students}</td>
                  <td><span className={`tch-badge ${e.status}`}>{e.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default TeacherHome;