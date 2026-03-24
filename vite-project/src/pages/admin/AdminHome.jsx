import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Mock data (replace with real API calls) ──────────────────────
const STATS = [
  { icon: "🎓", label: "Total Students", value: 1284, delta: "+12 this week", type: "up", color: "blue" },
  { icon: "📚", label: "Total Teachers", value: 86,   delta: "+2 this month",  type: "up", color: "green" },
  { icon: "🏛️", label: "Departments",    value: 9,    delta: "No change",      type: "",   color: "purple" },
  { icon: "📝", label: "Active Exams",   value: 4,    delta: "2 ending today", type: "down", color: "amber" },
  { icon: "📋", label: "Pending Approvals", value: 7, delta: "Needs action",   type: "down", color: "red" },
];

const RECENT_STUDENTS = [
  { name: "Rahul Sharma",  id: "STU-A1B2", dept: "Computer Science", status: "active" },
  { name: "Priya Nair",    id: "STU-C3D4", dept: "Electronics",      status: "active" },
  { name: "Amit Verma",    id: "STU-E5F6", dept: "Mechanical",        status: "pending" },
  { name: "Sneha Das",     id: "STU-G7H8", dept: "Civil",             status: "active" },
  { name: "Rohan Mehta",   id: "STU-I9J0", dept: "Computer Science", status: "pending" },
];

const RECENT_TEACHERS = [
  { name: "Dr. Suresh Kumar",  id: "TCH-T1U2", dept: "Computer Science", status: "active" },
  { name: "Prof. Anita Roy",   id: "TCH-V3W4", dept: "Mathematics",       status: "active" },
  { name: "Dr. Ramesh Pillai", id: "TCH-X5Y6", dept: "Electronics",       status: "pending" },
];

const STUDENT_ACTIVITY = [
  { msg: "Rahul Sharma submitted Assignment 3 — Data Structures", time: "5 min ago",  color: "green" },
  { msg: "Priya Nair started Exam: Operating Systems Mid-Term",   time: "12 min ago", color: "blue" },
  { msg: "Amit Verma viewed Marks for Semester 3",                time: "28 min ago", color: "purple" },
  { msg: "Sneha Das marked attendance for today",                  time: "1h ago",     color: "amber" },
  { msg: "Rohan Mehta registered — awaiting approval",            time: "2h ago",     color: "red" },
];

const TEACHER_ACTIVITY = [
  { msg: "Dr. Suresh Kumar created Exam: DBMS Final",             time: "15 min ago", color: "blue" },
  { msg: "Prof. Anita Roy graded 24 submissions",                  time: "40 min ago", color: "green" },
  { msg: "Dr. Ramesh Pillai marked attendance for CS-301",         time: "1h ago",     color: "purple" },
  { msg: "Prof. Anita Roy uploaded Assignment 4",                  time: "3h ago",     color: "amber" },
];

const PENDING_APPROVALS = [
  { name: "Amit Verma",  role: "student", dept: "Mechanical",  email: "amit@example.com" },
  { name: "Rohan Mehta", role: "student", dept: "CS",          email: "rohan@example.com" },
  { name: "Dr. Ramesh Pillai", role: "teacher", dept: "Electronics", email: "ramesh@example.com" },
];

