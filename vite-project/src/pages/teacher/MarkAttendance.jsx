import { useState } from "react";

const STUDENTS = [
  { name:"Rahul Sharma",  id:"STU-A1B2" },
  { name:"Priya Nair",    id:"STU-C3D4" },
  { name:"Amit Verma",    id:"STU-E5F6" },
  { name:"Sneha Das",     id:"STU-G7H8" },
  { name:"Rohan Mehta",   id:"STU-I9J0" },
];

const MarkAttendance = () => {
  const today = new Date().toISOString().split("T")[0];
  const [date,       setDate]       = useState(today);
  const [subject,    setSubject]    = useState("CS301");
  const [attendance, setAttendance] = useState(
    Object.fromEntries(STUDENTS.map((s) => [s.id, "present"]))
  );
  const [saved, setSaved] = useState(false);

  const toggle = (id) => {
    setAttendance((p) => ({ ...p, [id]: p[id] === "present" ? "absent" : "present" }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const presentCount = Object.values(attendance).filter((v) => v === "present").length;

  return (
    <div>
      <h1 className="tch-page-title">Mark Attendance</h1>
      <p className="tch-page-sub">Mark attendance for your class.</p>

      <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap", alignItems:"center" }}>
        <input className="tch-input" type="date" style={{ maxWidth:160 }}
          value={date} onChange={(e) => setDate(e.target.value)} />
        <select className="tch-input" style={{ maxWidth:160 }}
          value={subject} onChange={(e) => setSubject(e.target.value)}>
          {["CS301","CS401","CS402"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <span style={{ fontSize:13, color:"var(--tch-muted)" }}>
          {presentCount} / {STUDENTS.length} present
        </span>
        <button className="tch-btn primary" style={{ marginLeft:"auto" }} onClick={handleSave}>
          {saved ? "✅ Saved" : "Save Attendance"}
        </button>
      </div>

      <div className="tch-panel">
        <table className="tch-table">
          <thead><tr><th>Student</th><th>ID</th><th>Status</th><th>Toggle</th></tr></thead>
          <tbody>
            {STUDENTS.map((s, i) => (
              <tr key={i}>
                <td style={{ fontWeight:500 }}>{s.name}</td>
                <td style={{ fontFamily:"monospace", fontSize:12 }}>{s.id}</td>
                <td>
                  <span style={{
                    fontSize:12, fontWeight:600, padding:"3px 10px",
                    borderRadius:6, textTransform:"uppercase", letterSpacing:"0.04em",
                    background: attendance[s.id] === "present" ? "#dcfce7" : "#fee2e2",
                    color:      attendance[s.id] === "present" ? "#166534" : "#991b1b",
                  }}>
                    {attendance[s.id]}
                  </span>
                </td>
                <td>
                  <button
                    className={`tch-btn ${attendance[s.id] === "present" ? "danger" : "ghost"}`}
                    style={{ padding:"5px 12px", fontSize:12 }}
                    onClick={() => toggle(s.id)}
                  >
                    {attendance[s.id] === "present" ? "Mark Absent" : "Mark Present"}
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

export default MarkAttendance;