import React, { useState, useEffect } from "react";

export default function CommandManager() {
  const [commands, setCommands] = useState([]);
  const [newCommand, setNewCommand] = useState({ trigger: "", response: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/commands")
      .then(res => res.json())
      .then(setCommands)
      .finally(() => setLoading(false));
  }, []);

  const handleAddCommand = async (e) => {
    e.preventDefault();
    if (!newCommand.trigger.trim() || !newCommand.response.trim()) return;
    const resp = await fetch("/api/commands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCommand)
    });
    if (resp.ok) {
      setCommands([...commands, newCommand]);
      setNewCommand({ trigger: "", response: "" });
    }
  };

  return (
    <div>
      <h2 style={{ color: "#ff8800" }}>Custom Commands</h2>
      <form onSubmit={handleAddCommand} style={{ marginBottom: 20 }}>
        <input
          placeholder="Trigger (e.g. greet)"
          value={newCommand.trigger}
          onChange={e => setNewCommand({ ...newCommand, trigger: e.target.value })}
          style={{ marginRight: 10, padding: 8 }}
        />
        <input
          placeholder="Response"
          value={newCommand.response}
          onChange={e => setNewCommand({ ...newCommand, response: e.target.value })}
          style={{ marginRight: 10, padding: 8 }}
        />
        <button type="submit" style={{ background: "#ff8800", color: "#fff", border: "none", padding: "8px 18px", borderRadius: 4 }}>
          Add
        </button>
      </form>
      {loading ? (
        <div>Loading commands...</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {commands.map((cmd, idx) => (
            <li key={idx} style={{ marginBottom: 8, background: "#222", padding: 10, borderRadius: 4 }}>
              <strong style={{ color: "#ff8800" }}>/ {cmd.trigger}</strong>: {cmd.response}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}