import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const SubjectSetup = () => {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm]         = useState({ name: "", code: "", dept: "CSE", semester: "" });
  const [adding, setAdding]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [toast, setToast]       = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/subjects");
      setSubjects(res.data.subjects || []);
    } catch (err) {
      showToast("❌ Failed to load subjects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSubjects(); }, [fetchSubjects]);

  const handleAdd = async () => {
    if (!form.name || !form.code || !form.dept || !form.semester) return;
    try {
      await api.post("/admin/subjects", {
        name: form.name,
        code: form.code,
        department: form.dept,
        semester: form.semester
      });
      showToast("✅ Subject added");
      setForm({ name: "", code: "", dept: "CSE", semester: "" });
      setAdding(false);
      fetchSubjects();
    } catch (err) {
      showToast("❌ Failed to add subject: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await api.delete(`/admin/subjects/${id}`);
      showToast("✅ Subject deleted");
      fetchSubjects();
    } catch (err) {
      showToast("❌ Failed to delete subject");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 className="adm-page-title">Subjects</h1>
          <p className="adm-page-sub">Manage subjects and semesters.</p>
        </div>
        <button className="adm-btn primary" onClick={() => setAdding((p) => !p)}>
          + Add Subject
        </button>
      </div>

      {toast && (
        <div style={{
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 10, padding: "12px 20px", marginBottom: 20, fontSize: 14, color: "#e2e8f0",
        }}>
          {toast}
        </div>
      )}

      {adding && (
        <div className="adm-panel" style={{ marginBottom: 20, padding: 20 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <input className="adm-input" style={{ maxWidth: 200 }} placeholder="Subject Name"
              value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            <input className="adm-input" style={{ maxWidth: 120 }} placeholder="Code"
              value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} />
            
            <select className="adm-input" style={{ maxWidth: 120 }} value={form.dept} onChange={(e) => setForm((p) => ({ ...p, dept: e.target.value }))}>
              {["CSE","ECE","EE","ME","CE","IT","CHE","BT","AE","MME"].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <input className="adm-input" style={{ maxWidth: 80 }} placeholder="Sem" type="number"
              value={form.semester} onChange={(e) => setForm((p) => ({ ...p, semester: e.target.value }))} />
            
            <button className="adm-btn primary" onClick={handleAdd}>Add</button>
            <button className="adm-btn ghost"   onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="adm-panel">
        <table className="adm-table">
          <thead>
            <tr><th>Subject</th><th>Code</th><th>Dept</th><th>Semester</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: "center", padding: 20 }}>Loading...</td></tr>
            ) : subjects.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: "center", padding: 20 }}>No subjects configured.</td></tr>
            ) : (
              subjects.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td style={{ fontFamily: "monospace", color: "var(--adm-accent2)" }}>{s.code}</td>
                  <td>{s.department || s.dept}</td>
                  <td>Sem {s.semester}</td>
                  <td>
                    <button className="adm-btn danger" style={{ padding: "4px 10px", fontSize: 12 }}
                      onClick={() => handleDelete(s.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectSetup;