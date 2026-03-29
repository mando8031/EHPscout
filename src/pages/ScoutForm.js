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

  const eventKey = localStorage.getItem("selectedEvent");

  useEffect(() => {
    async function loadMatches() {
      if (!eventKey) return;

      const data = await getMatches(eventKey);

      if (Array.isArray(data)) {
        const filtered = data
          .filter(m => m.comp_level === "qm")
          .sort((a, b) => a.match_number - b.match_number);

        setMatches(filtered);
      }
    }

    loadMatches();
  }, [eventKey]);

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

    const eventKey = localStorage.getItem("selectedEvent");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const entry = {
      id: `${Date.now()}`,
      event: eventKey,
      match: selectedMatch,
      team: selectedTeam,
      scout: user.username,
      ...form
    };

    const existing = JSON.parse(localStorage.getItem("scoutingData") || "[]");
    localStorage.setItem("scoutingData", JSON.stringify([...existing, entry]));

    alert("Saved!");

    // RESET
    setSelectedMatch("");
    setSelectedTeam("");

    setForm({
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
  };

  const sectionStyle = {
    marginBottom: "20px",
    padding: "15px",
    background: "#1e1e1e",
    borderRadius: "12px"
  };

  const buttonStyle = (active) => ({
    padding: "10px 12px",
    margin: "5px",
    borderRadius: "10px",
    border: "none",
    background: active ? "#4caf50" : "#333",
    color: "white",
    fontSize: "14px"
  });

  return (
    <div style={{ padding: "10px", color: "white" }}>
      <h2>Scout Match</h2>

      {/* MATCH */}
      <div style={sectionStyle}>
        <h3>Match</h3>
        <select style={{ width: "100%", padding: "12px" }}
          value={selectedMatch}
          onChange={(e) => setSelectedMatch(e.target.value)}>
          <option value="">Select Match</option>
          {matches.map(m => (
            <option key={m.key} value={m.key}>
              Match {m.match_number}
            </option>
          ))}
        </select>
      </div>

      {/* TEAM */}
      <div style={sectionStyle}>
        <h3>Team</h3>
        <select style={{ width: "100%", padding: "12px" }}
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}>
          <option value="">Select Team</option>
          {teams.map(t => (
            <option key={t} value={t}>{t.replace("frc", "")}</option>
          ))}
        </select>
      </div>

      {/* AUTON */}
      <div style={sectionStyle}>
        <h3>Auton</h3>
        {["No Auton / Not Working", "Shoot", "Collect Middle", "Collect Depot", "Climb", "Other"].map(opt => (
          <button key={opt}
            style={buttonStyle(form.auton.includes(opt))}
            onClick={() => toggleMulti("auton", opt)}>
            {opt}
          </button>
        ))}
      </div>

      {/* SAVE */}
      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "20px",
          background: "#2d8cf0",
          border: "none",
          borderRadius: "12px",
          fontSize: "18px"
        }}
      >
        Save
      </button>
    </div>
  );
}
