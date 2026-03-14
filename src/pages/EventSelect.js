import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../services/tbaService";

const EventSelect = () => {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const data = await getEvents(new Date().getFullYear());
      setEvents(data);
    }

    load();
  }, []);

  const loadEvent = () => {
    if (!selected) return;
    navigate(`/matches/${selected}`);
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl mb-6">Select Event</h1>

      <select
        className="bg-gray-800 p-3 rounded w-full mb-4"
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="">Select Event</option>

        {events.map((event) => (
          <option key={event.key} value={event.key}>
            {event.name}
          </option>
        ))}
      </select>

      <button
        className="bg-blue-600 px-6 py-3 rounded"
        onClick={loadEvent}
      >
        Load Matches
      </button>
    </div>
  );
};

export default EventSelect;
