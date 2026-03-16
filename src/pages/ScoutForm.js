import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const ScoutForm = () => {

  const { eventKey, matchNumber } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState("");
  const [autoScore, setAutoScore] = useState(0);
  const [teleopScore, setTeleopScore] = useState(0);
  const [endgame, setEndgame] = useState("none");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);

  async function submitScout(e) {

    e.preventDefault();

    if (!team) {
      alert("Please enter a team number.");
      return;
    }

    setSubmitting(true);

    try {

      const payload = {
        eventKey: eventKey,
        matchNumber: Number(matchNumber),

        team: Number(team),

        autoScore: Number(autoScore),
        teleopScore: Number(teleopScore),

        endgame: endgame,
        notes: notes,

        created: serverTimestamp()
      };

      console.log("Saving scouting payload:", payload);

      // Timeout protection so the UI never freezes
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database timeout")), 10000)
      );

      const save = addDoc(collection(db, "scouting"), payload);

      await Promise.race([save, timeout]);

      alert("Scouting data saved successfully!");

      navigate(-1);

    } catch (err) {

      console.error("Firestore save failed:", err);

      alert("Failed to save scouting data. Check console for details.");

    }

    setSubmitting(false);

  }

  return (

    <div
      style={{
        maxWidth: "600px",
        margin: "auto",
        padding: "20px"
      }}
    >

      <h1 style={{ marginBottom: "20px" }}>
        Scout Match {matchNumber}
      </h1>

      <form onSubmit={submitScout}>

        <label>Team Number</label>
        <input
          type="number"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "18px",
            marginBottom: "20px"
          }}
        />

        <label>Auto Score</label>
        <input
          type="number"
          value={autoScore}
          onChange={(e) => setAutoScore(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "18px",
            marginBottom: "20px"
          }}
        />

        <label>Teleop Score</label>
        <input
          type="number"
          value={teleopScore}
          onChange={(e) => setTeleopScore(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "18px",
            marginBottom: "20px"
          }}
        />

        <label>Endgame</label>
        <select
          value={endgame}
          onChange={(e) => setEndgame(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "18px",
            marginBottom: "20px"
          }}
        >
          <option value="none">None</option>
          <option value="park">Park</option>
          <option value="climb">Climb</option>
        </select>

        <label>Notes</label>
        <textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            marginBottom: "20px"
          }}
        />

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            padding: "16px",
            fontSize: "20px",
            background: "#2ecc71",
            border: "none",
            borderRadius: "8px",
            color: "white"
          }}
        >
          {submitting ? "Saving..." : "Submit Scouting"}
        </button>

      </form>

    </div>

  );

};

export default ScoutForm;
