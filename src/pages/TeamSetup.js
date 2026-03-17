import React from "react";
import { useNavigate } from "react-router-dom";

const TeamSetup = () => {

const navigate = useNavigate();

return (


<div style={{ maxWidth: "500px", margin: "auto", textAlign: "center" }}>

  <h1>Team Setup</h1>

  <p>Create a new team or join an existing one.</p>

  <button
    onClick={() => navigate("/create-team")}
    style={{
      width: "100%",
      padding: "12px",
      marginTop: "20px"
    }}
  >
    Create Team
  </button>

  <button
    onClick={() => navigate("/join-team")}
    style={{
      width: "100%",
      padding: "12px",
      marginTop: "15px"
    }}
  >
    Join Team
  </button>

</div>


);

};

export default TeamSetup;
