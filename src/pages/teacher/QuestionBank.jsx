import { useState } from "react";

// ── QuestionBank ──────────────────────────────────────────────────
const QUESTIONS = [
  { q:"What is a binary search tree?", subject:"CS301", type:"Short Answer", marks:5 },
  { q:"Explain the process scheduling algorithms.", subject:"CS401", type:"Long Answer", marks:10 },
  { q:"What does SQL stand for?", subject:"CS402", type:"MCQ", marks:2 },
];

const QuestionBank = () => {
  const [questions, setQuestions] = useState(QUESTIONS);
  const [form, setForm] = useState({ q:"", subject:"", type:"MCQ", marks:"" });
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    if (!form.q || !form.subject) return;
    setQuestions((p) => [...p, { ...form }]);
    setForm({ q:"", subject:"", type:"MCQ", marks:"" });
    setAdding(false);
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <div>
          <h1 className="tch-page-title">Question Bank</h1>
          <p className="tch-page-sub">Manage reusable exam questions.</p>
        </div>
        <button className="tch-btn primary" onClick={() => setAdding((p) => !p)}>+ Add Question</button>
      </div>

      {adding && (
        <div className="tch-panel" style={{ marginBottom:20, padding:20 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:10, maxWidth:600 }}>
            <textarea className="tch-input" rows={3} placeholder="Question text"
              value={form.q} onChange={(e) => setForm((p) => ({ ...p, q:e.target.value }))}
              style={{ resize:"vertical" }} />
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <input className="tch-input" style={{ maxWidth:120 }} placeholder="Subject code"
                value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject:e.target.value }))} />
              <select className="tch-input" style={{ maxWidth:140 }}
                value={form.type} onChange={(e) => setForm((p) => ({ ...p, type:e.target.value }))}>
                {["MCQ","Short Answer","Long Answer"].map((t) => <option key={t}>{t}</option>)}
              </select>
              <input className="tch-input" style={{ maxWidth:80 }} placeholder="Marks"
                type="number" value={form.marks} onChange={(e) => setForm((p) => ({ ...p, marks:e.target.value }))} />
              <button className="tch-btn primary" onClick={handleAdd}>Add</button>
              <button className="tch-btn ghost" onClick={() => setAdding(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="tch-panel">
        <table className="tch-table">
          <thead><tr><th>Question</th><th>Subject</th><th>Type</th><th>Marks</th><th>Actions</th></tr></thead>
          <tbody>
            {questions.map((q, i) => (
              <tr key={i}>
                <td style={{ maxWidth:300 }}>{q.q}</td>
                <td style={{ fontFamily:"monospace", fontSize:12, color:"var(--tch-accent)" }}>{q.subject}</td>
                <td>{q.type}</td>
                <td>{q.marks}</td>
                <td>
                  <button className="tch-btn danger" style={{ padding:"4px 10px", fontSize:12 }}
                    onClick={() => setQuestions((p) => p.filter((_, idx) => idx !== i))}>
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

export { QuestionBank as default };