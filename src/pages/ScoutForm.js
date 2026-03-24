import React, { useEffect, useState } from "react";
import { getMatches } from "../services/tbaService";

export default function ScoutForm() {

  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");

  const [form, setForm] = useState({
    robotType: [],
    focus: [],
    focusOther: "",
    failures: [],
    failuresOther: "",
    accuracy: 3,
    shootingSpeed: 3,
    intakeSpeed: 3,
    auton: [],
    autonOther: "",
    climb: [],
    awareness: "",
    notes: ""
  });

  // ✅ GET EVENT FROM LOCAL STORAGE
  const eventKey = localStorage.getItem("selectedEvent");

  // ✅ LOAD MATCHES CORRECTLY
  useEffect(() => {
    async function loadMatches() {
      if (!eventKey) {
        console.warn("No event selected");
        return;
      }

      const data = await getMatches(eventKey);

      if (Array.isArray(data)) {
        const sorted = data
          .filter(m => m.comp_level === "qm")
          .sort((a, b) => a.match_number - b.match_number);

        setMatches(sorted);
      } else {
        console.error("Invalid match data:", data);
      }
    }

    loadMatches();
  }, [eventKey]);

  // ✅ LOAD TEAMS FROM SELECTED MATCH
  useEffect(() => {
    if (!selectedMatch) return;

    const match = matches.find(m => m.key === selectedMatch);
    if (!match) return;

    const allTeams = [
      ...match.alliances.red.team_keys,
      ...match.alliances.blue.team_keys
    ];

    setTeams(allTeams);
  }, [selectedMatch, matches]);

  const toggleMulti = (field, value) => {
    setForm(prev => {
      const exists = prev[field].includes(value);
      return {
        ...prev,
        [field]: exists
          ? prev[field].filter(v => v !== value)
          : [...prev[field], value]
      };
    });
  };

  const handleSubmit = () => {
    const entry = {
      match: selectedMatch,
      team: selectedTeam,
      ...form,
      timestamp: Date.now()
    };

    const existing = JSON.parse(localStorage.getItem("scoutingData") || "[]");
    localStorage.setItem("scoutingData", JSON.stringify([...existing, entry]));

    alert("Saved!");
  };

  const sectionStyle = {
    marginBottom: "20px",
    padding: "15px",
    background: "#1e1e1e",
    borderRadius: "10px"
  };

  const buttonStyle = (active) => ({
    padding: "10px",
    margin: "5px",
    borderRadius: "8px",
    border: "none",
    background: active ? "#4caf50" : "#333",
    color: "white",
    flex: "1"
  });

  return (
    <div style={{ padding: "10px", color: "white" }}>
      <h2>Scout Match</h2>

      {/* ⚠️ WARNING IF NO EVENT */}
      {!eventKey && (
        <p style={{ color: "red" }}>
          No event selected. Go back and pick an event.
        </p>
      )}

      {/* MATCH SELECT */}
      <div style={sectionStyle}>
        <h3>Match</h3>
        <select
          style={{ width: "100%", padding: "12px" }}
          onChange={(e) => setSelectedMatch(e.target.value)}
        >
          <option value="">Select Match</option>
          {matches.map(m => (
            <option key={m.key} value={m.key}>
              Match {m.match_number}
            </option>
          ))}
        </select>
      </div>

      {/* TEAM SELECT */}
      <div style={sectionStyle}>
        <h3>Team</h3>
        <select
          style={{ width: "100%", padding: "12px" }}
          onChange={(e) => setSelectedTeam(e.target.value)}
        >
          <option value="">Select Team</option>
          {teams.map(t => (
            <option key={t} value={t}>
              {t.replace("frc", "")}
            </option>
          ))}
        </select>
      </div>

      {/* ===== EVERYTHING BELOW IS YOUR ORIGINAL UI ===== */}

      {/* AUTON */}
      <div style={sectionStyle}>
        <h3>Auton</h3>
        {["No Auton", "Shoot", "Collect Middle", "Collect Depot", "Climb", "Other"].map(opt => (
          <button key={opt} style={buttonStyle(form.auton.includes(opt))}
            onClick={() => toggleMulti("auton", opt)}>
            {opt}
          </button>
        ))}
        {form.auton.includes("Other") && (
          <input placeholder="Other..." onChange={(e)=>setForm({...form, autonOther:e.target.value})}/>
        )}
      </div>

      {/* (rest of your UI unchanged...) */}

      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "20px",
          background: "#2196f3",
          border: "none",
          borderRadius: "10px",
          fontSize: "18px"
        }}
      >
        Save
      </button>
    </div>
  );
}
