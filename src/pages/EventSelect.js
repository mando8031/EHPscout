import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../services/tbaService";

const EventSelect = () => {

  const [events, setEvents] = useState(null); // null = not loaded yet
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();

  useEffect(() => {

    const year = new Date().getFullYear();

    async function loadEvents() {

      console.log("Loading events for year:", year);

      try {

        const data = await getEvents(year);

        console.log("TBA events response:", data);

        if (Array.isArray(data)) {

          console.log("Events loaded:", data.length);

          setEvents(data);

        } else {

          console.warn("Unexpected event response:", data);
          setEvents([]);

        }

      } catch (err) {

        console.error("Event loading failed:", err);
        setEvents([]);

      }

    }

    loadEvents();

  }, []);

  const openEvent = () => {

    if (!selected) {
      console.warn("No event selected");
      return;
    }

    console.log("Opening event:", selected);

    navigate(`/matches/${selected}`);

  };

  // Loading state
  if (events === null) {
    return (
      <div>
        <h1 className="text-3xl mb-6">Select Event</h1>
        <p>Loading events...</p>
      </div>
    );
  }

  // No events
  if (events.length === 0) {
    return (
      <div>
        <h1 className="text-3xl mb-6">Select Event</h1>
        <p>No events available.</p>
      </div>
    );
  }

  return (

    <div>

      <h1 className="text-3xl mb-6">
        Select Event
      </h1>

      <select
        value={selected}
        onChange={(e) => {
          console.log("Event selected:", e.target.value);
          setSelected(e.target.value);
        }}
      >

        <option value="">
          Choose an event
        </option>

        {events.map((event) => (
          <option key={event.key} value={event.key}>
            {event.name}
          </option>
        ))}

      </select>

      <br /><br />

      <button onClick={openEvent}>
        View Matches
      </button>

    </div>

  );

};

export default EventSelect;
