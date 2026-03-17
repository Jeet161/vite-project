import { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// Student sub-pages — all imported here only
import StudentHome   from "./StudentHome";
import MyAssignments from "./MyAssignments";
import MyExams       from "./MyExams";
import MyMarks       from "./MyMarks";
import MyAttendance  from "./MyAttendance";
import MyProfile     from "./MyProfile";

import "./student.css";

const NAV = [
  { path: "/student",             label: "Dashboard",   icon: "🏠" },
  { path: "/student/assignments", label: "Assignments", icon: "📋" },
  { path: "/student/exams",       label: "Exams",       icon: "📝" },
  { path: "/student/marks",       label: "My Marks",    icon: "📊" },
  { path: "/student/attendance",  label: "Attendance",  icon: "📅" },
  { path: "/student/profile",     label: "My Profile",  icon: "👤" },
];

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) =>
    path === "/student"
      ? location.pathname === "/student" || location.pathname === "/student/"
      : location.pathname.startsWith(path);

  return (
    <div className={`stu-shell${collapsed ? " stu-collapsed" : ""}`}>

      {/* ── Sidebar ── */}
      <aside className={`stu-sidebar${mobileOpen ? " stu-mobile-open" : ""}`}>
        <div className="stu-logo">
          <span className="stu-logo-icon">🎓</span>
          {!collapsed && <span className="stu-logo-text">EduPortal</span>}
        </div>
        {!collapsed && <div className="stu-role-badge">Student</div>}

        <nav className="stu-nav">
          {NAV.map((item) => (
            <button
              key={item.path}
              className={`stu-nav-item${isActive(item.path) ? " active" : ""}`}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              title={collapsed ? item.label : ""}
            >
              <span className="stu-nav-icon">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="stu-sidebar-footer">
          <button
            className="stu-logout-btn"
            onClick={() => { logout(); navigate("/login"); }}
          >
            <span>🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 40 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Main ── */}
      <div className="stu-main">
        {/* Topbar */}
        <header className="stu-topbar">
          <div className="stu-topbar-left">
            <button className="stu-toggle-btn" onClick={() => setCollapsed((p) => !p)}>
              ☰
            </button>
            <span className="stu-breadcrumb">
              {NAV.find((n) => isActive(n.path))?.label ?? "Dashboard"}
            </span>
          </div>
          <div className="stu-topbar-right">
            <div className="stu-user-chip">
              <div className="stu-user-avatar">
                {user?.name?.[0]?.toUpperCase() ?? "S"}
              </div>
              <div>
                <div className="stu-user-name">{user?.name ?? "Student"}</div>
                <div className="stu-user-role">
                  {user?.uniqueId ?? "STU-XXXX"}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Pages */}
        <main className="stu-content">
          <Routes>
            <Route index                    element={<StudentHome />} />
            <Route path="assignments"       element={<MyAssignments />} />
            <Route path="exams"             element={<MyExams />} />
            <Route path="marks"             element={<MyMarks />} />
            <Route path="attendance"        element={<MyAttendance />} />
            <Route path="profile"           element={<MyProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;