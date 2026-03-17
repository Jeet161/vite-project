import { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// Admin sub-pages (all imported here, nowhere else)
import AdminHome        from "./AdminHome";
import UserManagement   from "./UserManagement";
import IDGeneration     from "./IDGeneration";
import DepartmentSetup  from "./DepartmentSetup";
import SubjectSetup     from "./SubjectSetup";
import GradingPolicies  from "./GradingPolicies";
import SystemHealth     from "./SystemHealth";

// Admin-only CSS
import "./admin.css";

const NAV_ITEMS = [
  { path: "/admin",             label: "Dashboard",    icon: "⬡" },
  { path: "/admin/users",       label: "Users",        icon: "👥" },
  { path: "/admin/id-generate", label: "ID Generator", icon: "🔑" },
  { path: "/admin/departments",  label: "Departments",  icon: "🏛️" },
  { path: "/admin/subjects",    label: "Subjects",     icon: "📖" },
  { path: "/admin/grading",     label: "Grading",      icon: "📊" },
  { path: "/admin/health",      label: "System",       icon: "🖥️" },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  const isActive = (path) =>
    path === "/admin"
      ? location.pathname === "/admin" || location.pathname === "/admin/"
      : location.pathname.startsWith(path);

  return (
    <div className={`adm-shell${collapsed ? " adm-collapsed" : ""}`}>

      {/* ── Sidebar ── */}
      <aside className={`adm-sidebar${mobileOpen ? " adm-mobile-open" : ""}`}>
        <div className="adm-logo">
          <span className="adm-logo-icon">⬡</span>
          {!collapsed && <span className="adm-logo-text">EduPortal</span>}
        </div>

        <div className="adm-role-badge">
          {!collapsed && <span>Admin Panel</span>}
        </div>

        <nav className="adm-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              className={`adm-nav-item${isActive(item.path) ? " active" : ""}`}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              title={collapsed ? item.label : ""}
            >
              <span className="adm-nav-icon">{item.icon}</span>
              {!collapsed && <span className="adm-nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <button className="adm-logout-btn" onClick={handleLogout}>
            <span>🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="adm-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Main area ── */}
      <div className="adm-main">

        {/* Topbar */}
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <button
              className="adm-collapse-btn"
              onClick={() => { setCollapsed((p) => !p); setMobileOpen(false); }}
            >
              ☰
            </button>
            <button
              className="adm-mobile-btn"
              onClick={() => setMobileOpen((p) => !p)}
            >
              ☰
            </button>
            <div className="adm-breadcrumb">
              {NAV_ITEMS.find((n) => isActive(n.path))?.label ?? "Dashboard"}
            </div>
          </div>
          <div className="adm-topbar-right">
            <div className="adm-user-chip">
              <div className="adm-user-avatar">
                {user?.name?.[0]?.toUpperCase() ?? "A"}
              </div>
              <div className="adm-user-info">
                <span className="adm-user-name">{user?.name ?? "Admin"}</span>
                <span className="adm-user-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="adm-content">
          <Routes>
            <Route index                  element={<AdminHome />} />
            <Route path="users"           element={<UserManagement />} />
            <Route path="id-generate"     element={<IDGeneration />} />
            <Route path="departments"     element={<DepartmentSetup />} />
            <Route path="subjects"        element={<SubjectSetup />} />
            <Route path="grading"         element={<GradingPolicies />} />
            <Route path="health"          element={<SystemHealth />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;