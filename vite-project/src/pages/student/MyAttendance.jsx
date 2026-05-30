import { useState, useEffect } from "react";
import { markAttendance, getMyAttendance } from "../../services/attendanceService.js";

const CLASS_LABELS = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];

const MyAttendance = () => {
  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [code,       setCode]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message,    setMessage]    = useState(null); // { type, text }

  useEffect(() => { fetchAttendance(); }, []);

  const fetchAttendance = async () => {
    try {
      const res = await getMyAttendance();
      setData(res.data);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMark = async () => {
    if (!code.trim()) return;
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await markAttendance(code.trim());
      setMessage({
        type: "success",
        text: `✅ Attendance marked for ${CLASS_LABELS[(res.data.classSlot ?? 1) - 1]}!`,
      });
      setCode("");
      setTimeout(() => fetchAttendance(), 500);

    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message ?? "Failed to mark attendance",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusClass = (status) =>
    status === "PRESENT" ? "stu-badge active" : "stu-badge missed";

  const getProgressColor = (pct) => {
    if (pct >= 75) return "green";
    if (pct >= 50) return "amber";
    return "red";
  };

  if (loading) {
    return (
      <div>
        <h1 className="stu-page-title">Attendance</h1>
        <p className="stu-page-sub">Track your class-wise attendance.</p>
        <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 40, textAlign: "center" }}>
          Loading attendance…
        </div>
      </div>
    );
  }

  const pct   = data?.percentage ?? 0;
  const color = getProgressColor(pct);

  // Build a per-day summary — group records by date
  const recordsByDate = {};
  (data?.records ?? []).forEach((r) => {
    const dateKey = new Date(r.date).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
    if (!recordsByDate[dateKey]) recordsByDate[dateKey] = [];
    recordsByDate[dateKey].push(r);
  });

  return (
    <div>
      <h1 className="stu-page-title">Attendance</h1>
      <p className="stu-page-sub">Mark your attendance using the class code and track your record.</p>

      {/* ── Summary Stats ── */}
      <div className="stu-stats" style={{ marginBottom: 24 }}>
        {[
          ["Total Classes", data?.total ?? 0,  "blue",   "📅"],
          ["Present",       data?.present ?? 0, "green",  "✅"],
          ["Absent",        data?.absent ?? 0,  "purple", "❌"],
          ["Attendance %",  `${pct}%`,          color,    "📊"],
        ].map(([label, value, cls, icon]) => (
          <div className="stu-stat-card" key={label}>
            <div className={`stu-stat-icon ${cls}`}>{icon}</div>
            <div className="stu-stat-value">{value}</div>
            <div className="stu-stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Progress Bar ── */}
      <div className="stu-panel" style={{ marginBottom: 24 }}>
        <div className="stu-panel-body">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Overall Attendance</span>
            <span style={{
              fontSize: 13, fontWeight: 700,
              color: pct >= 75 ? "var(--green)" : pct >= 50 ? "var(--amber)" : "var(--red)",
            }}>
              {pct}%
            </span>
          </div>
          <div className="stu-progress-bar">
            <div className={`stu-progress-fill ${color}`} style={{ width: `${pct}%` }} />
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
            {pct >= 75
              ? "✅ You meet the minimum 75% requirement"
              : `⚠️ You need ${75 - pct}% more to meet the requirement`}
          </div>
        </div>
      </div>

      {/* ── Mark Attendance ── */}
      <div className="stu-panel" style={{ marginBottom: 24 }}>
        <div className="stu-panel-header">
          <span className="stu-panel-title">Mark Today's Attendance</span>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>Code valid for 3 minutes · 5 classes/day</span>
        </div>
        <div className="stu-panel-body">
          {message && (
            <div style={{
              background:   message.type === "success"
                ? "rgba(52,211,153,0.08)"
                : "rgba(248,113,113,0.08)",
              border:       `1px solid ${message.type === "success"
                ? "rgba(52,211,153,0.25)"
                : "rgba(248,113,113,0.25)"}`,
              borderRadius: 8, padding: "10px 14px", fontSize: 13,
              color:        message.type === "success" ? "var(--green)" : "var(--red)",
              marginBottom: 16,
            }}>
              {message.text}
            </div>
          )}

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <input
              className="stu-input"
              type="text"
              placeholder="Enter 6-character code (e.g. AB3X7K)"
              value={code}
              maxLength={6}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && code.length === 6 && handleMark()}
              style={{
                flex: 1, letterSpacing: "0.15em",
                fontFamily: "DM Mono, monospace",
                fontSize: 16, fontWeight: 600,
              }}
            />
            <button
              className="stu-btn primary"
              onClick={handleMark}
              disabled={submitting || code.length !== 6}
              style={{ whiteSpace: "nowrap", padding: "10px 24px" }}
            >
              {submitting ? "Marking…" : "Mark Present"}
            </button>
          </div>

          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>
            💡 Each of the 5 daily class slots has a separate code. Enter the code your teacher reads out for each class.
          </p>
        </div>
      </div>

      {/* ── Per-Day Attendance Groups ── */}
      <div className="stu-panel">
        <div className="stu-panel-header">
          <span className="stu-panel-title">Attendance History</span>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            {data?.total ?? 0} records · {Object.keys(recordsByDate).length} days
          </span>
        </div>

        {!data?.records?.length ? (
          <div style={{ padding: 24, textAlign: "center", color: "var(--muted)", fontSize: 14 }}>
            No attendance records yet.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="stu-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Class Slot</th>
                  <th>Department</th>
                  <th>Teacher</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.records.map((record, i) => (
                  <tr key={record.id}>
                    <td style={{ color: "var(--muted)" }}>{i + 1}</td>
                    <td>
                      {new Date(record.date).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                    <td>
                      <span style={{
                        display:      "inline-flex",
                        alignItems:   "center",
                        gap:          5,
                        fontSize:     12,
                        fontWeight:   700,
                        background:   "rgba(34,211,238,0.1)",
                        color:        "var(--tch-accent, #22d3ee)",
                        padding:      "2px 10px",
                        borderRadius: 20,
                      }}>
                        {CLASS_LABELS[(record.session?.classSlot ?? 1) - 1]}
                      </span>
                    </td>
                    <td>{record.session?.department ?? "—"}</td>
                    <td>{record.session?.teacher?.name ?? "—"}</td>
                    <td>
                      <span className={getStatusClass(record.status)}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Per-Day Summary ── */}
      {Object.keys(recordsByDate).length > 0 && (
        <div className="stu-panel" style={{ marginTop: 24 }}>
          <div className="stu-panel-header">
            <span className="stu-panel-title">Daily Breakdown</span>
          </div>
          <div className="stu-panel-body">
            {Object.entries(recordsByDate).map(([date, records]) => {
              const present = records.filter((r) => r.status === "PRESENT").length;
              const total   = records.length;
              const dayPct  = Math.round((present / total) * 100);

              return (
                <div key={date} style={{
                  display:       "flex",
                  alignItems:    "center",
                  gap:           12,
                  marginBottom:  14,
                  paddingBottom: 14,
                  borderBottom:  "1px solid var(--border)",
                }}>
                  <div style={{ minWidth: 110, fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                    {date}
                  </div>

                  {/* 5 slot dots */}
                  <div style={{ display: "flex", gap: 6, flex: 1 }}>
                    {[1,2,3,4,5].map((slot) => {
                      const rec = records.find((r) => r.session?.classSlot === slot);
                      const bg  = !rec
                        ? "var(--surface2)"
                        : rec.status === "PRESENT"
                        ? "var(--green)"
                        : "var(--red)";
                      return (
                        <div key={slot} title={`Class ${slot}: ${rec ? rec.status : "No session"}`} style={{
                          width: 28, height: 28, borderRadius: 8,
                          background: bg,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, fontWeight: 700,
                          color: !rec ? "var(--muted)" : "#fff",
                          cursor: "default",
                        }}>
                          {slot}
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ fontSize: 12, color: "var(--muted)", minWidth: 60, textAlign: "right" }}>
                    <span style={{
                      fontWeight: 700,
                      color: dayPct === 100 ? "var(--green)" : dayPct >= 60 ? "var(--amber)" : "var(--red)",
                    }}>
                      {present}/{total}
                    </span>
                    {" "}classes
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAttendance;