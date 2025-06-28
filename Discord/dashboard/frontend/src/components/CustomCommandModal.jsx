import React, { useState } from "react";

const ACTIONS = [
  "Send Message",
  "Send Channel Message",
  "DM User",
  "Toggle Roles",
  "Add Roles",
  "Remove Roles",
  "Set Roles"
];

export default function CustomCommandModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [action, setAction] = useState(ACTIONS[0]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name: name.trim(), action });
  }

  return (
    <div style={{
      position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "#23272F", borderRadius: 10, padding: 32, width: 340,
        boxShadow: "0 2px 18px #0009", display: "flex", flexDirection: "column", gap: 18
      }}>
        <h3 style={{ margin: 0, color: "#ff8800" }}>Create Custom Command</h3>
        <input
          placeholder="Command name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ padding: 10, borderRadius: 5, border: "1px solid #444", background: "#17191d", color: "#fff" }}
        />
        <select
          value={action}
          onChange={e => setAction(e.target.value)}
          style={{ padding: 10, borderRadius: 5, border: "1px solid #444", background: "#17191d", color: "#fff" }}
        >
          {ACTIONS.map(a => <option key={a}>{a}</option>)}
        </select>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button type="button" onClick={onClose} style={{
            background: "#333", color: "#fff", border: "none", borderRadius: 5, padding: "8px 18px", cursor: "pointer"
          }}>Cancel</button>
          <button type="submit" style={{
            background: "#387EF4", color: "#fff", border: "none", borderRadius: 5, padding: "8px 18px", cursor: "pointer"
          }}>Create</button>
        </div>
      </form>
    </div>
  );
}