import { useState } from "react";
import useAuth from "../../hooks/useAuth";

const MyProfile = () => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name:       user?.name       ?? "Rahul Sharma",
    email:      user?.email      ?? "rahul@example.com",
    phone:      user?.phone      ?? "9876543210",
    dept:       user?.department ?? "Computer Science",
    rollNo:     user?.rollNumber ?? "2021CS001",
    year:       user?.year       ?? "3rd Year",
    uniqueId:   user?.uniqueId   ?? "STU-A1B2",
  });

  const [editing, setEditing] = useState(false);
  const [saved,   setSaved]   = useState(false);

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 className="stu-page-title">My Profile</h1>
      <p className="stu-page-sub">View and update your account details.</p>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, alignItems: "start" }}>

        {/* Avatar card */}
        <div className="stu-profile-card">
          <div className="stu-profile-avatar">
            {form.name[0]?.toUpperCase()}
          </div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{form.name}</div>
          <div style={{ fontSize: 13, color: "var(--stu-muted)" }}>{form.dept}</div>
          <div style={{
            fontFamily: "monospace", fontSize: 13, fontWeight: 600,
            background: "#ede9fe", color: "var(--stu-accent)",
            padding: "4px 12px", borderRadius: 8, marginTop: 4,
          }}>
            {form.uniqueId}
          </div>
          <div style={{ fontSize: 12, color: "var(--stu-muted)", marginTop: 4 }}>
            {form.year} · Roll No: {form.rollNo}
          </div>
        </div>

        {/* Details */}
        <div className="stu-panel">
          <div className="stu-panel-header">
            <span className="stu-panel-title">Personal Information</span>
            {!editing ? (
              <button className="stu-btn ghost" style={{ padding: "6px 14px", fontSize: 12 }}
                onClick={() => setEditing(true)}>
                ✏️ Edit
              </button>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <button className="stu-btn primary" style={{ padding: "6px 14px", fontSize: 12 }}
                  onClick={handleSave}>
                  {saved ? "✅ Saved" : "Save"}
                </button>
                <button className="stu-btn ghost" style={{ padding: "6px 14px", fontSize: 12 }}
                  onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className="stu-panel-body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                ["Full Name",   "name",   "text",  false],
                ["Email",       "email",  "email", false],
                ["Phone",       "phone",  "tel",   false],
                ["Department",  "dept",   "text",  true ],
                ["Roll Number", "rollNo", "text",  true ],
                ["Year",        "year",   "text",  true ],
              ].map(([label, key, type, readOnly]) => (
                <div key={key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--stu-muted)", display: "block", marginBottom: 6 }}>
                    {label}
                  </label>
                  <input
                    className="stu-input"
                    type={type}
                    value={form[key]}
                    readOnly={readOnly || !editing}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    style={{
                      background: readOnly || !editing ? "#fafaf9" : "#fff",
                      color: readOnly ? "var(--stu-muted)" : "var(--stu-text)",
                      cursor: readOnly ? "not-allowed" : "auto",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;