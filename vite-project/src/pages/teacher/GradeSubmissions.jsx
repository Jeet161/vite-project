import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getSubmissions, gradeSubmission } from "../../services/assignmentService.js";

const GradeSubmissions = () => {
  const [searchParams] = useSearchParams();
  const assignmentId    = Number(searchParams.get("id"));
  const assignmentTitle = searchParams.get("title") || "Assignment";

  const [assignment,  setAssignment]  = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");

  // Local draft scores: { [submissionId]: { score, feedback } }
  const [drafts, setDrafts] = useState({});
  const [saving, setSaving] = useState({}); // { [submissionId]: bool }

  // ── Load submissions ────────────────────────────────────────────────────────
  const load = async () => {
    if (!assignmentId) {
      setError("No assignment selected. Go back to Assignments and click 'View Submissions'.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await getSubmissions(assignmentId);
      setAssignment(res.data.assignment);
      const subs = res.data.submissions || [];
      setSubmissions(subs);
      // Seed drafts from existing saved scores
      const initial = {};
      subs.forEach((s) => {
        initial[s.id] = { score: s.score ?? "", feedback: s.feedback ?? "" };
      });
      setDrafts(initial);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [assignmentId]);

  // ── Handle draft change ─────────────────────────────────────────────────────
  const onDraftChange = (subId, key, value) => {
    setDrafts((p) => ({ ...p, [subId]: { ...p[subId], [key]: value } }));
  };

  // ── Save grade ──────────────────────────────────────────────────────────────
  const handleGrade = async (subId) => {
    const draft = drafts[subId];
    if (draft?.score === "" || draft?.score === undefined) return;
    setSaving((p) => ({ ...p, [subId]: true }));
    setError("");
    try {
      await gradeSubmission(subId, draft.score, draft.feedback);
      // Reflect saved score in the list
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === subId ? { ...s, score: Number(draft.score), feedback: draft.feedback } : s
        )
      );
    } catch (e) {
      setError(e.response?.data?.message || "Failed to save grade.");
    } finally {
      setSaving((p) => ({ ...p, [subId]: false }));
    }
  };

  const maxScore = assignment?.maxScore || 100;

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ marginBottom: 20 }}>
        <h1 className="tch-page-title">Grade Submissions</h1>
        <p className="tch-page-sub">
          {assignment
            ? <>Reviewing: <strong>{assignment.title}</strong> · Max score: <strong>{maxScore}</strong></>
            : assignmentTitle}
        </p>
      </div>

      {error && (
        <div style={{ background: "#fee2e2", color: "#991b1b", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--tch-muted)", fontSize: 14 }}>
          Loading submissions…
        </div>
      ) : (
        <>
          {/* ── Stats ── */}
          {assignment && (
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              {[
                ["Total Submitted", submissions.length],
                ["Graded", submissions.filter((s) => s.score !== null).length],
                ["Pending", submissions.filter((s) => s.score === null).length],
                ["Due Date", new Date(assignment.dueDate).toLocaleDateString("en-IN")],
              ].map(([label, val]) => (
                <div key={label} className="tch-panel" style={{ padding: "12px 20px", flex: "1 1 140px", minWidth: 130, textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "var(--tch-accent)" }}>{val}</div>
                  <div style={{ fontSize: 12, color: "var(--tch-muted)", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          )}

          <div className="tch-panel">
            {submissions.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--tch-muted)", fontSize: 14 }}>
                No submissions yet for this assignment.
              </div>
            ) : (
              <table className="tch-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>ID</th>
                    <th>Submitted At</th>
                    <th>File</th>
                    <th>Score (/{maxScore})</th>
                    <th>Feedback</th>
                    <th>Status</th>
                    <th>Save</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s) => {
                    const draft = drafts[s.id] || { score: "", feedback: "" };
                    const isDirty =
                      String(draft.score)    !== String(s.score ?? "")    ||
                      String(draft.feedback) !== String(s.feedback ?? "");
                    const isGraded = s.score !== null && s.score !== undefined;

                    return (
                      <tr key={s.id}>
                        <td style={{ fontWeight: 500 }}>{s.student?.name}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 12 }}>{s.student?.uniqueId || "—"}</td>
                        <td style={{ fontSize: 12, color: "var(--tch-muted)" }}>
                          {new Date(s.submittedAt).toLocaleString("en-IN")}
                        </td>
                        <td>
                          {s.fileUrl ? (
                            <a
                              href={s.fileUrl} target="_blank" rel="noreferrer"
                              className="tch-btn ghost"
                              style={{ padding: "4px 12px", fontSize: 12, display: "inline-block", textDecoration: "none" }}
                            >
                              ⬇ Download
                            </a>
                          ) : (
                            <span style={{ fontSize: 12, color: "var(--tch-muted)" }}>No file</span>
                          )}
                        </td>
                        <td>
                          <input
                            type="number" min={0} max={maxScore}
                            className="tch-input" style={{ maxWidth: 80 }}
                            placeholder="—"
                            value={draft.score}
                            onChange={(e) => onDraftChange(s.id, "score", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="tch-input" style={{ maxWidth: 180 }}
                            placeholder="Optional feedback"
                            value={draft.feedback}
                            onChange={(e) => onDraftChange(s.id, "feedback", e.target.value)}
                          />
                        </td>
                        <td>
                          <span className={`tch-badge ${isGraded ? "graded" : "pending"}`}>
                            {isGraded ? `Graded (${s.score})` : "Pending"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="tch-btn primary"
                            style={{ padding: "4px 14px", fontSize: 12, opacity: isDirty ? 1 : 0.45 }}
                            disabled={!isDirty || saving[s.id]}
                            onClick={() => handleGrade(s.id)}
                          >
                            {saving[s.id] ? "Saving…" : "Save"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GradeSubmissions;