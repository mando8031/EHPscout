import React, { useEffect, useState } from "react";

export default function Dashboard() {

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("scoutingData") || "[]");

    const grouped = {};

    // group by team
    data.forEach(entry => {
      if (!grouped[entry.team]) {
        grouped[entry.team] = [];
      }
      grouped[entry.team].push(entry);
    });

    // score teams
    const ranked = Object.keys(grouped).map(team => {
      const entries = grouped[team];

      let totalScore = 0;

      entries.forEach(e => {
        const accuracy = Number(e.accuracy || 0);
        const speed = Number(e.shootingSpeed || 0);
        const intake = Number(e.intakeSpeed || 0);

        let climbScore = 0;
        if (e.climb?.includes("L3")) climbScore = 5;
        else if (e.climb?.includes("L2")) climbScore = 4;
        else if (e.climb?.includes("L1")) climbScore = 3;
        else if (e.climb?.includes("Tried and Failed")) climbScore = 1;

        totalScore += accuracy + speed + intake + climbScore;
      });

      const avgScore = totalScore / entries.length;

      return {
        team,
        entries,
        score: avgScore
      };
    });

    // sort best → worst
    ranked.sort((a, b) => b.score - a.score);

    setTeams(ranked);

  }, []);

  return (
    <div style={{ padding: "10px", color: "white" }}>
      <h2>Team Rankings</h2>

      {/* TEAM LIST */}
      {!selectedTeam && (
        <div>
          {teams.map(t => (
            <div
              key={t.team}
              onClick={() => setSelectedTeam(t)}
              style={{
                background: "#1e1e1e",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "10px",
                cursor: "pointer"
              }}
            >
              <h3>Team {t.team.replace("frc", "")}</h3>
              <p>Score: {t.score.toFixed(2)}</p>
              <p>Matches Scouted: {t.entries.length}</p>
            </div>
          ))}
        </div>
      )}

      {/* TEAM DETAILS */}
      {selectedTeam && (
        <div>

          <button
            onClick={() => setSelectedTeam(null)}
            style={{
              marginBottom: "10px",
              padding: "10px",
              width: "100%"
            }}
          >
            Back
          </button>

          <h2>Team {selectedTeam.team.replace("frc", "")}</h2>

          {selectedTeam.entries.map((e, i) => (
            <div
              key={i}
              style={{
                background: "#1e1e1e",
                padding: "10px",
                borderRadius: "10px",
                marginBottom: "10px"
              }}
            >
              <p><b>Match:</b> {e.match}</p>
              <p><b>Auton:</b> {e.auton?.join(", ")}</p>
              <p><b>Focus:</b> {e.focus?.join(", ")}</p>
              <p><b>Climb:</b> {e.climb?.join(", ")}</p>
              <p><b>Failures:</b> {e.failures?.join(", ")}</p>
              <p><b>Accuracy:</b> {e.accuracy}</p>
              <p><b>Speed:</b> {e.shootingSpeed}</p>
              <p><b>Intake:</b> {e.intakeSpeed}</p>
              <p><b>Notes:</b> {e.notes}</p>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}
