// ManageAssignments.jsx
import { useState } from "react";

const ASSIGNMENTS = [
  { title:"Assignment 3 — Data Structures", subject:"CS301", due:"Mar 20", submissions:18, total:42, status:"active" },
  { title:"Assignment 2 — Algorithms",      subject:"CS301", due:"Mar 10", submissions:38, total:42, status:"graded" },
  { title:"Lab Report 1",                   subject:"CS302", due:"Mar 25", submissions:5,  total:38, status:"active" },
];

const ManageAssignments = () => {
  const [assignments, setAssignments] = useState(ASSIGNMENTS);
  const [form, setForm] = useState({ title:"", subject:"", due:"" });
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    if (!form.title || !form.subject || !form.due) return;
    setAssignments((p) => [...p, { ...form, submissions:0, total:0, status:"active" }]);
    setForm({ title:"", subject:"", due:"" });
    setAdding(false);
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <div>
          <h1 className="tch-page-title">Assignments</h1>
          <p className="tch-page-sub">Create and manage assignments.</p>
        </div>
        <button className="tch-btn primary" onClick={() => setAdding((p) => !p)}>+ New Assignment</button>
      </div>

      {adding && (
        <div className="tch-panel" style={{ marginBottom:20, padding:20 }}>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <input className="tch-input" style={{ maxWidth:280 }} placeholder="Assignment title"
              value={form.title} onChange={(e) => setForm((p) => ({ ...p, title:e.target.value }))} />
            <input className="tch-input" style={{ maxWidth:120 }} placeholder="Subject code"
              value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject:e.target.value }))} />
            <input className="tch-input" style={{ maxWidth:140 }} type="date"
              value={form.due} onChange={(e) => setForm((p) => ({ ...p, due:e.target.value }))} />
            <button className="tch-btn primary" onClick={handleAdd}>Create</button>
            <button className="tch-btn ghost" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="tch-panel">
        <table className="tch-table">
          <thead><tr><th>Title</th><th>Subject</th><th>Due Date</th><th>Submissions</th><th>Status</th></tr></thead>
          <tbody>
            {assignments.map((a, i) => (
              <tr key={i}>
                <td style={{ fontWeight:500 }}>{a.title}</td>
                <td><span style={{ fontFamily:"monospace", fontSize:12, color:"var(--tch-accent)" }}>{a.subject}</span></td>
                <td>{a.due}</td>
                <td>{a.submissions} / {a.total}</td>
                <td><span className={`tch-badge ${a.status}`}>{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { ManageAssignments as default };