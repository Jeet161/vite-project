import { useState } from "react";
import { validateUniqueId } from "../../services/authService";

const UniqueIDValidator = ({ role, onValidated }) => {
  const [id, setId]         = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | valid | invalid
  const [message, setMessage] = useState("");

  const handleValidate = async () => {
    if (!id.trim()) return;
    setStatus("loading");
    try {
      const res = await validateUniqueId(id.trim(), role);
      setStatus("valid");
      setMessage(res.data.message || "ID verified successfully");
      onValidated?.(id.trim(), res.data);
    } catch (err) {
      setStatus("invalid");
      setMessage(
        err.response?.data?.message || "Invalid ID. Please check and try again."
      );
    }
  };

  return (
    <div className="uid-validator">
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={id}
          onChange={(e) => {
            setId(e.target.value.toUpperCase());
            setStatus("idle");
          }}
          placeholder={role === "student" ? "STU-XXXX" : "TCH-XXXX"}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "8px",
            border: `1px solid ${
              status === "valid"
                ? "#22c55e"
                : status === "invalid"
                ? "#ef4444"
                : "#d1d5db"
            }`,
            fontSize: "14px",
            letterSpacing: "0.05em",
            outline: "none",
          }}
        />
        <button
          onClick={handleValidate}
          disabled={!id.trim() || status === "loading"}
          style={{
            padding: "10px 18px",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
            opacity: !id.trim() || status === "loading" ? 0.6 : 1,
          }}
        >
          {status === "loading" ? "..." : "Verify"}
        </button>
      </div>
      {message && (
        <p style={{
          marginTop: "6px",
          fontSize: "12px",
          color: status === "valid" ? "#16a34a" : "#dc2626",
        }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default UniqueIDValidator;
