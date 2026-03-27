import { useState, useEffect, useRef } from "react";
import { generateAttendanceCode } from "../../services/attendanceService.js";

const EXPIRE_SECONDS = 180; // 3 minutes

const MarkAttendance = () => {
  const [session,    setSession]    = useState(null); // { code, expiresAt }
  const [generating, setGenerating] = useState(false);
  const [timeLeft,   setTimeLeft]   = useState(0);
  const [expired,    setExpired]    = useState(false);
  const [error,      setError]      = useState("");
  const timerRef = useRef(null);

  // Countdown timer
  useEffect(() => {
    if (!session) return;

    setExpired(false);
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const remaining = Math.round((new Date(session.expiresAt) - new Date()) / 1000);
      if (remaining <= 0) {
        setTimeLeft(0);
        setExpired(true);
        clearInterval(timerRef.current);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [session]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    setExpired(false);
    try {
      const res = await generateAttendanceCode();
      setSession({
        code:      res.data.code,
        expiresAt: res.data.expiresAt,
      });
      setTimeLeft(res.data.secondsLeft);
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to generate code");
    } finally {
      setGenerating(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const timerColor = timeLeft > 60 ? "var(--green)" : timeLeft > 20 ? "var(--amber)" : "var(--red)";

  return (
    <div>
      <h1 className="tch-page-title">Mark Attendance</h1>
      <p className="tch-page-sub">Generate a code and share it verbally with your students.</p>

      {/* ── Generate Code Panel ── */}
      <div className="tch-panel" style={{ maxWidth: 560, marginBottom: 24 }}>
        <div className="tch-panel-header">
          <span className="tch-panel-title">Attendance Code</span>
          {session && !expired && (
            <span style={{ fontSize: 12, color: "var(--muted)" }}>
              Expires in{" "}
              <span style={{ color: timerColor, fontWeight: 700, fontFamily: "DM Mono, monospace" }}>
                {formatTime(timeLeft)}
              </span>
            </span>
          )}
        </div>

        <div className="tch-panel-body" style={{ textAlign: "center" }}>
          {error && (
            <div style={{
              background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: 8, padding: "10px 14px", fontSize: 13,
              color: "var(--red)", marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {/* Code Display */}
          {session && (
            <div style={{ marginBottom: 28 }}>
              <div style={{
                fontFamily:    "DM Mono, monospace",
                fontSize:      52,
                fontWeight:    700,
                letterSpacing: "0.2em",
                color:         expired ? "var(--muted)" : "var(--tch-accent)",
                background:    "var(--surface2)",
                border:        `2px solid ${expired ? "var(--border)" : "var(--tch-accent)"}`,
                borderRadius:  16,
                padding:       "24px 32px",
                display:       "inline-block",
                marginBottom:  16,
                filter:        expired ? "opacity(0.4)" : "none",
                transition:    "all 0.3s ease",
              }}>
                {session.code}
              </div>

              {expired ? (
                <div style={{ fontSize: 14, color: "var(--red)", fontWeight: 600 }}>
                  ⏱ Code expired — generate a new one
                </div>
              ) : (
                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  Share this code verbally with your students
                </div>
              )}

              {/* Progress bar */}
              {!expired && (
                <div style={{ marginTop: 16, height: 4, background: "var(--surface2)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{
                    height:     "100%",
                    borderRadius: 2,
                    background: timerColor,
                    width:      `${(timeLeft / EXPIRE_SECONDS) * 100}%`,
                    transition: "width 1s linear, background 0.3s",
                  }} />
                </div>
              )}
            </div>
          )}

          {/* Generate Button */}
          <button
            className="tch-btn primary"
            onClick={handleGenerate}
            disabled={generating}
            style={{ padding: "12px 32px", fontSize: 14 }}
          >
            {generating
              ? "Generating…"
              : session && !expired
              ? "🔄 Generate New Code"
              : "⚡ Generate Code"}
          </button>

          {!session && (
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12 }}>
              Code will be valid for 3 minutes
            </p>
          )}
        </div>
      </div>

      {/* ── Instructions ── */}
      <div className="tch-panel" style={{ maxWidth: 560 }}>
        <div className="tch-panel-header">
          <span className="tch-panel-title">How it works</span>
        </div>
        <div className="tch-panel-body">
          {[
            ["⚡", "Generate",  "Click the button to generate a unique 6-character code for today."],
            ["🗣️", "Share",     "Read the code out loud to your students in class."],
            ["📱", "Students",  "Students enter the code in their Attendance page within 3 minutes."],
            ["🌙", "Auto-mark", "Students who don't submit will be marked Absent at end of day."],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ display: "flex", gap: 14, marginBottom: 16 }}>
              <div style={{
                fontSize: 20, width: 40, height: 40, borderRadius: 10,
                background: "rgba(34,211,238,0.08)", display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {icon}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{title}</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;