import React, { useState, useEffect } from "react";

export default function StatusUpdater() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch("/api/status")
      .then(res => res.json())
      .then(data => {
        setStatus(data.status_text || "");
        setLoading(false);
      });
  }, []);

  const updateStatus = async (e) => {
    e.preventDefault();
    const resp = await fetch("/api/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status_text: status })
    });
    if (resp.ok) setMessage("Status updated!");
    else setMessage("Error updating status.");
  };

  if (loading) return <div>Loading status...</div>;

  return (
    <form onSubmit={updateStatus} style={{ maxWidth: 400 }}>
      <h2 style={{ color: "#ff8800" }}>Bot Status</h2>
      <input
        type="text"
        value={status}
        onChange={e => setStatus(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
        placeholder="Set bot status..."
      />
      <button type="submit" style={{ background: "#ff8800", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 4 }}>
        Update Status
      </button>
      {message && <div style={{ color: "#4caf50", marginTop: 10 }}>{message}</div>}
    </form>
  );
}