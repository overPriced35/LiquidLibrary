import React from "react";
export default function StatusUpdater({ guildId }) {
  return (
    <div style={{
      background: "#232837",
      borderRadius: "14px",
      padding: "2.5em",
      boxShadow: "0 2px 16px #0002"
    }}>
      <h1 style={{ color: "#ff8800", marginBottom: "1em" }}>General Settings</h1>
      <p>Status Updater for guild/server: <span style={{ color: "#ff8800" }}>{guildId}</span></p>
      <p style={{ color: "#bbb", marginTop: "2em" }}>Add your status update controls and general settings here.</p>
    </div>
  );
}