import React, { useState } from "react";

export default function TeamSelect() {

  const [teamName, setTeamName] = useState("");

  const handleCreateTeam = () => {
    if (!teamName) {
      alert("Enter a team name");
      return;
    }

    try {
      // Save team to localStorage
      localStorage.setItem("team", teamName);

      //  Force navigation so app updates
      window.location.href = "/event-select";

    } catch (err) {
      console.error(err);
      alert("Error creating team");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h1>Create or Join Team</h1>

      <input
        placeholder="Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        style={{ width: "100%", padding: "12px", marginBottom: "20px" }}
      />

      <button
        onClick={handleCreateTeam}
        style={{ width: "100%", padding: "15px" }}
      >
        Create Team
      </button>
    </div>
  );
}
