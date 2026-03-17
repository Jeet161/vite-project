import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// Auth pages
import LoginPage    from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// Each dashboard is fully self-contained
import AdminDashboard   from "../pages/admin/AdminDashboard";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import StudentDashboard from "../pages/student/StudentDashboard";

// Shared fallback pages
import NotFoundPage      from "../pages/shared/NotFoundPage";
import UnauthorizedPage  from "../pages/shared/UnauthorizedPage";

const Guard = ({ children, role }) => {
  return children;
};

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Public */}
      <Route path="/"         element={<Navigate to="/login" replace />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin — self-contained, handles its own sub-routes internally */}
      <Route
        path="/admin/*"
        element={
          <Guard role="admin">
            <AdminDashboard />
          </Guard>
        }
      />

      {/* Teacher — self-contained */}
      <Route
        path="/teacher/*"
        element={
          <Guard role="teacher">
            <TeacherDashboard />
          </Guard>
        }
      />

      {/* Student — self-contained */}
      <Route
        path="/student/*"
        element={
          <Guard role="student">
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