import React, { useState } from "react";
import { FaListAlt, FaRegListAlt } from "react-icons/fa";
import CustomCommands from "./CustomCommands";
import DefaultCommands from "./DefaultCommands";

export default function CommandManager() {
  const [subPage, setSubPage] = useState(null);

  if (subPage === "custom") return <CustomCommands onBack={() => setSubPage(null)} />;
  if (subPage === "default") return <DefaultCommands onBack={() => setSubPage(null)} />;

  return (
    <div style={{ maxWidth: 600, margin: "32px auto" }}>
      <div style={{ marginBottom: 20 }}>
        <Card
          icon={<FaListAlt size={28} />}
          title="Custom commands"
          description="Create and manage your own commands."
          actionLabel="Create new command"
          onAction={() => setSubPage("custom")}
          onClick={() => setSubPage("custom")}
        />
      </div>
      <div>
        <Card
          icon={<FaRegListAlt size={28} />}
          title="Default commands"
          description="Update permissions, aliases and more for all default commands. You can also enable/disable slash commands here."
          onClick={() => setSubPage("default")}
          rightArrow
        />
      </div>
    </div>
  );
}

function Card({ icon, title, description, actionLabel, onAction, rightArrow, onClick }) {
  return (
    <div
      style={{
        background: "#23272F",
        borderRadius: 10,
        padding: "24px 24px",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 2px 8px #0003",
        cursor: "pointer",
        position: "relative"
      }}
      onClick={onClick}
    >
      <div style={{ marginRight: 20 }}>{icon}</div>
      <div style={{ flexGrow: 1 }}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>{title}</div>
        <div style={{ color: "#bbb", fontSize: 14 }}>{description}</div>
      </div>
      {actionLabel && (
        <button
          onClick={e => { e.stopPropagation(); onAction(); }}
          style={{
            background: "#387EF4",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            padding: "8px 18px",
            fontWeight: 500,
            fontSize: 15,
            cursor: "pointer"
          }}
        >
          {actionLabel}
        </button>
      )}
      {rightArrow && (
        <span style={{ fontSize: 22, color: "#888", marginLeft: 8 }}>&#8250;</span>
      )}
    </div>
  );
}