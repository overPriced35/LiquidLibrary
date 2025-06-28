import React, { useState } from "react";
import Tabs from "./components/Tabs";
import StatusUpdater from "./components/StatusUpdater";
import CommandManager from "./components/CommandManager";
import { FaCog, FaList, FaShieldAlt, FaClipboardList } from "react-icons/fa";

// Placeholder components for future tabs
function ModerationTab() {
  return <div style={{ color: "#aaa" }}>Moderation features coming soon!</div>;
}
function LoggingTab() {
  return <div style={{ color: "#aaa" }}>Logging features coming soon!</div>;
}

const TAB_DEFS = [
  { label: "General Settings", icon: <FaCog /> },
  { label: "Commands", icon: <FaList /> },
  { label: "Moderation", icon: <FaShieldAlt /> },
  { label: "Logging", icon: <FaClipboardList /> }
];

function App() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ color: "#ff8800", marginBottom: 24 }}>LiquidLibrary Dashboard</h1>
      <Tabs tabs={TAB_DEFS} activeTab={activeTab} onTabChange={setActiveTab} />
      <div style={{ paddingTop: 24 }}>
        {activeTab === 0 && <StatusUpdater />}
        {activeTab === 1 && <CommandManager />}
        {activeTab === 2 && <ModerationTab />}
        {activeTab === 3 && <LoggingTab />}
      </div>
    </div>
  );
}

export default App;