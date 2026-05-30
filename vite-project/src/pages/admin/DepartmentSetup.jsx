// ── DepartmentSetup.jsx ──────────────────────────────────────────

// This is locked to the Enum defined in schema.prisma (Option B)
const DEPTS = [
  { name: "Computer Science and Engineering", code: "CSE" },
  { name: "Electronics and Communication",    code: "ECE" },
  { name: "Electrical Engineering",           code: "EE" },
  { name: "Mechanical Engineering",           code: "ME" },
  { name: "Civil Engineering",                code: "CE" },
  { name: "Information Technology",           code: "IT" },
  { name: "Chemical Engineering",             code: "CHE" },
  { name: "Bio-Technology",                   code: "BT" },
  { name: "Aerospace Engineering",            code: "AE" },
  { name: "Metallurgical and Materials",      code: "MME" }
];

const DepartmentSetup = () => {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 className="adm-page-title">Departments</h1>
          <p className="adm-page-sub">
            These departments are structural pillars encoded into the database. 
            To add a new department to the platform, contact the engineering team to deploy a database migration.
          </p>
        </div>
      </div>

      <div className="adm-panel">
        <table className="adm-table">
          <thead>
            <tr><th>Department Name</th><th>System Code</th></tr>
          </thead>
          <tbody>
            {DEPTS.map((d, i) => (
              <tr key={i}>
                <td>{d.name}</td>
                <td>
                  <span className="adm-badge" style={{ fontFamily: "monospace", padding: "4px 8px" }}>
                    {d.code}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentSetup;