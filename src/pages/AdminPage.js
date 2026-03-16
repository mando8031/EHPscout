import React,{useEffect,useState} from "react";
import {auth,db} from "../firebase";
import {doc,getDoc} from "firebase/firestore";

const AdminPage = () => {

const [team,setTeam] = useState(null);

useEffect(()=>{


async function loadTeam(){

  const user = auth.currentUser;

  if(!user) return;

  const userDoc = await getDoc(doc(db,"users",user.uid));

  if(userDoc.exists()){

    const teamId = userDoc.data().teamId;

    const teamDoc = await getDoc(doc(db,"teams",teamId));

    if(teamDoc.exists()){
      setTeam(teamDoc.data());
    }

  }

}

loadTeam();


},[]);

if(!team){
return <div>Loading team...</div>;
}

return (


<div style={{maxWidth:"700px",margin:"auto"}}>

  <h1>Admin Team Settings</h1>

  <h3>Team Name</h3>
  <p>{team.name}</p>

  <h3>Join Code</h3>
  <div
    style={{
      background:"#333",
      padding:"15px",
      fontSize:"20px",
      textAlign:"center",
      borderRadius:"8px"
    }}
  >
    {team.joinCode}
  </div>

  <p style={{marginTop:"20px"}}>
    Share this code with scouts so they can join your team.
  </p>

</div>


);

};

export default AdminPage;
