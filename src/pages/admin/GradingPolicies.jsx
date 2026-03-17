import { useState } from "react";

const DEFAULT_GRADES = [
  { grade: "O",  label: "Outstanding", min: 90, max: 100, points: 10 },
  { grade: "A+", label: "Excellent",   min: 80, max: 89,  points: 9  },
  { grade: "A",  label: "Very Good",   min: 70, max: 79,  points: 8  },
  { grade: "B+", label: "Good",        min: 60, max: 69,  points: 7  },
  { grade: "B",  label: "Above Avg",   min: 50, max: 59,  points: 6  },
  { grade: "C",  label: "Average",     min: 40, max: 49,  points: 5  },
  { grade: "D",  label: "Pass",        min: 35, max: 39,  points: 4  },
  { grade: "F",  label: "Fail",        min: 0,  max: 34,  points: 0  },
];

const GradingPolicies = () => {
  const [grades, setGrades] = useState(DEFAULT_GRADES);
  const [saved,  setSaved]  = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 className="adm-page-title">Grading Policies</h1>
          <p className="adm-page-sub">Define grade ranges and grade point values.</p>
        </div>
        <button className="adm-btn primary" onClick={handleSave}>
          {saved ? "✅ Saved" : "Save Changes"}
        </button>
      </div>

      <div className="adm-panel">
        <table className="adm-table">
          <thead>
            <tr><th>Grade</th><th>Label</th><th>Min Marks</th><th>Max Marks</th><th>Grade Points</th></tr>
          </thead>
          <tbody>
            {grades.map((g, i) => (
              <tr key={i}>
                <td>
                  <span style={{
                    fontFamily: "monospace", fontWeight: 700, fontSize: 15,
                    color: g.grade === "F" ? "var(--adm-red)" : g.points >= 9 ? "var(--adm-green)" : "var(--adm-accent2)"
                  }}>
                    {g.grade}
                  </span>
                </td>
                <td>{g.label}</td>
                <td>
                  <input className="adm-input" style={{ maxWidth: 80 }} type="number"
                    value={g.min}
                    onChange={(e) => setGrades((p) => p.map((x, idx) => idx === i ? { ...x, min: Number(e.target.value) } : x))} />
                </td>
                <td>
                  <input className="adm-input" style={{ maxWidth: 80 }} type="number"
                    value={g.max}
                    onChange={(e) => setGrades((p) => p.map((x, idx) => idx === i ? { ...x, max: Number(e.target.value) } : x))} />
                </td>
                <td>
                  <input className="adm-input" style={{ maxWidth: 80 }} type="number"
                    value={g.points}
                    onChange={(e) => setGrades((p) => p.map((x, idx) => idx === i ? { ...x, points: Number(e.target.value) } : x))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradingPolicies;