import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Get approved registration requests as the user list
      const res = await api.get("/admin/users");
      const users = res.data.users || [];
      setUsers(users);
    } catch (err) {
      showToast("❌ Failed to load users: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter((u) => {
    const name = u.name || "";
    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase());
    const matchRole =
      roleFilter === "all" || u.role?.toLowerCase() === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div>
      <h1 className="adm-page-title">User Management</h1>
      <p className="adm-page-sub">
        All approved students and teachers are listed here. Manage accounts through the{" "}
        <strong>Registration Requests</strong> page.
      </p>

      {toast && (
        <div style={{
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 10, padding: "12px 20px", marginBottom: 20, fontSize: 14, color: "#e2e8f0",
        }}>
          {toast}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input
          className="adm-input"
          style={{ maxWidth: 260 }}
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {[["all", "All Roles"], ["student", "Students"], ["teacher", "Teachers"]].map(([v, l]) => (
          <button
            key={v}
            className={`adm-btn ${roleFilter === v ? "primary" : "ghost"}`}
            onClick={() => setRoleFilter(v)}
          >{l}</button>
        ))}
        <button
          className="adm-btn ghost"
          style={{ marginLeft: "auto" }}
          onClick={fetchUsers}
        >🔄 Refresh</button>
      </div>

      <div className="adm-panel">
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--adm-muted)", fontSize: 14 }}>
            Loading users...
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Approved On</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        className={`adm-user-row-avatar ${u.role === "TEACHER" ? "t" : "s"}`}
                        style={{ width: 30, height: 30, borderRadius: 7, fontSize: 12 }}
                      >
                        {(u.name || "?")[0]}
                      </div>
                      {u.name}
                    </div>
                  </td>
                  <td style={{ color: "var(--adm-muted)", fontSize: 13 }}>{u.email}</td>
                  <td>
                    <span className={`adm-badge ${u.role?.toLowerCase()}`}>
                      {u.role === "TEACHER" ? "📚 Teacher" : "🎓 Student"}
                    </span>
                  </td>
                  <td>{u.department || "—"}</td>
                  <td style={{ color: "var(--adm-muted)", fontSize: 12 }}>
                    {u.updatedAt ? new Date(u.updatedAt).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric"
                    }) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "var(--adm-muted)", fontSize: 14 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
            No {roleFilter !== "all" ? roleFilter + "s" : "users"} found yet.
            <br />
            <span style={{ fontSize: 12, opacity: 0.7 }}>
              Approve registration requests to see users here.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;