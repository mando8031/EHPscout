import { Link } from "react-router-dom";

function Navbar(){

  return(

    <div style={{display:"flex",gap:20,padding:20}}>

      <Link to="/">Events</Link>
      <Link to="/dashboard">Stats</Link>
      <Link to="/picklist">Picklist</Link>

    </div>

  );
}

export default Navbar;
