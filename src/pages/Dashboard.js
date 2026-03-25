import React, { useEffect, useState } from "react";

export default function Dashboard() {

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventKey = localStorage.getItem("selectedEvent");

    if (!eventKey) {
      setLoading(false);
      return;
    }

    const data = JSON.parse(localStorage.getItem("scoutingData") || "[]");

    const filtered = data.filter(d => d.event === eventKey);

    if (filtered.length === 0) {
      setTeams([]);
      setLoading(false);
      return;
    }

    const grouped = {};

    filtered.forEach(entry => {
      if (!grouped[entry.team]) grouped[entry.team] = [];
      grouped[entry.team].push(entry);
    });

    const ranked = Object.keys(grouped).map(team => ({
      team,
      entries: grouped[team]
    }));

    setTeams(ranked);
    setLoading(false);

  }, []);

  // 🔴 LOADING
  if (loading) {
    return <div style={{ padding: "20px", color: "white" }}>Loading...</div>;
  }

  // 🔴 NO EVENT
  if (!localStorage.getItem("selectedEvent")) {
    return <div style={{ padding: "20px", color: "white" }}>No event selected</div>;
  }

  // 🔴 NO DATA
  if (teams.length === 0) {
    return <div style={{ padding: "20px", color: "white" }}>No data for this event yet</div>;
  }

  return (
    <div style={{ padding: "10px", color: "white" }}>
      <h2>Team Rankings</h2>

      {!selectedTeam && teams.map(t => (
        <div key={t.team}
          onClick={() => setSelectedTeam(t)}
          style={{
            background: "#1e1e1e",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "10px"
          }}
        >
          <h3>Team {t.team.replace("frc", "")}</h3>
          <p>Matches: {t.entries.length}</p>
        </div>
      ))}

      {selectedTeam && (
        <div>
          <button onClick={() => setSelectedTeam(null)}>Back</button>

          <h2>Team {selectedTeam.team.replace("frc", "")}</h2>

          {selectedTeam.entries.map((e, i) => (
            <div key={i} style={{
              background: "#1e1e1e",
              padding: "10px",
              marginBottom: "10px"
            }}>
              <p><b>Match:</b> {e.match}</p>
              <p><b>Accuracy:</b> {e.accuracy}</p>
              <p><b>Shooting Speed:</b> {e.shootingSpeed}</p>
              <p><b>Intake Speed:</b> {e.intakeSpeed}</p>
              <p><b>Notes:</b> {e.notes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
