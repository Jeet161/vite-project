import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EXAMS = [
  { name: "OS Mid-Term",  subject: "CS401", date: "Mar 18", time: "10:00 AM", duration: 90,  status: "upcoming", score: null,  total: 50 },
  { name: "DBMS Final",   subject: "CS402", date: "Mar 20", time: "2:00 PM",  duration: 120, status: "upcoming", score: null,  total: 100 },
  { name: "DS Quiz 1",    subject: "CS301", date: "Mar 5",  time: "11:00 AM", duration: 30,  status: "graded",   score: 22,    total: 25 },
  { name: "Maths Test 2", subject: "MA301", date: "Feb 28", time: "9:00 AM",  duration: 60,  status: "graded",   score: 41,    total: 50 },
];

const STATUS_COLOR = {
  upcoming: { bg: "#ede9fe", text: "#4c1d95" },
  active:   { bg: "#dcfce7", text: "#166534" },
  graded:   { bg: "#dbeafe", text: "#1e40af" },
};

const MyExams = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const filtered = EXAMS.filter((e) => filter === "all" || e.status === filter);

  return (
    <div>
      <h1 className="stu-page-title">My Exams</h1>
      <p className="stu-page-sub">View upcoming and past exams.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["all", "All"], ["upcoming", "Upcoming"], ["graded", "Completed"]].map(([v, l]) => (
          <button key={v} className={`stu-btn ${filter === v ? "primary" : "ghost"}`}
            onClick={() => setFilter(v)}>{l}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.map((e, i) => {
          const pct = e.score !== null ? Math.round((e.score / e.total) * 100) : null;
          return (
            <div key={i} className="stu-panel" style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: STATUS_COLOR[e.status]?.bg ?? "#f1f5f9",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 22, flexShrink: 0,
                }}>
                  📝
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{e.name}</div>
                  <div style={{ fontSize: 12, color: "var(--stu-muted)" }}>
                    {e.subject} · {e.date} · {e.time} · {e.duration} min
                  </div>
                  {pct !== null && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>
                          Score: {e.score}/{e.total}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: pct >= 75 ? "#16a34a" : pct >= 50 ? "#d97706" : "#dc2626" }}>
                          {pct}%
                        </span>
                      </div>
                      <div className="stu-progress-bar">
                        <div
                          className={`stu-progress-fill ${pct >= 75 ? "green" : pct >= 50 ? "amber" : "red"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  <span className={`stu-badge ${e.status}`}>{e.status}</span>
                  {e.status === "active" && (
                    <button className="stu-btn primary" style={{ fontSize: 12, padding: "6px 14px" }}>
                      Start Exam
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyExams;