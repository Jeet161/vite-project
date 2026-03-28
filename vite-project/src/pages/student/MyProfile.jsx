import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { getProfile, updateProfile } from "../../services/userService";

const DEPT_LABELS = {
  CSE: "Computer Science & Engg.",
  ECE: "Electronics & Comm. Engg.",
  EE:  "Electrical Engineering",
  ME:  "Mechanical Engineering",
  CE:  "Civil Engineering",
  IT:  "Information Technology",
  CHE: "Chemical Engineering",
  BT:  "Biotechnology",
  AE:  "Aerospace Engineering",
  MME: "Metallurgy & Materials Engg.",
};

const MyProfile = () => {
  const { login } = useAuth();

  const [profile,  setProfile]  = useState(null);
  const [form,     setForm]     = useState({});
  const [origForm, setOrigForm] = useState({});

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState("");
  const [formErr, setFormErr] = useState("");

  // ── fetch from DB on mount ─────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getProfile()
      .then((res) => {
        if (cancelled) return;
        const u = res.data.user;
        setProfile(u);
        const snap = { name: u.name ?? "", email: u.email ?? "", phone: u.phone ?? "" };
        setForm(snap);
        setOrigForm(snap);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load profile. Please refresh.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  // ── handlers ───────────────────────────────────────────────────────────────
  const handleCancel = () => {
    setForm(origForm);
    setFormErr("");
    setEditing(false);
  };

  const handleSave = async () => {
    setFormErr("");
    if (!form.name.trim())  return setFormErr("Name cannot be empty.");
    if (!form.email.trim()) return setFormErr("Email cannot be empty.");

    setSaving(true);
    try {
      const res = await updateProfile({
        name:  form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });
      const updated = res.data.user;
      setProfile(updated);
      const snap = { name: updated.name ?? "", email: updated.email ?? "", phone: updated.phone ?? "" };
      setForm(snap);
      setOrigForm(snap);
      login(updated); // keep Navbar / AuthContext in sync
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setFormErr(err.response?.data?.message ?? "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── derived values ─────────────────────────────────────────────────────────
  const deptLabel    = profile ? (DEPT_LABELS[profile.department] ?? profile.department) : "";
  const avatarLetter = (profile?.name?.[0] ?? "?").toUpperCase();

  // ── loading / error states ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
        <div className="stu-spinner" />
        <p style={{ marginTop: 12 }}>Loading profile…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p style={{ color: "var(--red)", fontSize: 15 }}>{error}</p>
        <button className="stu-btn primary" style={{ marginTop: 12 }}
          onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  // ── main render ────────────────────────────────────────────────────────────
  return (
    <div>
      <h1 className="stu-page-title">My Profile</h1>
      <p className="stu-page-sub">View and update your account details.</p>

      {/* Success banner */}
      {saved && (
        <div style={{
          background: "rgba(167,139,250,0.12)",
          color: "var(--stu-accent2)",
          border: "1px solid rgba(167,139,250,0.3)",
          borderRadius: 10, padding: "10px 18px",
          marginBottom: 16, fontSize: 14, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          ✅ Profile saved successfully!
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, alignItems: "start" }}>

        {/* ── Avatar card ── */}
        <div className="stu-profile-card">
          <div className="stu-profile-avatar">{avatarLetter}</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{profile.name}</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>{deptLabel}</div>
          <div style={{
            fontFamily: "monospace", fontSize: 13, fontWeight: 600,
            background: "#ede9fe", color: "var(--stu-accent)",
            padding: "4px 12px", borderRadius: 8, marginTop: 4,
          }}>
            {profile.uniqueId ?? "—"}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
            Role: {profile.role} · Status: {profile.status}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
            Joined: {new Date(profile.createdAt).toLocaleDateString("en-IN", {
              year: "numeric", month: "short", day: "numeric",
            })}
          </div>
        </div>

        {/* ── Details panel ── */}
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
                <button
                  className="stu-btn primary"
                  style={{ padding: "6px 14px", fontSize: 12, opacity: saving ? 0.6 : 1 }}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                <button className="stu-btn ghost" style={{ padding: "6px 14px", fontSize: 12 }}
                  onClick={handleCancel} disabled={saving}>
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="stu-panel-body">

            {/* Error banner */}
            {formErr && (
              <div style={{
                background: "rgba(248,113,113,0.1)", color: "var(--red)",
                border: "1px solid rgba(248,113,113,0.25)",
                borderRadius: 8, padding: "8px 14px",
                marginBottom: 14, fontSize: 13,
              }}>
                ⚠️ {formErr}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

              {/* Editable fields — white bg, black text */}
              {[
                { label: "Full Name", key: "name",  type: "text"  },
                { label: "Email",     key: "email", type: "email" },
                { label: "Phone",     key: "phone", type: "tel"   },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6 }}>
                    {label}
                  </label>
                  <input
                    className="stu-input"
                    type={type}
                    value={form[key] ?? ""}
                    readOnly={!editing}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    style={{
                      background: "#fff",
                      color: "#111",
                      cursor: !editing ? "not-allowed" : "auto",
                      borderColor: editing ? "rgba(167,139,250,0.6)" : "#ddd",
                    }}
                  />
                </div>
              ))}

              {/* Read-only DB fields — light grey bg, dark text */}
              {[
                { label: "Department", value: deptLabel           },
                { label: "Unique ID",  value: profile.uniqueId ?? "—" },
                { label: "Role",       value: profile.role        },
                { label: "Status",     value: profile.status      },
              ].map(({ label, value }) => (
                <div key={label}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6 }}>
                    {label}
                  </label>
                  <input
                    className="stu-input"
                    type="text"
                    value={value}
                    readOnly
                    style={{ background: "#f5f5f5", color: "#555", cursor: "not-allowed", borderColor: "#ddd" }}
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