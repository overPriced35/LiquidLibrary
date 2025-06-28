import React from "react";
export default function OverviewDashboard({ guildId }) {
  return (
    <div style={{
      background: "#232837",
      borderRadius: "14px",
      padding: "2.5em",
      boxShadow: "0 2px 16px #0002"
    }}>
      <h1 style={{ color: "#ff8800", marginBottom: "1em" }}>Overview</h1>
      <p>This is the overview page for guild/server: <span style={{ color: "#ff8800" }}>{guildId}</span></p>
      <p style={{ color: "#bbb", marginTop: "2em" }}>Add your overview widgets and stats here.</p>
    </div>
  );
}