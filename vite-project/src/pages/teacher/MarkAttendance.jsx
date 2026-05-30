import { useState, useEffect, useRef } from "react";
import {
  generateAttendanceCode,
  getSessionStatus,
} from "../../services/attendanceService.js";

const EXPIRE_SECONDS = 180; // 3 minutes
const CLASS_LABELS = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];

const formatTime = (secs) => {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

// ── Single Slot Card ──────────────────────────────────────────────────────────
const SlotCard = ({ slotInfo, onGenerate, generating }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [expired, setExpired]   = useState(false);
  const timerRef                = useRef(null);

  useEffect(() => {
    clearInterval(timerRef.current);
    if (!slotInfo.expiresAt) {
      setTimeLeft(0);
      setExpired(false);
      return;
    }

    const remaining = Math.round(
      (new Date(slotInfo.expiresAt) - new Date()) / 1000
    );

    if (remaining <= 0) {
      setExpired(true);
      setTimeLeft(0);
      return;
    }

    setExpired(false);
    setTimeLeft(remaining);

    timerRef.current = setInterval(() => {
      const rem = Math.round(
        (new Date(slotInfo.expiresAt) - new Date()) / 1000
      );
      if (rem <= 0) {
        setTimeLeft(0);
        setExpired(true);
        clearInterval(timerRef.current);
      } else {
        setTimeLeft(rem);
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [slotInfo.expiresAt]);

  const active   = slotInfo.isActive && !expired;
  const hasCode  = !!slotInfo.code;
  const pct      = timeLeft > 0 ? (timeLeft / EXPIRE_SECONDS) * 100 : 0;
  const timerClr = timeLeft > 60
    ? "var(--green)"
    : timeLeft > 20
    ? "var(--amber)"
    : "var(--red)";

  return (
    <div style={{
      background:   "var(--surface)",
      border:       `1.5px solid ${active ? "var(--tch-accent)" : "var(--border)"}`,
      borderRadius: 14,
      padding:      "20px 22px",
      display:      "flex",
      flexDirection: "column",
      gap:          12,
      transition:   "border-color 0.3s, box-shadow 0.3s",
      boxShadow:    active ? "0 0 18px rgba(34,211,238,0.12)" : "none",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width:      36, height: 36, borderRadius: 10,
            background: active
              ? "rgba(34,211,238,0.15)"
              : hasCode
              ? "rgba(248,113,113,0.1)"
              : "var(--surface2)",
            display:    "flex", alignItems: "center", justifyContent: "center",
            fontSize:   16, fontWeight: 700,
            color:      active ? "var(--tch-accent)" : hasCode ? "var(--red)" : "var(--muted)",
          }}>
            {slotInfo.classSlot}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>
              {CLASS_LABELS[slotInfo.classSlot - 1]}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>
              {active
                ? `Active · ${slotInfo.studentCount} marked`
                : hasCode && !active
                ? "Expired"
                : "Not started"}
            </div>
          </div>
        </div>

        {/* Status badge */}
        <span style={{
          fontSize:     11, fontWeight: 700, padding: "3px 10px",
          borderRadius: 20,
          background:   active
            ? "rgba(52,211,153,0.12)"
            : hasCode
            ? "rgba(248,113,113,0.1)"
            : "var(--surface2)",
          color:        active ? "var(--green)" : hasCode ? "var(--red)" : "var(--muted)",
          letterSpacing: "0.04em",
        }}>
          {active ? "🟢 ACTIVE" : hasCode ? "🔴 EXPIRED" : "⬜ EMPTY"}
        </span>
      </div>

      {/* Code display when active */}
      {hasCode && (
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily:    "DM Mono, monospace",
            fontSize:      36,
            fontWeight:    800,
            letterSpacing: "0.25em",
            color:         active ? "var(--tch-accent)" : "var(--muted)",
            background:    "var(--surface2)",
            borderRadius:  10,
            padding:       "12px 0",
            filter:        active ? "none" : "opacity(0.45)",
            transition:    "all 0.3s",
          }}>
            {slotInfo.code}
          </div>

          {active && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11, color: "var(--muted)" }}>
                <span>Expires in</span>
                <span style={{ color: timerClr, fontWeight: 700, fontFamily: "DM Mono, monospace" }}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div style={{ height: 4, background: "var(--surface2)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 2,
                  background: timerClr,
                  width: `${pct}%`,
                  transition: "width 1s linear, background 0.3s",
                }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Generate button */}
      <button
        className="tch-btn primary"
        onClick={() => onGenerate(slotInfo.classSlot)}
        disabled={generating || active}
        style={{
          padding:  "9px 0",
          fontSize: 13,
          opacity:  active ? 0.55 : 1,
          cursor:   active ? "not-allowed" : "pointer",
        }}
      >
        {generating
          ? "Generating…"
          : active
          ? "✅ Code Active"
          : hasCode
          ? "🔄 Regenerate Code"
          : "⚡ Generate Code"}
      </button>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const MarkAttendance = () => {
  const [slots,      setSlots]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");
  const [apiError,   setApiError]   = useState(false);

  // Build 5 empty placeholder slots (used when API is unreachable)
  const EMPTY_SLOTS = [1, 2, 3, 4, 5].map((slot) => ({
    sessionId:    null,
    classSlot:    slot,
    code:         null,
    expiresAt:    null,
    isActive:     false,
    studentCount: 0,
  }));

  const fetchStatus = async () => {
    try {
      const res = await getSessionStatus();
      setSlots(res.data && res.data.length ? res.data : EMPTY_SLOTS);
      setApiError(false);
    } catch {
      setApiError(true);
      // Still show the 5 cards with generate buttons even if API is down
      setSlots((prev) => (prev.length ? prev : EMPTY_SLOTS));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Refresh every 15 seconds so expired/active states stay in sync
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async (classSlot) => {
    setGenerating(true);
    setError("");
    setSuccess("");
    try {
      const res = await generateAttendanceCode(classSlot);
      setSuccess(
        res.data.alreadyExists
          ? `Class ${classSlot} already has an active code: ${res.data.code}`
          : `Code generated for ${CLASS_LABELS[classSlot - 1]}!`
      );
      await fetchStatus(); // refresh all slots
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to generate code");
    } finally {
      setGenerating(false);
    }
  };

  const totalActive  = slots.filter((s) => s.isActive).length;
  const totalExpired = slots.filter((s) => !s.isActive && s.code).length;
  const totalEmpty   = 5 - totalActive - totalExpired;

  return (
    <div>
      <h1 className="tch-page-title">Mark Attendance</h1>
      <p className="tch-page-sub">
        Generate a unique code for each class. Students must enter the code within 3 minutes.
      </p>

      {/* ── Summary bar ── */}
      <div style={{
        display:       "flex",
        gap:           12,
        marginBottom:  24,
        flexWrap:      "wrap",
      }}>
        {[
          ["Active",  totalActive,  "var(--green)",        "🟢"],
          ["Expired", totalExpired, "var(--red)",          "🔴"],
          ["Pending", totalEmpty,   "var(--muted)",        "⬜"],
        ].map(([label, val, color, icon]) => (
          <div key={label} style={{
            background:   "var(--surface)",
            border:       "1px solid var(--border)",
            borderRadius: 10,
            padding:      "10px 18px",
            display:      "flex",
            alignItems:   "center",
            gap:          8,
            fontSize:     13,
          }}>
            <span>{icon}</span>
            <span style={{ fontWeight: 700, color }}>{val}</span>
            <span style={{ color: "var(--muted)" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── API connection warning ── */}
      {apiError && (
        <div style={{
          background:   "rgba(251,191,36,0.08)",
          border:       "1px solid rgba(251,191,36,0.3)",
          borderRadius: 8, padding: "10px 14px",
          fontSize:     13, color: "var(--amber)", marginBottom: 16,
        }}>
          ⚠️ Could not load session status from server — showing all 5 slots. Make sure the backend is running.
        </div>
      )}

      {/* ── Feedback messages ── */}
      {error && (
        <div style={{
          background:   "rgba(248,113,113,0.08)",
          border:       "1px solid rgba(248,113,113,0.25)",
          borderRadius: 8, padding: "10px 14px",
          fontSize:     13, color: "var(--red)", marginBottom: 16,
        }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{
          background:   "rgba(52,211,153,0.08)",
          border:       "1px solid rgba(52,211,153,0.25)",
          borderRadius: 8, padding: "10px 14px",
          fontSize:     13, color: "var(--green)", marginBottom: 16,
        }}>
          ✅ {success}
        </div>
      )}

      {/* ── 5 Slot Grid ── */}
      {loading ? (
        <div style={{ textAlign: "center", color: "var(--muted)", padding: 60 }}>
          Loading sessions…
        </div>
      ) : (
        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap:                 16,
          marginBottom:        32,
        }}>
          {slots.map((slot) => (
            <SlotCard
              key={slot.classSlot}
              slotInfo={slot}
              onGenerate={handleGenerate}
              generating={generating}
            />
          ))}
        </div>
      )}

      {/* ── How it works ── */}
      <div className="tch-panel" style={{ maxWidth: 560 }}>
        <div className="tch-panel-header">
          <span className="tch-panel-title">How it works</span>
        </div>
        <div className="tch-panel-body">
          {[
            ["🏫", "5 Classes",  "Each day has 5 class slots. Generate a code for each class you teach."],
            ["⚡", "Generate",   "Click Generate Code on the relevant class slot before class starts."],
            ["🗣️", "Share",     "Read the 6-character code aloud to students in the classroom."],
            ["📱", "Students",  "Students enter the code within 3 minutes to mark themselves present."],
            ["🌙", "Auto-mark", "Students who miss the window are marked Absent automatically."],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ display: "flex", gap: 14, marginBottom: 16 }}>
              <div style={{
                fontSize: 20, width: 40, height: 40, borderRadius: 10,
                background: "rgba(34,211,238,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
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