const HEALTH = [
  { label: "API Server",     status: "online",  uptime: "99.9%", latency: "42ms"  },
  { label: "Database",       status: "online",  uptime: "99.7%", latency: "12ms"  },
  { label: "Email Service",  status: "online",  uptime: "98.2%", latency: "120ms" },
  { label: "File Storage",   status: "warning", uptime: "95.1%", latency: "220ms" },
  { label: "Exam Engine",    status: "online",  uptime: "99.5%", latency: "60ms"  },
];

const COLOR = { online: "var(--adm-green)", warning: "var(--adm-amber)", offline: "var(--adm-red)" };

const SystemHealth = () => (
  <div>
    <h1 className="adm-page-title">System Health</h1>
    <p className="adm-page-sub">Monitor all backend services.</p>

    <div className="adm-stats" style={{ marginBottom: 28 }}>
      {[
        { label: "Services Online", value: HEALTH.filter((h) => h.status === "online").length, color: "green" },
        { label: "Warnings",        value: HEALTH.filter((h) => h.status === "warning").length, color: "amber" },
        { label: "Offline",         value: HEALTH.filter((h) => h.status === "offline").length, color: "red" },
      ].map((s) => (
        <div className="adm-stat-card" key={s.label}>
          <div className="adm-stat-value">{s.value}</div>
          <div className="adm-stat-label">{s.label}</div>
        </div>
      ))}
    </div>

    <div className="adm-panel">
      <table className="adm-table">
        <thead>
          <tr><th>Service</th><th>Status</th><th>Uptime</th><th>Latency</th></tr>
        </thead>
        <tbody>
          {HEALTH.map((h, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 500 }}>{h.label}</td>
              <td>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: COLOR[h.status],
                    boxShadow: `0 0 6px ${COLOR[h.status]}`,
                    display: "inline-block",
                  }} />
                  <span style={{ color: COLOR[h.status], fontWeight: 500, textTransform: "capitalize" }}>
                    {h.status}
                  </span>
                </span>
              </td>
              <td>{h.uptime}</td>
              <td>{h.latency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default SystemHealth;