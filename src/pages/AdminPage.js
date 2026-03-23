import React from "react";
import { getTeams } from "../utils/localTeams";

const AdminPage = () => {

  const teams = getTeams();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Panel</h1>

      {teams.map(team => (
        <div key={team.id}>
          <strong>{team.name}</strong>
          <div>Members: {team.members.join(", ")}</div>
        </div>
      ))}

    </div>
  );
};

export default AdminPage;
