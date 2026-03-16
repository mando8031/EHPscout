import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const ScoutForm = () => {

const { eventKey, matchNumber } = useParams();
const navigate = useNavigate();

const [team, setTeam] = useState("");

const [auton, setAuton] = useState(5);
const [accuracy, setAccuracy] = useState(5);

const [climb, setClimb] = useState("none");
const [movement, setMovement] = useState("1");
const [intake, setIntake] = useState("none");

const [submitting, setSubmitting] = useState(false);

async function submitScout(e) {
e.preventDefault();


if (!team) {
  alert("Enter team number");
  return;
}

setSubmitting(true);

try {

  // convert categories to scores
  const climbScore =
    climb === "L3" ? 10 :
    climb === "L2" ? 6 :
    climb === "L1" ? 3 : 0;

  const movementScore = Number(movement);
  const intakeScore = Number(intake);

  // overall score calculation
  const overall =
    Number(auton) * 2 +
    Number(accuracy) * 2 +
    climbScore +
    movementScore +
    intakeScore;

  const payload = {
    eventKey,
    matchNumber: Number(matchNumber),

    team: Number(team),

    auton: Number(auton),
    climb,
    movement,
    intake,
    accuracy: Number(accuracy),

    overall,

    created: serverTimestamp()
  };

  await addDoc(collection(db, "scouting"), payload);

  alert("Saved!");

  navigate(-1);

} catch (err) {

  console.error("Firestore save failed:", err);
  alert("Failed to save scouting data");

}

setSubmitting(false);


}

const buttonStyle = (selected) => ({
flex: 1,
padding: "18px",
fontSize: "18px",
borderRadius: "10px",
border: "none",
background: selected ? "#3498db" : "#ecf0f1",
color: selected ? "white" : "black"
});

return (


<div style={{
  maxWidth: "500px",
  margin: "auto",
  padding: "20px"
}}>

  <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
    Match {matchNumber}
  </h1>

  <form onSubmit={submitScout}>

    <label style={{ fontSize: "20px" }}>Team Number</label>

    <input
      type="number"
      value={team}
      onChange={(e) => setTeam(e.target.value)}
      style={{
        width: "100%",
        padding: "16px",
        fontSize: "20px",
        marginBottom: "25px"
      }}
    />

    <h2>Auton</h2>

    <div style={{ textAlign: "center", fontSize: "24px", marginBottom: "10px" }}>
      {auton}
    </div>

    <input
      type="range"
      min="1"
      max="10"
      step="1"
      value={auton}
      onChange={(e) => setAuton(e.target.value)}
      style={{ width: "100%", marginBottom: "30px" }}
    />

    <h2>Climb</h2>

    <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>

      {["none", "L1", "L2", "L3"].map((c) => (

        <button
          type="button"
          key={c}
          style={buttonStyle(climb === c)}
          onClick={() => setClimb(c)}
        >
          {c}
        </button>

      ))}

    </div>

    <h2>Movement</h2>

    <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>

      {["1", "2", "3"].map((m) => (

        <button
          type="button"
          key={m}
          style={buttonStyle(movement === m)}
          onClick={() => setMovement(m)}
        >
          {m}
        </button>

      ))}

    </div>

    <h2>Intake</h2>

    <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>

      {["none", "1", "2", "3"].map((i) => (

        <button
          type="button"
          key={i}
          style={buttonStyle(intake === i)}
          onClick={() => setIntake(i)}
        >
          {i}
        </button>

      ))}

    </div>

    <h2>Accuracy</h2>

    <div style={{ textAlign: "center", fontSize: "24px", marginBottom: "10px" }}>
      {accuracy}
    </div>

    <input
      type="range"
      min="1"
      max="10"
      step="1"
      value={accuracy}
      onChange={(e) => setAccuracy(e.target.value)}
      style={{ width: "100%", marginBottom: "40px" }}
    />

    <button
      type="submit"
      disabled={submitting}
      style={{
        width: "100%",
        padding: "20px",
        fontSize: "22px",
        background: "#2ecc71",
        border: "none",
        borderRadius: "12px",
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
