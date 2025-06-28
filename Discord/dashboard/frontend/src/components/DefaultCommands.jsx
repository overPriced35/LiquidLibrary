import React from "react";
import { FiCheckCircle, FiCircle } from "react-icons/fi";

export default function DefaultCommands({ commands, onToggle }) {
  return (
    <div>
      <h2 style={{ color: "#ff8800", marginBottom: "0.7em" }}>Default Commands</h2>
      <ul style={{ padding: 0, listStyle: "none", margin: 0 }}>
        {commands.map((cmd, idx) => (
          <li key={cmd.name} style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1em",
            background: "#252b36",
            borderRadius: "8px",
            padding: "1em 1.2em",
            boxShadow: "0 1px 4px #0002"
          }}>
            <span style={{
              fontWeight: "bold",
              fontSize: "1.12em",
              color: "#fff",
              minWidth: "100px"
            }}>/ {cmd.name}</span>
            <span style={{ flex: 1 }} />
            <button
              aria-label={cmd.enabled ? "Disable" : "Enable"}
              onClick={() => onToggle(idx)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.5em",
                color: cmd.enabled ? "#ff8800" : "#666",
                marginRight: "0.9em"
              }}
            >
              {cmd.enabled ? <FiCheckCircle /> : <FiCircle />}
            </button>
            <span style={{ color: cmd.enabled ? "#ff8800" : "#bbb", fontWeight: "bold", fontSize: "1em" }}>
              {cmd.enabled ? "Enabled" : "Disabled"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}