import { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// Teacher sub-pages — all imported here only
import TeacherHome       from "./TeacherHome";
import ManageAssignments from "./ManageAssignments";
import GradeSubmissions  from "./GradeSubmissions";
import ManageExams       from "./ManageExams";
import QuestionBank      from "./QuestionBank";
import MarkAttendance    from "./MarkAttendance";
import ClassReports      from "./ClassReports";



const NAV = [
  { path: "/teacher",             label: "Dashboard",    icon: "🏠" },
  { path: "/teacher/assignments", label: "Assignments",  icon: "📋" },
  { path: "/teacher/grade",       label: "Grade Work",   icon: "✏️" },
  { path: "/teacher/exams",       label: "Exams",        icon: "📝" },
  { path: "/teacher/questions",   label: "Question Bank",icon: "🗂️" },
  { path: "/teacher/attendance",  label: "Attendance",   icon: "📅" },
  { path: "/teacher/reports",     label: "Reports",      icon: "📊" },
];

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) =>
    path === "/teacher"
      ? location.pathname === "/teacher" || location.pathname === "/teacher/"
      : location.pathname.startsWith(path);

  return (
    <div className={`tch-shell${collapsed ? " tch-collapsed" : ""}`}>

      {/* Sidebar */}
      <aside className={`tch-sidebar${mobileOpen ? " tch-mobile-open" : ""}`}>
        <div className="tch-logo">
          <span className="tch-logo-icon">📚</span>
          {!collapsed && <span className="tch-logo-text">EduPortal</span>}
        </div>
        {!collapsed && <div className="tch-role-badge">Teacher</div>}

        <nav className="tch-nav">
          {NAV.map((item) => (
            <button
              key={item.path}
              className={`tch-nav-item${isActive(item.path) ? " active" : ""}`}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              title={collapsed ? item.label : ""}
            >
              <span className="tch-nav-icon">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="tch-sidebar-footer">
          <button className="tch-logout-btn" onClick={() => { logout(); navigate("/login"); }}>
            <span>🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:40 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="tch-main">
        <header className="tch-topbar">
          <div className="tch-topbar-left">
            <button className="tch-toggle-btn" onClick={() => setCollapsed((p) => !p)}>☰</button>
            <span className="tch-breadcrumb">
              {NAV.find((n) => isActive(n.path))?.label ?? "Dashboard"}
            </span>
          </div>
          <div className="tch-topbar-right">
            <div className="tch-user-chip">
              <div className="tch-user-avatar">{user?.name?.[0]?.toUpperCase() ?? "T"}</div>
              <div>
                <div className="tch-user-name">{user?.name ?? "Teacher"}</div>
                <div className="tch-user-role">Teacher</div>
              </div>
            </div>
          </div>
        </header>

        <main className="tch-content">
          <Routes>
            <Route index                     element={<TeacherHome />} />
            <Route path="assignments"        element={<ManageAssignments />} />
            <Route path="grade"              element={<GradeSubmissions />} />
            <Route path="exams"              element={<ManageExams />} />
            <Route path="questions"          element={<QuestionBank />} />
            <Route path="attendance"         element={<MarkAttendance />} />
            <Route path="reports"            element={<ClassReports />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;