import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function generateCode() {
return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const AdminPage = () => {

const [team, setTeam] = useState(null);
const [joinCode, setJoinCode] = useState("");

useEffect(() => {


async function loadTeam() {

  const user = auth.currentUser;

  if (!user) return;

  const userDoc = await getDoc(doc(db, "users", user.uid));

  if (!userDoc.exists()) return;

  const teamId = userDoc.data().teamId;

  const teamRef = doc(db, "teams", teamId);
  const teamDoc = await getDoc(teamRef);

  if (!teamDoc.exists()) return;

  let data = teamDoc.data();

  // If join code doesn't exist, create one
  if (!data.joinCode) {

    const newCode = generateCode();

    await updateDoc(teamRef, {
      joinCode: newCode
    });

    data.joinCode = newCode;

  }

  setTeam(data);
  setJoinCode(data.joinCode);

}

loadTeam();


}, []);

if (!team) {
return <div>Loading team...</div>;
}

return (


<div style={{ maxWidth: "700px", margin: "auto" }}>

  <h1>Admin Settings</h1>

  <h3>Team Name</h3>
  <p>{team.name}</p>

  <h3>Join Code</h3>

  <div
    style={{
      background: "#333",
      padding: "15px",
      fontSize: "24px",
      textAlign: "center",
      borderRadius: "8px",
      letterSpacing: "3px"
    }}
  >
    {joinCode}
  </div>

  <p style={{ marginTop: "20px" }}>
    Share this code with scouts so they can join your team.
  </p>

</div>


);

};

export default AdminPage;
