import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const IDGeneration = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState({});
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 5000);
  };

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/requests?status=PENDING");
      setRequests(res.data.requests || []);
    } catch (err) {
      showToast("❌ Failed to load pending requests: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleApproveAndEmail = async (id, name, email) => {
    setProcessing((p) => ({ ...p, [id]: true }));
    try {
      // The backend /approve endpoint automatically:
      // 1. Generates unique ID
      // 2. Generates Temp Password
      // 3. Creates User
      // 4. Sends the Email
      const res = await api.post(`/admin/requests/${id}/approve`);
      
      showToast(`✅ Success! Credentials generated and emailed to ${name} (${email}).`);
      
      // Remove from list
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Approval failed:", err);
      showToast("❌ Failed to process request: " + (err.response?.data?.message || err.message));
    } finally {
      setProcessing((p) => ({ ...p, [id]: false }));
    }
  };

  return (
    <div>
      <h1 className="adm-page-title">ID Generation & Emailing</h1>
      <p className="adm-page-sub">
        Approve pending requests to automatically generate unique credentials and email them to the user.
      </p>

      {toast && (
        <div style={{
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 10, padding: "12px 20px", marginBottom: 20, fontSize: 14, color: "#e2e8f0",
        }}>
          {toast}
        </div>
      )}

      <div className="adm-panel">
        <div className="adm-panel-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="adm-panel-title">Pending Users ({requests.length})</span>
          <button className="adm-btn ghost" onClick={fetchRequests} disabled={loading}>
            {loading ? "Refreshing..." : "🔄 Refresh"}
          </button>
        </div>
        
        <div className="adm-panel-body" style={{ padding: 0 }}>
          {loading && requests.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--adm-muted)", fontSize: 14 }}>
              Loading pending requests...
            </div>
          ) : requests.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--adm-muted)", fontSize: 14 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📬</div>
              No pending registrations right now.
            </div>
          ) : (
            requests.map((u) => (
              <div
                key={u.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "20px 24px",
                  borderBottom: "1px solid var(--adm-border)",
                  flexWrap: "wrap",
                }}
              >
                {/* User info */}
                <div style={{ display: "flex", gap: 16, alignItems: "center", flex: 1, minWidth: 250 }}>
                  <div className={`adm-user-row-avatar ${u.role === "STUDENT" ? "s" : "t"}`}
                       style={{ width: 42, height: 42, borderRadius: 10, fontSize: 15 }}>
                    {(u.fullName || "?")[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 15, color: "var(--adm-text)" }}>
                      {u.fullName}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--adm-muted)", marginTop: 2 }}>
                      {u.department || "No Dept"} · {u.email}
                    </div>
                    <span className={`adm-badge ${u.role?.toLowerCase()}`} style={{ marginTop: 8, display: "inline-block" }}>
                      {u.role === "TEACHER" ? "📚 Teacher" : "🎓 Student"}
                    </span>
                  </div>
                </div>

                {/* Info Text */}
                <div style={{ flex: 1, minWidth: 200, color: "var(--adm-muted)", fontSize: 12, lineHeight: 1.5 }}>
                  Approving this will instantly generate a unique ID (e.g., {u.role === "TEACHER" ? "TCH-" : "STD-"}) and password, and automatically email it to <strong>{u.email}</strong>.
                </div>

                {/* Actions */}
                <div style={{ minWidth: 160, textAlign: "right" }}>
                  <button
                    className="adm-btn primary"
                    onClick={() => handleApproveAndEmail(u.id, u.fullName, u.email)}
                    disabled={processing[u.id]}
                    style={{ width: "100%", padding: "10px 16px" }}
                  >
                    {processing[u.id] ? "Processing..." : "✉️ Generate & Email"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default IDGeneration;