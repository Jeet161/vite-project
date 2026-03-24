import { useState, useEffect, useCallback } from "react";
import {
  getRegistrationRequests,
  approveRegistrationRequest,
  rejectRegistrationRequest,
} from "../../services/adminService";

const statusColor = {
  PENDING:  { bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.35)",  text: "#f59e0b" },
  APPROVED: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.35)", text: "#10b981" },
  REJECTED: { bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.35)",  text: "#ef4444" },
};

const RegistrationRequests = () => {
  const [requests, setRequests]     = useState([]);
  const [filter, setFilter]         = useState("PENDING");
  const [loading, setLoading]       = useState(false);
  const [actionId, setActionId]     = useState(null); // ID of request being actioned
  const [toast, setToast]           = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getRegistrationRequests(filter);
      setRequests(res.data.requests || []);
    } catch (err) {
      showToast("❌ Failed to load requests: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      const res = await approveRegistrationRequest(id);
      showToast(`✅ ${res.data.message}`);
      fetchRequests();
    } catch (err) {
      showToast("❌ " + (err.response?.data?.message || "Approval failed"));
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this request?")) return;
    setActionId(id);
    try {
      const res = await rejectRegistrationRequest(id);
      showToast(`🚫 ${res.data.message}`);
      fetchRequests();
    } catch (err) {
      showToast("❌ " + (err.response?.data?.message || "Rejection failed"));
    } finally {
      setActionId(null);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
      " " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={{ padding: "0 4px" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary, #fff)", margin: 0, marginBottom: 6 }}>
          📋 Registration Requests
        </h2>
        <p style={{ color: "var(--text-secondary, #a0aec0)", fontSize: 14, margin: 0 }}>
          Review and manage pending teacher/student registration requests. Approved requests auto-generate credentials and email them.
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 10, padding: "12px 20px", marginBottom: 20,
          fontSize: 14, color: "#e2e8f0",
        }}>
          {toast}
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["PENDING", "APPROVED", "REJECTED", ""].map((s) => (
          <button
            key={s || "ALL"}
            onClick={() => setFilter(s)}
            style={{
              padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
              border: filter === s
                ? "1px solid var(--accent, #6c63ff)"
                : "1px solid rgba(255,255,255,0.1)",
              background: filter === s
                ? "rgba(108,99,255,0.18)"
                : "rgba(255,255,255,0.04)",
              color: filter === s ? "var(--accent, #6c63ff)" : "var(--text-secondary, #a0aec0)",
              transition: "all 0.2s",
            }}
          >
            {s || "All"}
          </button>
        ))}
        <button
          onClick={fetchRequests}
          style={{
            marginLeft: "auto", padding: "7px 16px", borderRadius: 8, fontSize: 13,
            border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
            color: "var(--text-secondary, #a0aec0)", cursor: "pointer",
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary, #a0aec0)" }}>
          Loading requests...
        </div>
      ) : requests.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 0",
          color: "var(--text-secondary, #a0aec0)", fontSize: 15,
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          No {filter.toLowerCase() || ""} requests found.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {requests.map((req) => {
            const sc = statusColor[req.status] || statusColor.PENDING;
            const isActioning = actionId === req.id;
            return (
              <div
                key={req.id}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14,
                  padding: "20px 24px",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 16,
                  alignItems: "center",
                }}
              >
                {/* Left: info */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary, #fff)" }}>
                      {req.name}
                    </span>
                    {/* Role badge */}
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                      background: req.role === "TEACHER" ? "rgba(59,130,246,0.15)" : "rgba(168,85,247,0.15)",
                      border: req.role === "TEACHER" ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(168,85,247,0.4)",
                      color: req.role === "TEACHER" ? "#60a5fa" : "#c084fc",
                    }}>
                      {req.role === "TEACHER" ? "📚 Teacher" : "🎓 Student"}
                    </span>
                    {/* Status badge */}
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                      background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text,
                    }}>
                      {req.status}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", fontSize: 13, color: "var(--text-secondary, #a0aec0)" }}>
                    <span>📧 {req.email}</span>
                    {req.phone && <span>📞 {req.phone}</span>}
                    {req.department && <span>🏛️ {req.department}</span>}
                    <span>🕐 {formatDate(req.createdAt)}</span>
                  </div>
                </div>

                {/* Right: actions */}
                <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                  {req.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleApprove(req.id)}
                        disabled={isActioning}
                        style={{
                          padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                          background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)",
                          color: "#10b981", cursor: isActioning ? "not-allowed" : "pointer",
                          opacity: isActioning ? 0.6 : 1, transition: "all 0.2s",
                        }}
                      >
                        {isActioning ? "⏳" : "✅ Approve"}
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        disabled={isActioning}
                        style={{
                          padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                          color: "#ef4444", cursor: isActioning ? "not-allowed" : "pointer",
                          opacity: isActioning ? 0.6 : 1, transition: "all 0.2s",
                        }}
                      >
                        {isActioning ? "⏳" : "🚫 Reject"}
                      </button>
                    </>
                  )}
                  {req.status === "APPROVED" && (
                    <span style={{ fontSize: 13, color: "#10b981", fontWeight: 600 }}>
                      ✅ Approved {req.approvedAt ? formatDate(req.approvedAt) : ""}
                    </span>
                  )}
                  {req.status === "REJECTED" && (
                    <span style={{ fontSize: 13, color: "#ef4444", fontWeight: 600 }}>
                      🚫 Rejected
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RegistrationRequests;
