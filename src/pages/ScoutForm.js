import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const ScoutForm = () => {
  const navigate = useNavigate();
  const { eventKey, matchNumber } = useParams();

  const [team, setTeam] = useState("");
  const [accuracy, setAccuracy] = useState(5);
  const [auton, setAuton] = useState(5);
  const [movement, setMovement] = useState(2);
  const [notes, setNotes] = useState("");

  if (!eventKey || !matchNumber) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>No match selected</h2>
        <button onClick={() => navigate("/")}>
          Go back
        </button>
      </div>
    );
  }

  const submit = async () => {
    await addDoc(collection(db, "scouting"), {
      event: eventKey,
      team: team,
      match: Number(matchNumber),
      accuracy: Number(accuracy),
      auton: Number(auton),
      movement: Number(movement),
      notes,
      timestamp: Date.now(),
    });

    alert("Scouting data saved");
    navigate("/");
  };

  return (
    <div style={{ maxWidth: "600px", padding: "20px" }}>
      <h2>
        Event {eventKey} — Match {matchNumber}
      </h2>

      <label>Team Number</label>
      <input
        type="number"
        value={team}
        onChange={(e) => setTeam(e.target.value)}
      />

      <label>Accuracy</label>
      <input
        type="range"
        min="0"
        max="10"
        value={accuracy}
        onChange={(e) => setAccuracy(e.target.value)}
      />

      <label>Auton</label>
      <input
        type="range"
        min="0"
        max="10"
        value={auton}
        onChange={(e) => setAuton(e.target.value)}
      />

      <label>Movement</label>
      <select
        value={movement}
        onChange={(e) => setMovement(e.target.value)}
      >
        <option value="1">Bad</option>
        <option value="2">Average</option>
        <option value="3">Good</option>
      </select>

      <label>Notes</label>
      <textarea
        onChange={(e) => setNotes(e.target.value)}
      />

      <br />

      <button onClick={submit}>
        Submit
      </button>
    </div>
  );
};

export default ScoutForm;
