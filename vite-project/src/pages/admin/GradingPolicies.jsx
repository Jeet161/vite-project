import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const DEFAULT_GRADES = [
  { grade: "O",  label: "Outstanding", minScore: 90, maxScore: 100, gradePoints: 10 },
  { grade: "A+", label: "Excellent",   minScore: 80, maxScore: 89,  gradePoints: 9  },
  { grade: "A",  label: "Very Good",   minScore: 70, maxScore: 79,  gradePoints: 8  },
  { grade: "B+", label: "Good",        minScore: 60, maxScore: 69,  gradePoints: 7  },
  { grade: "B",  label: "Above Avg",   minScore: 50, maxScore: 59,  gradePoints: 6  },
  { grade: "C",  label: "Average",     minScore: 40, maxScore: 49,  gradePoints: 5  },
  { grade: "D",  label: "Pass",        minScore: 35, maxScore: 39,  gradePoints: 4  },
  { grade: "F",  label: "Fail",        minScore: 0,  maxScore: 34,  gradePoints: 0  },
];

const GradingPolicies = () => {
  const [grades, setGrades] = useState([]);
  const [saved,  setSaved]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/grading");
      if (res.data.policies && res.data.policies.length > 0) {
        setGrades(res.data.policies);
      } else {
        // Fallback to default if nothing in DB
        setGrades(DEFAULT_GRADES);
      }
    } catch (err) {
      showToast("❌ Failed to load grading policies");
      setGrades(DEFAULT_GRADES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPolicies(); }, [fetchPolicies]);

  const handleSave = async () => {
    try {
      await api.put("/admin/grading", { policies: grades });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      showToast("❌ Failed to save policies");
    }
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

      {toast && (
        <div style={{
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 10, padding: "12px 20px", marginBottom: 20, fontSize: 14, color: "#e2e8f0",
        }}>
          {toast}
        </div>
      )}

      <div className="adm-panel">
        <table className="adm-table">
          <thead>
            <tr><th>Grade</th><th>Label</th><th>Min Marks</th><th>Max Marks</th><th>Grade Points</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: "center", padding: 20 }}>Loading...</td></tr>
            ) : grades.map((g, i) => (
              <tr key={i}>
                <td>
                  <span style={{
                    fontFamily: "monospace", fontWeight: 700, fontSize: 15,
                    color: g.grade === "F" ? "var(--adm-red)" : (g.gradePoints || g.points) >= 9 ? "var(--adm-green)" : "var(--adm-accent2)"
                  }}>
                    {g.grade}
                  </span>
                </td>
                <td>{g.label}</td>
                <td>
                  <input className="adm-input" style={{ maxWidth: 80 }} type="number"
                    value={g.minScore ?? g.min ?? 0}
                    onChange={(e) => setGrades((p) => p.map((x, idx) => idx === i ? { ...x, minScore: Number(e.target.value) } : x))} />
                </td>
                <td>
                  <input className="adm-input" style={{ maxWidth: 80 }} type="number"
                    value={g.maxScore ?? g.max ?? 0}
                    onChange={(e) => setGrades((p) => p.map((x, idx) => idx === i ? { ...x, maxScore: Number(e.target.value) } : x))} />
                </td>
                <td>
                  <input className="adm-input" style={{ maxWidth: 80 }} type="number"
                    value={g.gradePoints ?? g.points ?? 0}
                    onChange={(e) => setGrades((p) => p.map((x, idx) => idx === i ? { ...x, gradePoints: Number(e.target.value) } : x))} />
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