import React, { useEffect, useState } from "react";
import { getScoutEntries, clearScoutEntries } from "../utils/localDB";
import { calculateTeamStats } from "../utils/statsCalculator";

const Dashboard = () => {

  const [stats, setStats] = useState([]);

  useEffect(() => {
    const data = getScoutEntries();
    console.log("Loaded local data:", data);

    const calculated = calculateTeamStats(data);
    setStats(calculated);
  }, []);

  return (
    <div style={{ padding: "20px" }}>

      <h1>Dashboard</h1>

      <button
        onClick={() => {
          clearScoutEntries();
          window.location.reload();
        }}
        style={{
          marginBottom: "20px",
          padding: "10px",
          fontSize: "16px"
        }}
      >
        Clear Data
      </button>

      {stats.length === 0 && (
        <p>No scouting data yet.</p>
      )}

      {stats.map(team => (
        <div
          key={team.team}
          style={{
            padding: "12px",
            marginBottom: "10px",
            background: "#2c2c2c",
            borderRadius: "8px"
          }}
        >
          <strong>Team {team.team}</strong><br/>
          Auton Avg: {team.autonAvg}<br/>
          Accuracy Avg: {team.accuracyAvg}
        </div>
      ))}

    </div>
  );
};

export default Dashboard;
