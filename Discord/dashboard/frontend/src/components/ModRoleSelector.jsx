import React, { useEffect, useState } from "react";

export default function ModRoleSelector({ guildId, command }) {
  const [roles, setRoles] = useState([]);
  const [allowedRoles, setAllowedRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/roles/${guildId}`)
      .then((r) => r.json())
      .then(setRoles);
  }, [guildId]);

  useEffect(() => {
    fetch(`/api/modperms/${command}`)
      .then((r) => r.json())
      .then((data) => setAllowedRoles(data.roles || []));
  }, [command]);

  const save = async () => {
    await fetch(`/api/modperms/${command}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roles: allowedRoles }),
    });
    alert("Saved!");
  };

  const toggleRole = (roleId) => {
    setAllowedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  return (
    <div>
      <h3>Select roles allowed to use /{command}</h3>
      <ul>
        {roles.map((role) => (
          <li key={role.id}>
            <label>
              <input
                type="checkbox"
                checked={allowedRoles.includes(role.id)}
                onChange={() => toggleRole(role.id)}
              />
              {role.name}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={save}>Save</button>
    </div>
  );
}