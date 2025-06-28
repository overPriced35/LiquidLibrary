import React from "react";

export default function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div style={{ display: "flex", borderBottom: "2px solid #333", marginBottom: 24 }}>
      {tabs.map((tab, idx) => (
        <button
          key={tab.label}
          onClick={() => onTabChange(idx)}
          style={{
            background: "none",
            border: "none",
            outline: "none",
            padding: "12px 28px",
            fontSize: 18,
            cursor: "pointer",
            color: activeTab === idx ? "#ff8800" : "#fff",
            borderBottom: activeTab === idx ? "3px solid #ff8800" : "3px solid transparent",
            fontWeight: activeTab === idx ? "bold" : "normal",
            display: "flex",
            alignItems: "center",
            gap: 10,
            transition: "border-bottom 0.2s"
          }}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}