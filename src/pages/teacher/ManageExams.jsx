import { useState } from "react";

const EXAMS = [
  { name:"OS Mid-Term",    subject:"CS401", date:"Mar 18", duration:90, students:38, status:"active"   },
  { name:"DBMS Final",     subject:"CS402", date:"Mar 20", duration:120,students:42, status:"upcoming" },
  { name:"DS Quiz 1",      subject:"CS301", date:"Mar 5",  duration:30, students:42, status:"graded"   },
];

const ManageExams = () => {
  const [exams,  setExams]  = useState(EXAMS);
  const [form,   setForm]   = useState({ name:"", subject:"", date:"", duration:"" });
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    if (!form.name || !form.subject || !form.date) return;
    setExams((p) => [...p, { ...form, students:0, status:"upcoming" }]);
    setForm({ name:"", subject:"", date:"", duration:"" });
    setAdding(false);
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <div>
          <h1 className="tch-page-title">Manage Exams</h1>
          <p className="tch-page-sub">Schedule and manage exams.</p>
        </div>
        <button className="tch-btn primary" onClick={() => setAdding((p) => !p)}>+ New Exam</button>
      </div>

      {adding && (
        <div className="tch-panel" style={{ marginBottom:20, padding:20 }}>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <input className="tch-input" style={{ maxWidth:240 }} placeholder="Exam name"
              value={form.name} onChange={(e) => setForm((p) => ({ ...p, name:e.target.value }))} />
            <input className="tch-input" style={{ maxWidth:120 }} placeholder="Subject code"
              value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject:e.target.value }))} />
            <input className="tch-input" type="date" style={{ maxWidth:160 }}
              value={form.date} onChange={(e) => setForm((p) => ({ ...p, date:e.target.value }))} />
            <input className="tch-input" style={{ maxWidth:120 }} placeholder="Duration (mins)"
              value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration:e.target.value }))} />
            <button className="tch-btn primary" onClick={handleAdd}>Create</button>
            <button className="tch-btn ghost" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="tch-panel">
        <table className="tch-table">
          <thead><tr><th>Exam</th><th>Subject</th><th>Date</th><th>Duration</th><th>Students</th><th>Status</th></tr></thead>
          <tbody>
            {exams.map((e, i) => (
              <tr key={i}>
                <td style={{ fontWeight:500 }}>{e.name}</td>
                <td style={{ fontFamily:"monospace", fontSize:12, color:"var(--tch-accent)" }}>{e.subject}</td>
                <td>{e.date}</td>
                <td>{e.duration} min</td>
                <td>{e.students}</td>
                <td><span className={`tch-badge ${e.status}`}>{e.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageExams;