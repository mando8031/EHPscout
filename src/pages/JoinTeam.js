import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";

import {
collection,
query,
where,
getDocs,
doc,
updateDoc
} from "firebase/firestore";

const JoinTeam = () => {

const { code } = useParams();
const navigate = useNavigate();

const [loading,setLoading] = useState(false);

async function joinTeam(){

setLoading(true);

try{

  const q = query(
    collection(db,"teams"),
    where("joinCode","==",code)
  );

  const snapshot = await getDocs(q);

  if(snapshot.empty){

    alert("Team not found");

    setLoading(false);
    return;

  }

  const teamDoc = snapshot.docs[0];

  const teamId = teamDoc.id;

  const user = auth.currentUser;

  if(!user){
    alert("Not logged in");
    return;
  }

  await updateDoc(
    doc(db,"users",user.uid),
    {
      teamId: teamId
    }
  );

  alert("Joined team!");

  navigate("/dashboard");

}catch(err){

  console.error(err);
  alert("Error joining team");

}

setLoading(false);

}

return (


<div style={{maxWidth:"500px",margin:"auto"}}>

  <h1>Join Team</h1>

  <p>Join Code:</p>

  <div
    style={{
      background:"#333",
      padding:"15px",
      borderRadius:"8px",
      textAlign:"center",
      fontSize:"20px"
    }}
  >
    {code}
  </div>

  <button
    onClick={joinTeam}
    style={{
      marginTop:"20px",
      padding:"12px",
      width:"100%"
    }}
  >
    {loading ? "Joining..." : "Join Team"}
  </button>

</div>


);

};

export default JoinTeam;
