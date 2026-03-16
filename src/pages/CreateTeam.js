import React, { useState } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import QRCode from "react-qr-code";

const CreateTeam = () => {

const [teamName, setTeamName] = useState("");
const [inviteCode, setInviteCode] = useState("");

function generateCode() {
const code = Math.random().toString(36).substring(2,8);
setInviteCode(code);
}

async function createTeam() {


if (!teamName) {
  alert("Enter team name");
  return;
}

const uid = auth.currentUser.uid;

const code = inviteCode || Math.random().toString(36).substring(2,8);

await setDoc(doc(db,"teams",code),{
  name: teamName,
  adminUid: uid,
  inviteCode: code
});

await setDoc(doc(db,"users",uid),{
  role: "admin",
  teamId: code
});

setInviteCode(code);


}

return (


<div style={{maxWidth:"500px",margin:"auto"}}>

  <h2>Create Scouting Team</h2>

  <input
    placeholder="Team Name"
    value={teamName}
    onChange={(e)=>setTeamName(e.target.value)}
    style={{width:"100%",padding:"10px"}}
  />

  <button
    onClick={createTeam}
    style={{marginTop:"10px"}}
  >
    Create Team
  </button>

  {inviteCode && (

    <div style={{marginTop:"30px",textAlign:"center"}}>

      <h3>Scout Join QR</h3>

      <QRCode value={inviteCode} />

      <p>Code: {inviteCode}</p>

    </div>

  )}

</div>


);

};

export default CreateTeam;
