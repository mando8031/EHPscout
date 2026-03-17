import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const AdminPage = () => {

const [teamId, setTeamId] = useState(null);
const [joinCode, setJoinCode] = useState("");
const [eventKey, setEventKey] = useState("");

useEffect(() => {


async function loadTeam() {

  const user = auth.currentUser;
  if (!user) return;

  const userSnap = await getDoc(doc(db, "users", user.uid));

  if (!userSnap.exists()) return;

  const data = userSnap.data();
  const tId = data.teamId;

  setTeamId(tId);

  const teamSnap = await getDoc(doc(db, "teams", tId));

  if (teamSnap.exists()) {

    const teamData = teamSnap.data();

    setJoinCode(teamData.joinCode || "");
    setEventKey(teamData.eventKey || "");

  }

}

loadTeam();


}, []);

async function saveEvent(e) {


e.preventDefault();

if (!teamId) return;

await updateDoc(doc(db, "teams", teamId), {
  eventKey: eventKey
});

alert("Event saved for your team");


}

return (


<div style={{ maxWidth: "600px", margin: "auto" }}>

  <h1>Admin Panel</h1>

  <div style={{
    border: "1px solid #444",
    padding: "20px",
    marginBottom: "30px"
  }}>

    <h2>Join Code</h2>

    <div style={{
      fontSize: "24px",
      fontWeight: "bold"
    }}>
      {joinCode}
    </div>

    <p>Give this code to scouts so they can join your team.</p>

  </div>

  <div style={{
    border: "1px solid #444",
    padding: "20px"
  }}>

    <h2>Select Event</h2>

    <form onSubmit={saveEvent}>

      <input
        placeholder="Event Key (example: 2026mimid)"
        value={eventKey}
        onChange={(e)=>setEventKey(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px"
        }}
      />

      <button style={{
        width: "100%",
        padding: "12px"
      }}>
        Save Event
      </button>

    </form>

  </div>

</div>


);

};

export default AdminPage;
