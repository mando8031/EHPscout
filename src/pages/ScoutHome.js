import React from "react";
import { Link } from "react-router-dom";

const ScoutHome = () => {

return (


<div style={{maxWidth:"700px",margin:"auto"}}>

  <h1>Scout Dashboard</h1>

  <p>Select an action below.</p>

  <div style={{display:"flex",flexDirection:"column",gap:"15px"}}>

    <Link to="/">
      <button style={{padding:"12px",width:"100%"}}>
        Select Event
      </button>
    </Link>

    <Link to="/robots">
      <button style={{padding:"12px",width:"100%"}}>
        Robot Stats
      </button>
    </Link>

    <Link to="/dashboard">
      <button style={{padding:"12px",width:"100%"}}>
        Team Rankings
      </button>
    </Link>

  </div>

</div>


);

};

export default ScoutHome;
