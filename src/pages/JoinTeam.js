import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

const JoinTeam = () => {

const navigate = useNavigate();
const [code, setCode] = useState("");
const [loading, setLoading] = useState(false);

async function joinTeam(e) {


e.preventDefault();

if (!code.trim()) {
  alert("Enter a join code");
  return;
}

const user = auth.currentUser;

if (!user) {
  alert("Not logged in");
  return;
}

setLoading(true);

try {

  const q = query(
    collection(db, "teams"),
    where("joinCode", "==", code.trim())
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    alert("Team not found");
    setLoading(false);
    return;
  }

  const teamDoc = snapshot.docs[0];
  const teamId = teamDoc.id;

  await updateDoc(doc(db, "users", user.uid), {
    teamId: teamId,
    role: "scout"
  });

  window.location.href = "/dashboard";

} catch (err) {

  console.error(err);
  alert("Failed to join team");

}

setLoading(false);


}

return (


<div style={{ maxWidth: "500px", margin: "auto" }}>

  <h1>Join a Team</h1>

  <form onSubmit={joinTeam}>

    <input
      placeholder="Enter Join Code"
      value={code}
      onChange={(e)=>setCode(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        marginBottom: "15px"
      }}
    />

    <button
      type="submit"
      disabled={loading}
      style={{
        width: "100%",
        padding: "12px"
      }}
    >
      {loading ? "Joining..." : "Join Team"}
    </button>

  </form>

</div>


);

};

export default JoinTeam;
