import React, { useEffect, useState } from "react";

// Your moderation commands
const moderationCommands = [
  { name: "ban", description: "Ban a user from the server" },
  { name: "kick", description: "Kick a user from the server" },
  { name: "mute", description: "Mute a user in voice/text" },
  { name: "warn", description: "Send a warning to a user" },
];

// Fetch roles from your backend API
async function fetchRoles(guildId) {
  const res = await fetch(`/api/roles/${guildId}`);
  if (!res.ok) throw new Error("Failed to fetch roles");
  return await res.json();
}

export default function ModerationDashboard({ guildId }) {
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoles(guildId)
      .then(setRoles)
      .catch(e => setError(e.message));
  }, [guildId]);

  return (
    <div>
      <h2 style={{ color: "#ff8800", fontWeight: 800, fontSize: "2em" }}>Moderation Commands</h2>
      {error && <div style={{ color: "red", margin: "1em 0" }}>Error loading roles: {error}</div>}
      <div style={{
        marginTop: "2.2em",
        display: "grid",
        gap: "1.7em",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))"
      }}>
        {moderationCommands.map(cmd => (
          <div
            key={cmd.name}
            style={{
              background: "#232837",
              borderRadius: "12px",
              padding: "1.5em 1.4em",
              boxShadow: "0 2px 10px #0002",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: "1.13em", color: "#fff" }}>
              /{cmd.name}
            </div>
            <div style={{ color: "#ccc", margin: "0.5em 0 1.1em 0", fontSize: "0.97em" }}>
              {cmd.description}
            </div>
            <label style={{ color: "#ff8800", fontWeight: 500, marginBottom: "0.45em" }}>
              Permissions
            </label>
            <select
              style={{
                padding: "0.5em 1em",
                borderRadius: "7px",
                background: "#191d29",
                color: "#fff",
                border: "1.8px solid #ff8800",
                fontSize: "1em",
                outline: "none",
              }}
              defaultValue={roles[0]?.id || ""}
            >
              {roles.length === 0 ? (
                <option disabled>No roles found</option>
              ) : (
                roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))
              )}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}