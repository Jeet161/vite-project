// ── DepartmentSetup.jsx ──────────────────────────────────────────
import { useState } from "react";

const DEPTS = [
  { name: "Computer Science", code: "CS",   students: 320, teachers: 18 },
  { name: "Electronics",      code: "EC",   students: 210, teachers: 12 },
  { name: "Mechanical",       code: "ME",   students: 180, teachers: 10 },
  { name: "Civil",            code: "CE",   students: 160, teachers: 9  },
  { name: "Mathematics",      code: "MA",   students: 90,  teachers: 6  },
];

const DepartmentSetup = () => {
  const [depts, setDepts]   = useState(DEPTS);
  const [form, setForm]     = useState({ name: "", code: "" });
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    if (!form.name.trim() || !form.code.trim()) return;
    setDepts((p) => [...p, { ...form, students: 0, teachers: 0 }]);
    setForm({ name: "", code: "" });
    setAdding(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 className="adm-page-title">Departments</h1>
          <p className="adm-page-sub">Manage college departments.</p>
        </div>
        <button className="adm-btn primary" onClick={() => setAdding((p) => !p)}>
          + Add Department
        </button>
      </div>

      {adding && (
        <div className="adm-panel" style={{ marginBottom: 20, padding: 20 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <input className="adm-input" style={{ maxWidth: 240 }} placeholder="Department name"
              value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            <input className="adm-input" style={{ maxWidth: 100 }} placeholder="Code (e.g. CS)"
              value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} />
            <button className="adm-btn primary" onClick={handleAdd}>Add</button>
            <button className="adm-btn ghost" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="adm-panel">
        <table className="adm-table">
          <thead>
            <tr><th>Department</th><th>Code</th><th>Students</th><th>Teachers</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {depts.map((d, i) => (
              <tr key={i}>
                <td>{d.name}</td>
                <td><span style={{ fontFamily: "monospace", color: "var(--adm-accent2)" }}>{d.code}</span></td>
                <td>{d.students}</td>
                <td>{d.teachers}</td>
                <td>
                  <button className="adm-btn danger" style={{ padding: "4px 10px", fontSize: 12 }}
                    onClick={() => setDepts((p) => p.filter((_, idx) => idx !== i))}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentSetup;