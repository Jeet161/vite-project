import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  createAssignment,
  getAssignments,
  closeAssignment,
} from "../../services/assignmentService.js";

const STATUS_COLORS = { ACTIVE: "active", CLOSED: "graded" };

const ManageAssignments = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState("");
  const [adding, setAdding]           = useState(false);

  const [form, setForm] = useState({
    title: "", subjectCode: "", description: "", dueDate: "", maxScore: "100",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // ── Load assignments ────────────────────────────────────────────────────────
  const loadAssignments = async () => {
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

  useEffect(() => { loadAssignments(); }, []);

  // ── Create assignment ───────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!form.title || !form.dueDate) {
      setError("Title and due date are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("title",        form.title);
      fd.append("subjectCode",  form.subjectCode);
      fd.append("description",  form.description);
      fd.append("dueDate",      form.dueDate);
      fd.append("maxScore",     form.maxScore);
      if (selectedFile) fd.append("file", selectedFile);

      await createAssignment(fd);
      setForm({ title: "", subjectCode: "", description: "", dueDate: "", maxScore: "100" });
      setSelectedFile(null);
      if (fileRef.current) fileRef.current.value = "";
      setAdding(false);
      await loadAssignments();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to create assignment.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Close assignment ────────────────────────────────────────────────────────
  const handleClose = async (id) => {
    if (!window.confirm("Close this assignment? Students won't be able to submit anymore.")) return;
    try {
      await closeAssignment(id);
      await loadAssignments();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to close assignment.");
    }
  };

  const f = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 className="tch-page-title">Assignments</h1>
          <p className="tch-page-sub">Publish assignments for your department students.</p>
        </div>
        <button className="tch-btn primary" onClick={() => { setAdding((p) => !p); setError(""); }}>
          {adding ? "✕ Cancel" : "+ New Assignment"}
        </button>
      </div>

      {error && (
        <div style={{ background: "#fee2e2", color: "#991b1b", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* ── Create Form ── */}
      {adding && (
        <div className="tch-panel" style={{ marginBottom: 20, padding: 20 }}>
          <h3 style={{ marginBottom: 16, fontSize: 15, fontWeight: 600 }}>New Assignment</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
            <input
              className="tch-input" style={{ flex: "1 1 240px" }}
              placeholder="Assignment title *"
              value={form.title} onChange={f("title")}
            />
            <input
              className="tch-input" style={{ flex: "0 1 140px" }}
              placeholder="Subject code (e.g. CS301)"
              value={form.subjectCode} onChange={f("subjectCode")}
            />
            <input
              className="tch-input" style={{ flex: "0 1 160px" }} type="date"
              value={form.dueDate} onChange={f("dueDate")}
            />
            <input
              className="tch-input" style={{ flex: "0 1 100px" }} type="number"
              placeholder="Max score" min="1" max="1000"
              value={form.maxScore} onChange={f("maxScore")}
            />
          </div>
          <textarea
            className="tch-input" rows={3}
            style={{ width: "100%", resize: "vertical", marginBottom: 12, padding: "8px 12px", fontFamily: "inherit", fontSize: 13 }}
            placeholder="Description / instructions (optional)"
            value={form.description} onChange={f("description")}
          />
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6, color: "var(--tch-muted)" }}>
              Attach file (PDF, DOCX, ZIP, etc. — max 20 MB)
            </label>
            <input
              ref={fileRef} type="file"
              style={{ fontSize: 13, color: "var(--tch-muted)" }}
              accept=".pdf,.doc,.docx,.zip,.txt,.jpg,.jpeg,.png"
              onChange={(e) => setSelectedFile(e.target.files[0] || null)}
            />
            {selectedFile && (
              <span style={{ fontSize: 12, color: "var(--tch-accent)", marginLeft: 10 }}>
                {selectedFile.name}
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="tch-btn primary" onClick={handleCreate} disabled={submitting}>
              {submitting ? "Publishing…" : "Publish Assignment"}
            </button>
            <button className="tch-btn ghost" onClick={() => { setAdding(false); setError(""); }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Assignment Table ── */}
      <div className="tch-panel">
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--tch-muted)", fontSize: 14 }}>
            Loading assignments…
          </div>
        ) : assignments.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--tch-muted)", fontSize: 14 }}>
            No assignments yet. Click <strong>+ New Assignment</strong> to publish one.
          </div>
        ) : (
          <table className="tch-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Due Date</th>
                <th>Max Score</th>
                <th>Submissions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 500 }}>
                    {a.title}
                    {a.fileUrl && (
                      <a
                        href={a.fileUrl} target="_blank" rel="noreferrer"
                        style={{ marginLeft: 8, fontSize: 11, color: "var(--tch-accent)" }}
                        title="Download attached file"
                      >
                        📎
                      </a>
                    )}
                  </td>
                  <td>
                    <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--tch-accent)" }}>
                      {a.subjectCode || "—"}
                    </span>
                  </td>
                  <td style={{ fontSize: 13 }}>{new Date(a.dueDate).toLocaleDateString("en-IN")}</td>
                  <td style={{ fontSize: 13 }}>{a.maxScore}</td>
                  <td style={{ fontSize: 13 }}>
                    {a._count?.submissions ?? 0}
                  </td>
                  <td>
                    <span className={`tch-badge ${STATUS_COLORS[a.status] || "pending"}`}>
                      {a.status.toLowerCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="tch-btn ghost" style={{ padding: "4px 12px", fontSize: 12 }}
                        onClick={() => navigate(`/teacher/grade-submissions?id=${a.id}&title=${encodeURIComponent(a.title)}`)}
                      >
                        View Submissions
                      </button>
                      {a.status === "ACTIVE" && (
                        <button
                          className="tch-btn ghost" style={{ padding: "4px 12px", fontSize: 12, color: "#ef4444" }}
                          onClick={() => handleClose(a.id)}
                        >
                          Close
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageAssignments;