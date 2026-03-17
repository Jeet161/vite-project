import { useState } from "react";

const SUBJECTS = [
  { name: "Data Structures",     code: "CS301", dept: "CS", credits: 4, semester: 3 },
  { name: "Operating Systems",   code: "CS401", dept: "CS", credits: 4, semester: 4 },
  { name: "DBMS",                code: "CS402", dept: "CS", credits: 3, semester: 4 },
  { name: "Circuit Theory",      code: "EC201", dept: "EC", credits: 4, semester: 2 },
  { name: "Engineering Maths",   code: "MA101", dept: "MA", credits: 4, semester: 1 },
];

const SubjectSetup = () => {
  const [subjects, setSubjects] = useState(SUBJECTS);
  const [form, setForm]         = useState({ name: "", code: "", dept: "", credits: "", semester: "" });
  const [adding, setAdding]     = useState(false);

  const handleAdd = () => {
    if (!form.name || !form.code) return;
    setSubjects((p) => [...p, { ...form, credits: Number(form.credits), semester: Number(form.semester) }]);
    setForm({ name: "", code: "", dept: "", credits: "", semester: "" });
    setAdding(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 className="adm-page-title">Subjects</h1>
          <p className="adm-page-sub">Manage subjects and credit hours.</p>
        </div>
        <button className="adm-btn primary" onClick={() => setAdding((p) => !p)}>
          + Add Subject
        </button>
      </div>

      {adding && (
        <div className="adm-panel" style={{ marginBottom: 20, padding: 20 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              ["name","Subject Name","200px"], ["code","Code","120px"],
              ["dept","Dept","100px"], ["credits","Credits","80px"], ["semester","Sem","80px"]
            ].map(([key, ph, w]) => (
              <input key={key} className="adm-input" style={{ maxWidth: w }} placeholder={ph}
                value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} />
            ))}
            <button className="adm-btn primary" onClick={handleAdd}>Add</button>
            <button className="adm-btn ghost"   onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="adm-panel">
        <table className="adm-table">
          <thead>
            <tr><th>Subject</th><th>Code</th><th>Dept</th><th>Credits</th><th>Semester</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {subjects.map((s, i) => (
              <tr key={i}>
                <td>{s.name}</td>
                <td style={{ fontFamily: "monospace", color: "var(--adm-accent2)" }}>{s.code}</td>
                <td>{s.dept}</td>
                <td>{s.credits}</td>
                <td>Sem {s.semester}</td>
                <td>
                  <button className="adm-btn danger" style={{ padding: "4px 10px", fontSize: 12 }}
                    onClick={() => setSubjects((p) => p.filter((_, idx) => idx !== i))}>
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

export default SubjectSetup;