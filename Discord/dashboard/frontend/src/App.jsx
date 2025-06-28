import React, { useState } from "react";
import { FiHome, FiSettings, FiCommand, FiShield, FiBookOpen } from "react-icons/fi";
import OverviewDashboard from "./components/OverviewDashboard";
import StatusUpdater from "./components/StatusUpdater";
import DefaultCommands from "./components/DefaultCommands";
import CustomCommands from "./components/CustomCommands";
import ModerationDashboard from "./components/ModerationDashboard";

// Replace with your actual guild/server ID logic if needed
const GUILD_ID = "YOUR_GUILD_ID";

const TABS = [
  { id: "overview", label: "Overview", icon: <FiHome /> },
  { id: "general", label: "General Settings", icon: <FiSettings /> },
  { id: "commands", label: "Commands", icon: <FiCommand /> },
  { id: "moderation", label: "Moderation", icon: <FiShield /> },
  { id: "logging", label: "Logging", icon: <FiBookOpen /> },
];

function CommandsTab({ guildId }) {
  const [activeSubpage, setActiveSubpage] = useState("default");
  const [showSave, setShowSave] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(false);

  // Example state for default commands
  const [commands, setCommands] = useState([
    { name: "info", enabled: true },
    { name: "hello", enabled: true },
    { name: "ping", enabled: true },
  ]);

  // For demonstration: Custom commands creator placeholder
  const handleCustomCommandChange = () => {
    setPendingChanges(true);
    setShowSave(true);
  };

  // When a toggle is clicked
  const handleCommandToggle = idx => {
    setCommands(prev => {
      const updated = prev.map((cmd, i) =>
        i === idx ? { ...cmd, enabled: !cmd.enabled } : cmd
      );
      setPendingChanges(true);
      setShowSave(true);
      return updated;
    });
  };

  // Simulate save action
  const handleSave = () => {
    setPendingChanges(false);
    setShowSave(false);
    // Add your save logic here (API call, etc)
  };

  return (
    <section>
      <nav style={{ marginBottom: "1.2em", display: "flex", gap: "0.6em" }}>
        <button
          onClick={() => setActiveSubpage("default")}
          style={{
            background: activeSubpage === "default" ? "#ff8800" : "#252b36",
            color: activeSubpage === "default" ? "#fff" : "#ff8800",
            fontWeight: "bold",
            border: "none",
            padding: "0.6em 1.1em",
            borderRadius: "8px",
            fontSize: "1em",
            cursor: "pointer",
            transition: "background 0.2s, color 0.2s",
            boxShadow: activeSubpage === "default" ? "0 2px 8px #ff880055" : "none",
          }}
        >
          Default Commands
        </button>
        <button
          onClick={() => setActiveSubpage("custom")}
          style={{
            background: activeSubpage === "custom" ? "#ff8800" : "#252b36",
            color: activeSubpage === "custom" ? "#fff" : "#ff8800",
            fontWeight: "bold",
            border: "none",
            padding: "0.6em 1.1em",
            borderRadius: "8px",
            fontSize: "1em",
            cursor: "pointer",
            transition: "background 0.2s, color 0.2s",
            boxShadow: activeSubpage === "custom" ? "0 2px 8px #ff880055" : "none",
          }}
        >
          Custom Commands
        </button>
      </nav>
      <div style={{
        background: "#232837",
        borderRadius: "14px",
        padding: "2em",
        boxShadow: "0 2px 16px #0002",
        position: "relative"
      }}>
        {activeSubpage === "default" && (
          <DefaultCommands
            commands={commands}
            onToggle={handleCommandToggle}
          />
        )}
        {activeSubpage === "custom" && (
          <CustomCommands
            guildId={guildId}
            onChange={handleCustomCommandChange}
          />
        )}
        {/* Save button pops up if there are pending changes */}
        {showSave && (
          <button
            onClick={handleSave}
            style={{
              position: "absolute",
              bottom: 20,
              right: 30,
              background: "#ff8800",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              borderRadius: "8px",
              padding: "0.8em 2em",
              fontSize: "1.05em",
              cursor: "pointer",
              boxShadow: "0 2px 8px #ff880088",
              transition: "transform 0.2s, opacity 0.2s",
              opacity: pendingChanges ? 1 : 0,
              transform: pendingChanges ? "translateY(0)" : "translateY(25px)",
              zIndex: 2,
            }}
          >
            Save
          </button>
        )}
      </div>
    </section>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "Inter, Roboto, Arial, sans-serif",
      background: "#1b202b",
      color: "#fff"
    }}>
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: "240px",
          background: "#232837",
          color: "#fff",
          padding: "2em 1em 1em 2em",
          minHeight: "100vh",
          boxSizing: "border-box",
          borderRight: "2px solid #232837",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ fontSize: "1.5em", marginBottom: "2.2em", letterSpacing: 1, color: "#ff8800" }}>
          Server Dashboard
        </h2>
        <nav>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {TABS.map(tab => (
              <li key={tab.id} style={{ marginBottom: "0.55em" }}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: activeTab === tab.id ? "#ff8800" : "transparent",
                    color: activeTab === tab.id ? "#fff" : "#ff8800",
                    fontWeight: activeTab === tab.id ? "bold" : "normal",
                    border: "none",
                    padding: "0.8em 1em 0.8em 0.9em",
                    borderRadius: "8px",
                    cursor: "pointer",
                    width: "100%",
                    fontSize: "1.08em",
                    textAlign: "left",
                    transition: "background 0.18s, color 0.18s",
                    boxShadow: activeTab === tab.id ? "0 2px 8px #ff880055" : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.7em"
                  }}
                >
                  <span style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "1.23em"
                  }}>{tab.icon}</span>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div style={{ flex: 1 }} />
        <footer style={{ color: "#888", fontSize: "0.94em", textAlign: "center", marginTop: "2em" }}>
          &copy; {new Date().getFullYear()} YourBotName
        </footer>
      </aside>
      {/* Main Content */}
      <main
        style={{
          flex: 1,
          background: "#1b202b",
          padding: "3em 3.5em 2em 3.5em",
          minHeight: "100vh",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {activeTab === "overview" && <OverviewDashboard guildId={GUILD_ID} />}
        {activeTab === "general" && <StatusUpdater guildId={GUILD_ID} />}
        {activeTab === "commands" && <CommandsTab guildId={GUILD_ID} />}
        {activeTab === "moderation" && <ModerationDashboard guildId={GUILD_ID} />}
        {activeTab === "logging" && (
          <section>
            <h2 style={{ color: "#ff8800" }}>Logging</h2>
            <p style={{ fontSize: "1.3em", color: "#888", marginTop: "1em" }}>
              (coming soon)
            </p>
          </section>
        )}
      </main>
    </div>
  );
}