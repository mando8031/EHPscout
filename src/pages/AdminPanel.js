import React from "react";
import { Link } from "react-router-dom";

const AdminPanel = () => {

return (


<div style={{maxWidth:"700px",margin:"auto"}}>

  <h1>Admin Control Panel</h1>

  <p>Manage your scouting system.</p>

  <div style={{display:"flex",flexDirection:"column",gap:"15px"}}>

    <Link to="/create-team">
      <button style={{padding:"12px",width:"100%"}}>
        Create Team
      </button>
    </Link>

    <Link to="/dashboard">
      <button style={{padding:"12px",width:"100%"}}>
        View Rankings
      </button>
    </Link>

    <Link to="/picklist">
      <button style={{padding:"12px",width:"100%"}}>
        Alliance Picklist
      </button>
    </Link>

    <Link to="/robots">
      <button style={{padding:"12px",width:"100%"}}>
        Robot Analysis
      </button>
    </Link>

  </div>

</div>


);

};

export default AdminPanel;
