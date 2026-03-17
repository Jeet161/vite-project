import { useState } from "react";

const ASSIGNMENTS = [
  { title: "Assignment 3 — Data Structures", subject: "CS301", teacher: "Dr. Suresh Kumar", due: "Mar 20", maxMarks: 20, status: "pending",   marks: null, description: "Implement AVL tree with insertion and deletion." },
  { title: "Lab Report 2 — OS",              subject: "CS401", teacher: "Prof. Anita Roy",  due: "Mar 22", maxMarks: 15, status: "pending",   marks: null, description: "Document CPU scheduling experiments from Lab 2." },
  { title: "Assignment 2 — DBMS",            subject: "CS402", teacher: "Dr. Suresh Kumar", due: "Mar 10", maxMarks: 20, status: "submitted", marks: null, description: "Design ER diagram for a library management system." },
  { title: "Assignment 1 — Data Structures", subject: "CS301", teacher: "Dr. Suresh Kumar", due: "Feb 28", maxMarks: 20, status: "graded",    marks: 17,   description: "Implement stack and queue using linked lists." },
  { title: "Assignment 1 — OS",              subject: "CS401", teacher: "Prof. Anita Roy",  due: "Feb 20", maxMarks: 15, status: "graded",    marks: 13,   description: "Write a shell script for process management." },
];

const MyAssignments = () => {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const filtered = ASSIGNMENTS.filter((a) => filter === "all" || a.status === filter);

  return (
    <div>
      <h1 className="stu-page-title">My Assignments</h1>
      <p className="stu-page-sub">Track and submit your assignments.</p>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[["all", "All"], ["pending", "Pending"], ["submitted", "Submitted"], ["graded", "Graded"]].map(([v, l]) => (
          <button
            key={v}
            className={`stu-btn ${filter === v ? "primary" : "ghost"}`}
            onClick={() => setFilter(v)}
          >
            {l}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((a, i) => (
          <div key={i} className="stu-panel" style={{ overflow: "visible" }}>
            <div
              style={{ padding: "16px 20px", cursor: "pointer" }}
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: "var(--stu-muted)" }}>
                    {a.subject} · {a.teacher} · Due: {a.due}
                  </div>
                </div>
                <span className={`stu-badge ${a.status}`}>{a.status}</span>
                {a.marks !== null && (
                  <span style={{ fontWeight: 700, fontSize: 14, color: "var(--stu-accent)" }}>
                    {a.marks}/{a.maxMarks}
                  </span>
                )}
                <span style={{ color: "var(--stu-muted)", fontSize: 16 }}>
                  {expanded === i ? "▲" : "▼"}
                </span>
              </div>
            </div>

            {expanded === i && (
              <div style={{
                padding: "0 20px 20px",
                borderTop: "1px solid var(--stu-border)",
                marginTop: 0,
                paddingTop: 16,
              }}>
                <p style={{ fontSize: 13, color: "var(--stu-muted)", marginBottom: 16 }}>
                  {a.description}
                </p>
                {a.status === "pending" && (
                  <div>
                    <div style={{ marginBottom: 10 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>
                        Upload your submission
                      </label>
                      <input type="file" style={{ fontSize: 13, color: "var(--stu-muted)" }} />
                    </div>
                    <button className="stu-btn primary">Submit Assignment</button>
                  </div>
                )}
                {a.status === "submitted" && (
                  <div style={{ fontSize: 13, color: "var(--stu-muted)" }}>
                    ✅ Submitted — awaiting grading by teacher.
                  </div>
                )}
                {a.status === "graded" && (
                  <div style={{
                    background: "#f5f3ff", borderRadius: 10, padding: 14,
                    fontSize: 13, color: "var(--stu-text)",
                  }}>
                    <strong>Score:</strong> {a.marks}/{a.maxMarks} ·{" "}
                    <strong>Percentage:</strong> {Math.round((a.marks / a.maxMarks) * 100)}%
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 48, color: "var(--stu-muted)", fontSize: 14 }}>
            No assignments in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAssignments;