import { useState, useEffect, useRef } from "react";
import { getAssignments, submitAssignment } from "../../services/assignmentService.js";

const FILTERS = [
  ["all",       "All"],
  ["pending",   "Pending"],
  ["submitted", "Submitted"],
  ["graded",    "Graded"],
];

/** Derive a simple status string from the backend assignment + mySubmission data */
const deriveStatus = (a) => {
  if (!a.mySubmission) return "pending";
  if (a.mySubmission.score !== null && a.mySubmission.score !== undefined) return "graded";
  return "submitted";
};

const MyAssignments = () => {
  const fileRef = useRef(null);

  const [assignments, setAssignments] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [filter,      setFilter]      = useState("all");
  const [expanded,    setExpanded]    = useState(null);

  // Submit modal state
  const [submitting,   setSubmitting]   = useState(false);
  const [submitTarget, setSubmitTarget] = useState(null); // assignment being submitted
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitError,  setSubmitError]  = useState("");
  const [submitSuccess,setSubmitSuccess]= useState(false);

  // ── Load ────────────────────────────────────────────────────────────────────
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAssignments();
      setAssignments(res.data.assignments || []);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load assignments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = assignments.filter((a) => {
    if (filter === "all") return true;
    return deriveStatus(a) === filter;
  });

  // ── Submit ─────────────────────────────────────────────────────────────────
  const openSubmitModal = (a) => {
    setSubmitTarget(a);
    setSelectedFile(null);
    setSubmitError("");
    setSubmitSuccess(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setSubmitError("Please select a file to submit.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const fd = new FormData();
      fd.append("file", selectedFile);
      await submitAssignment(submitTarget.id, fd);
      setSubmitSuccess(true);
      await load(); // Refresh list
      setTimeout(() => {
        setSubmitTarget(null);
        setSubmitSuccess(false);
      }, 1800);
    } catch (e) {
      setSubmitError(e.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="stu-page-title">My Assignments</h1>
      <p className="stu-page-sub">View and submit assignments from your department.</p>

      {error && (
        <div style={{ background: "#fee2e2", color: "#991b1b", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* ── Filter tabs ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {FILTERS.map(([v, l]) => (
          <button
            key={v}
            className={`stu-btn ${filter === v ? "primary" : "ghost"}`}
            onClick={() => setFilter(v)}
          >
            {l}
          </button>
        ))}
      </div>

      {/* ── List ── */}
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--stu-muted)", fontSize: 14 }}>
          Loading…
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((a, i) => {
            const status = deriveStatus(a);
            const sub    = a.mySubmission;
            const isOpen = expanded === i;

            return (
              <div key={a.id} className="stu-panel" style={{ overflow: "visible" }}>
                {/* Row header — click to expand */}
                <div
                  style={{ padding: "16px 20px", cursor: "pointer" }}
                  onClick={() => setExpanded(isOpen ? null : i)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                        {a.title}
                        {a.fileUrl && (
                          <a
                            href={a.fileUrl} target="_blank" rel="noreferrer"
                            style={{ marginLeft: 8, fontSize: 12, color: "var(--stu-accent)" }}
                            onClick={(e) => e.stopPropagation()}
                            title="Download assignment file"
                          >
                            📎 File
                          </a>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--stu-muted)" }}>
                        {a.subjectCode && <>{a.subjectCode} · </>}
                        By {a.teacher?.name} · Due:{" "}
                        {new Date(a.dueDate).toLocaleDateString("en-IN")} · Max: {a.maxScore}
                      </div>
                    </div>

                    <span className={`stu-badge ${status}`}>{status}</span>

                    {status === "graded" && sub?.score !== null && (
                      <span style={{ fontWeight: 700, fontSize: 14, color: "var(--stu-accent)" }}>
                        {sub.score}/{a.maxScore}
                      </span>
                    )}
                    <span style={{ color: "var(--stu-muted)", fontSize: 16 }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>

                {/* Expanded row */}
                {isOpen && (
                  <div style={{ padding: "0 20px 20px", borderTop: "1px solid var(--stu-border)", paddingTop: 16 }}>
                    {a.description && (
                      <p style={{ fontSize: 13, color: "var(--stu-muted)", marginBottom: 16 }}>{a.description}</p>
                    )}

                    {/* PENDING — show upload */}
                    {status === "pending" && a.status === "ACTIVE" && (
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>
                          Upload your submission
                        </label>
                        <button
                          className="stu-btn primary"
                          onClick={() => openSubmitModal(a)}
                        >
                          Submit Assignment
                        </button>
                      </div>
                    )}

                    {status === "pending" && a.status === "CLOSED" && (
                      <div style={{ fontSize: 13, color: "#ef4444" }}>
                        ⛔ This assignment is closed — submission is no longer accepted.
                      </div>
                    )}

                    {/* SUBMITTED */}
                    {status === "submitted" && (
                      <div>
                        <div style={{ fontSize: 13, color: "var(--stu-muted)", marginBottom: 10 }}>
                          ✅ Submitted on {new Date(sub.submittedAt).toLocaleString("en-IN")} — awaiting grading.
                        </div>
                        {sub.fileUrl && (
                          <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="stu-btn ghost">
                            View my submission
                          </a>
                        )}
                        {a.status === "ACTIVE" && (
                          <button
                            className="stu-btn ghost"
                            style={{ marginLeft: 8 }}
                            onClick={() => openSubmitModal(a)}
                          >
                            Re-submit
                          </button>
                        )}
                      </div>
                    )}

                    {/* GRADED */}
                    {status === "graded" && (
                      <div style={{ background: "#f5f3ff", borderRadius: 10, padding: 14, fontSize: 13 }}>
                        <div style={{ marginBottom: 6 }}>
                          <strong>Score:</strong> {sub.score}/{a.maxScore} ·{" "}
                          <strong>Percentage:</strong>{" "}
                          {Math.round((sub.score / a.maxScore) * 100)}%
                        </div>
                        {sub.feedback && (
                          <div style={{ color: "var(--stu-muted)" }}>
                            <strong>Feedback:</strong> {sub.feedback}
                          </div>
                        )}
                        {sub.fileUrl && (
                          <a
                            href={sub.fileUrl} target="_blank" rel="noreferrer"
                            className="stu-btn ghost" style={{ marginTop: 10, display: "inline-block" }}
                          >
                            View my submission
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 48, color: "var(--stu-muted)", fontSize: 14 }}>
              No assignments in this category.
            </div>
          )}
        </div>
      )}

      {/* ── Submit Modal ── */}
      {submitTarget && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "var(--stu-panel-bg, #fff)", borderRadius: 14, padding: 28,
            width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Submit Assignment</h3>
            <p style={{ fontSize: 13, color: "var(--stu-muted)", marginBottom: 18 }}>
              {submitTarget.title}
            </p>

            {submitSuccess ? (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#16a34a", fontWeight: 600, fontSize: 15 }}>
                ✅ Submitted successfully!
              </div>
            ) : (
              <>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>
                  Attach your file (PDF, DOCX, ZIP, etc. — max 20 MB)
                </label>
                <input
                  ref={fileRef} type="file"
                  accept=".pdf,.doc,.docx,.zip,.txt,.jpg,.jpeg,.png"
                  style={{ fontSize: 13, marginBottom: 14, display: "block" }}
                  onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                />
                {selectedFile && (
                  <p style={{ fontSize: 12, color: "var(--stu-accent)", marginBottom: 12 }}>
                    Selected: {selectedFile.name}
                  </p>
                )}
                {submitError && (
                  <p style={{ fontSize: 12, color: "#ef4444", marginBottom: 12 }}>{submitError}</p>
                )}
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    className="stu-btn primary"
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{ flex: 1 }}
                  >
                    {submitting ? "Uploading…" : "Submit"}
                  </button>
                  <button
                    className="stu-btn ghost"
                    onClick={() => setSubmitTarget(null)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAssignments;