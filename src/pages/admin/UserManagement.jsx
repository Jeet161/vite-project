import { useState } from "react";

const ALL_USERS = [
  { name: "Rahul Sharma",      id: "STU-A1B2", role: "student", dept: "Computer Science", email: "rahul@edu.in",  status: "active" },
  { name: "Priya Nair",        id: "STU-C3D4", role: "student", dept: "Electronics",      email: "priya@edu.in",  status: "active" },
  { name: "Amit Verma",        id: "STU-E5F6", role: "student", dept: "Mechanical",        email: "amit@edu.in",   status: "pending" },
  { name: "Sneha Das",         id: "STU-G7H8", role: "student", dept: "Civil",             email: "sneha@edu.in",  status: "active" },
  { name: "Rohan Mehta",       id: "STU-I9J0", role: "student", dept: "Computer Science", email: "rohan@edu.in",  status: "pending" },
  { name: "Dr. Suresh Kumar",  id: "TCH-T1U2", role: "teacher", dept: "Computer Science", email: "suresh@edu.in", status: "active" },
  { name: "Prof. Anita Roy",   id: "TCH-V3W4", role: "teacher", dept: "Mathematics",       email: "anita@edu.in",  status: "active" },
  { name: "Dr. Ramesh Pillai", id: "TCH-X5Y6", role: "teacher", dept: "Electronics",       email: "ramesh@edu.in", status: "pending" },
];

const UserManagement = () => {
  const [search,    setSearch]    = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = ALL_USERS.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.id.toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleFilter   === "all" || u.role   === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div>
      <h1 className="adm-page-title">User Management</h1>
      <p className="adm-page-sub">Manage all students and teachers.</p>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          className="adm-input"
          style={{ maxWidth: 260 }}
          placeholder="Search by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {[["all","All Roles"],["student","Students"],["teacher","Teachers"]].map(([v,l]) => (
          <button
            key={v}
            className={`adm-btn ${roleFilter === v ? "primary" : "ghost"}`}
            onClick={() => setRoleFilter(v)}
          >{l}</button>
        ))}
        {[["all","All Status"],["active","Active"],["pending","Pending"]].map(([v,l]) => (
          <button
            key={v}
            className={`adm-btn ${statusFilter === v ? "primary" : "ghost"}`}
            onClick={() => setStatusFilter(v)}
          >{l}</button>
        ))}
      </div>

      <div className="adm-panel">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Name</th><th>Unique ID</th><th>Role</th>
              <th>Department</th><th>Email</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className={`adm-user-row-avatar ${u.role === "student" ? "s" : "t"}`}
                         style={{ width: 30, height: 30, borderRadius: 7, fontSize: 12 }}>
                      {u.name[0]}
                    </div>
                    {u.name}
                  </div>
                </td>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>{u.id}</td>
                <td><span className={`adm-badge ${u.role}`}>{u.role}</span></td>
                <td>{u.dept}</td>
                <td style={{ color: "var(--adm-muted)" }}>{u.email}</td>
                <td><span className={`adm-badge ${u.status}`}>{u.status}</span></td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    {u.status === "pending" && (
                      <button className="adm-btn primary" style={{ padding: "4px 10px", fontSize: 12 }}>
                        Approve
                      </button>
                    )}
                    <button className="adm-btn danger" style={{ padding: "4px 10px", fontSize: 12 }}>
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "var(--adm-muted)", fontSize: 14 }}>
            No users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;