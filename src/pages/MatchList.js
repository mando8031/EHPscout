import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const MatchList = () => {

const navigate = useNavigate();
const [matches, setMatches] = useState([]);

useEffect(() => {


async function loadMatches() {

  const user = auth.currentUser;
  if (!user) return;

  const userSnap = await getDoc(doc(db, "users", user.uid));
  const teamId = userSnap.data().teamId;

  const teamSnap = await getDoc(doc(db, "teams", teamId));
  const eventKey = teamSnap.data().eventKey;

  if (!eventKey) {
    alert("Admin has not selected an event yet.");
    return;
  }

  const res = await fetch(
    `https://www.thebluealliance.com/api/v3/event/${eventKey}/matches/simple`,
    {
      headers: {
        "X-TBA-Auth-Key": process.env.REACT_APP_TBA_KEY
      }
    }
  );

  const data = await res.json();

  const qmMatches = data.filter(m => m.comp_level === "qm");

  setMatches(qmMatches);

}

loadMatches();
```

}, []);

return (


<div>

  <h1>Matches</h1>

  {matches.map(match => (

    <div
      key={match.key}
      style={{
        border: "1px solid #444",
        padding: "10px",
        marginBottom: "10px",
        cursor: "pointer"
      }}
      onClick={() =>
        navigate(`/scout/${match.match_number}`)
      }
    >

      Match {match.match_number}

    </div>

  ))}

</div>


);

};

export default MatchList;
