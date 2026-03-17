import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";

function generateCode() {
return Math.random().toString(36).substring(2, 8);
}

const TeamSetup = () => {

const navigate = useNavigate();
const [teamName, setTeamName] = useState("");

async function createTeam(e) {


e.preventDefault();

const user = auth.currentUser;

if (!user) {
  alert("Not logged in");
  return;
}

const teamRef = await addDoc(collection(db, "teams"), {
  name: teamName,
  joinCode: generateCode(),
  createdBy: user.uid
});

await updateDoc(doc(db, "users", user.uid), {
  role: "admin",
  teamId: teamRef.id
});

navigate("/dashboard");


}

function goJoin() {
navigate("/join-team");
}

return (


<div style={{ maxWidth: "500px", margin: "auto" }}>

  <h1>Create Team</h1>

  <form onSubmit={createTeam}>

    <input
      placeholder="Team Name"
      value={teamName}
      onChange={(e)=>setTeamName(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        marginBottom: "15px"
      }}
    />

    <button
      type="submit"
      style={{ width: "100%", padding: "12px" }}
    >
      Create Team
    </button>

  </form>

  <hr style={{ margin: "40px 0" }} />

  <h2>Join Team</h2>

  <button
    onClick={goJoin}
    style={{ width: "100%", padding: "12px" }}
  >
    Join Existing Team
  </button>

</div>


);

};

export default TeamSetup;
