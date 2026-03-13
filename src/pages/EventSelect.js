import { useEffect, useState } from "react";
import { getEvents } from "../services/tbaService";
import { useNavigate } from "react-router-dom";

function EventSelect() {

  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState("");

  const navigate = useNavigate();

  useEffect(() => {

    getEvents(2026).then(setEvents);

  }, []);

  return (

    <div>

      <h1>Select Event</h1>

      <select onChange={(e)=>setSelected(e.target.value)}>

        <option>Select Event</option>

        {events.map((event)=>(
          <option key={event.key} value={event.key}>
            {event.name}
          </option>
        ))}

      </select>

      <button
        onClick={()=>navigate(`/matches/${selected}`)}
      >
        Load Matches
      </button>

    </div>
  );
}

export default EventSelect;
