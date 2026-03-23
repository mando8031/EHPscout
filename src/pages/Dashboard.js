import React, { useEffect, useState } from "react";
import { getScoutEntries, clearScoutEntries } from "../utils/localDB";
import { calculateTeamStats } from "../utils/statsCalculator";

const Dashboard = () => {

  const [stats, setStats] = useState([]);

  useEffect(() => {
    const data = getScoutEntries();
    const calculated = calculateTeamStats(data);
    setStats(calculated);
  }, []);

  return (
    <div style={{ padding: "20px" }}>

      <h1>Dashboard</h1>

      <button onClick={()=>{
        clearScoutEntries();
        window.location.reload();
      }}>
        Clear Data
      </button>

      {stats.map(team => (
        <div key={team.team}>
          Team {team.team} | Auton: {team.autonAvg} | Accuracy: {team.accuracyAvg}
        </div>
      ))}

    </div>
  );
};

export default Dashboard;