// ── Component ────────────────────────────────────────────────────
const AdminHome = () => {
  const navigate = useNavigate();
  const [activityTab, setActivityTab] = useState("student");

  return (
    <div>
      <h1 className="adm-page-title">Dashboard</h1>
      <p className="adm-page-sub">Welcome back, Admin. Here's what's happening today.</p>

      {/* Stats */}
      <div className="adm-stats">
        {STATS.map((s) => (
          <div className="adm-stat-card" key={s.label}>
            <div className={`adm-stat-icon ${s.color}`}>{s.icon}</div>
            <div className="adm-stat-value">{s.value}</div>
            <div className="adm-stat-label">{s.label}</div>
            {s.delta && (
              <div className={`adm-stat-delta ${s.type}`}>{s.delta}</div>
            )}
          </div>
        ))}
      </div>

      {/* Activity + Pending */}
      <div className="adm-grid-2" style={{ marginBottom: 20 }}>

        {/* Live activity monitor */}
        <div className="adm-panel">
          <div className="adm-panel-header">
            <span className="adm-panel-title">Live Activity</span>
            <div style={{ display: "flex", gap: 8 }}>
              {["student", "teacher"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActivityTab(t)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 500,
                    fontFamily: "inherit",
                    background: activityTab === t ? "rgba(99,102,241,0.15)" : "transparent",
                    color: activityTab === t ? "#818cf8" : "#64748b",
                    transition: "all 0.15s",
                  }}
                >
                  {t === "student" ? "🎓 Students" : "📚 Teachers"}
                </button>
              ))}
            </div>
          </div>
          <div className="adm-panel-body">
            <div className="adm-activity-list">
              {(activityTab === "student" ? STUDENT_ACTIVITY : TEACHER_ACTIVITY).map((a, i) => (
                <div className="adm-activity-item" key={i}>
                  <div className={`adm-activity-dot ${a.color}`} />
                  <div>
                    <div className="adm-activity-msg">{a.msg}</div>
                    <div className="adm-activity-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending approvals */}
        <div className="adm-panel">
          <div className="adm-panel-header">
            <span className="adm-panel-title">Pending Approvals</span>
            <button
              className="adm-panel-action"
              onClick={() => navigate("/admin/users")}
            >
              View all →
            </button>
          </div>
          <div className="adm-panel-body">
            {PENDING_APPROVALS.map((u, i) => (
              <div className="adm-user-row" key={i}>
                <div className={`adm-user-row-avatar ${u.role === "student" ? "s" : "t"}`}>
                  {u.name[0]}
                </div>
                <div className="adm-user-row-info">
                  <div className="adm-user-row-name">{u.name}</div>
                  <div className="adm-user-row-meta">{u.dept} · {u.email}</div>
                </div>
                <span className={`adm-badge ${u.role}`}>{u.role}</span>
                <button
                  className="adm-btn primary"
                  style={{ padding: "5px 12px", fontSize: 12, marginLeft: 8 }}
                  onClick={() => navigate("/admin/id-generate")}
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent students + teachers */}
      <div className="adm-grid-2">

        <div className="adm-panel">
          <div className="adm-panel-header">
            <span className="adm-panel-title">Recent Students</span>
            <button className="adm-panel-action" onClick={() => navigate("/admin/users")}>
              View all →
            </button>
          </div>
          <div className="adm-panel-body" style={{ padding: "8px 20px" }}>
            {RECENT_STUDENTS.map((s, i) => (
              <div className="adm-user-row" key={i}>
                <div className="adm-user-row-avatar s">{s.name[0]}</div>
                <div className="adm-user-row-info">
                  <div className="adm-user-row-name">{s.name}</div>
                  <div className="adm-user-row-meta">{s.id} · {s.dept}</div>
                </div>
                <span className={`adm-badge ${s.status}`}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="adm-panel">
          <div className="adm-panel-header">
            <span className="adm-panel-title">Recent Teachers</span>
            <button className="adm-panel-action" onClick={() => navigate("/admin/users")}>
              View all →
            </button>
          </div>
          <div className="adm-panel-body" style={{ padding: "8px 20px" }}>
            {RECENT_TEACHERS.map((t, i) => (
              <div className="adm-user-row" key={i}>
                <div className="adm-user-row-avatar t">{t.name[0]}</div>
                <div className="adm-user-row-info">
                  <div className="adm-user-row-name">{t.name}</div>
                  <div className="adm-user-row-meta">{t.id} · {t.dept}</div>
                </div>
                <span className={`adm-badge ${t.status}`}>{t.status}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminHome;