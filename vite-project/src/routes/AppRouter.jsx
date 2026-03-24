import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// Auth pages
import LoginPage         from "../pages/auth/LoginPage";
import RegisterPage      from "../pages/auth/RegisterPage";
import RequestAccessPage from "../pages/auth/RequestAccessPage";

// Dashboards
import AdminDashboard   from "../pages/admin/AdminDashboard";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import StudentDashboard from "../pages/student/StudentDashboard";

// Fallback pages
import NotFoundPage     from "../pages/shared/NotFoundPage";
import UnauthorizedPage from "../pages/shared/UnauthorizedPage";

// ── Guard ──────────────────────────────────────────────────────
const Guard = ({ children, role }) => {
  const { user } = useAuth(); // no loading needed — AuthContext handles it
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (role && user.role?.toUpperCase() !== role.toUpperCase()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// ── AppRouter ──────────────────────────────────────────────────
const AppRouter = () => (
  <BrowserRouter>
    <Routes>

      {/* Public */}
      <Route path="/"               element={<Navigate to="/login" replace />} />
      <Route path="/login"          element={<LoginPage />} />
      <Route path="/register"       element={<RegisterPage />} />
      <Route path="/request-access" element={<RequestAccessPage />} />

      {/* Admin */}
      <Route
        path="/admin/*"
        element={
          <Guard role="ADMIN">
            <AdminDashboard />
          </Guard>
        }
      />

      {/* Teacher */}
      <Route
        path="/teacher/*"
        element={
          <Guard role="TEACHER">
            <TeacherDashboard />
          </Guard>
        }
      />

      {/* Student */}
      <Route
        path="/student/*"
        element={
          <Guard role="STUDENT">
            <StudentDashboard />
          </Guard>
        }
      />

      {/* Fallbacks */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*"             element={<NotFoundPage />} />

    </Routes>
  </BrowserRouter>
);

export default AppRouter;