import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";

export default function CustomCommands({ guildId, onChange }) {
  const [commands, setCommands] = useState([
    // Example: { name: "greet", response: "Hello there!" }
  ]);
  const [name, setName] = useState("");
  const [response, setResponse] = useState("");

  const handleAdd = () => {
    if (name.trim() && response.trim()) {
      setCommands([...commands, { name, response }]);
      setName("");
      setResponse("");
      if (onChange) onChange();
    }
  };

  return (
    <div>
      <h2 style={{ color: "#ff8800", marginBottom: "0.7em" }}>Custom Commands Creator</h2>
      <div style={{
        background: "#252b36",
        borderRadius: "8px",
        padding: "1.5em",
        marginBottom: "1.5em",
        boxShadow: "0 1px 4px #0002",
        display: "flex",
        flexDirection: "column",
        gap: "1em"
      }}>
        <input
          type="text"
          placeholder="Command name (no /)"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{
            padding: "0.7em 1em",
            borderRadius: "6px",
            border: "1.5px solid #ff8800",
            background: "#191d29",
            color: "#fff",
            fontSize: "1em"
          }}
        />
        <input
          type="text"
          placeholder="Response"
          value={response}
          onChange={e => setResponse(e.target.value)}
          style={{
            padding: "0.7em 1em",
            borderRadius: "6px",
            border: "1.5px solid #ff8800",
            background: "#191d29",
            color: "#fff",
            fontSize: "1em"
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            background: "#ff8800",
            color: "#fff",
            fontWeight: "bold",
            border: "none",
            borderRadius: "6px",
            padding: "0.8em 1.7em",
            fontSize: "1.04em",
            cursor: "pointer",
            alignSelf: "flex-end",
            display: "flex",
            alignItems: "center",
            gap: "0.5em"
          }}
        >
          <FiPlus />
          Add Command
        </button>
      </div>
      <div>
        <h3 style={{ color: "#ff8800", marginBottom: "0.5em" }}>Custom Commands List</h3>
        <ul style={{ padding: 0, listStyle: "none", margin: 0 }}>
          {commands.map((cmd, idx) => (
            <li key={idx} style={{
              background: "#232837",
              borderRadius: "7px",
              padding: "0.9em 1.2em",
              marginBottom: "0.7em",
              color: "#fff",
              boxShadow: "0 1px 4px #0002"
            }}>
              <span style={{ fontWeight: "bold", color: "#ff8800" }}>/ {cmd.name}</span>
              <span style={{ marginLeft: "1.2em", color: "#bbb" }}>{cmd.response}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}