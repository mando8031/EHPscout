import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";

function generateCode() {
return Math.random().toString(36).substring(2, 8);
}

const CreateTeam = () => {

const navigate = useNavigate();
const [teamName, setTeamName] = useState("");

async function createTeam(e) {


e.preventDefault();

const user = auth.currentUser;

if (!user) return;

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

    <button style={{ padding: "12px", width: "100%" }}>
      Create Team
    </button>

  </form>

</div>


);

};

export default CreateTeam;
