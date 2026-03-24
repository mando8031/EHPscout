import React, { useEffect, useState } from "react";
import { getEvents } from "../services/tbaService";
import { useNavigate } from "react-router-dom";

export default function EventSelect() {

  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const currentEvent = localStorage.getItem("selectedEvent");

  useEffect(() => {
    async function loadEvents() {
      const data = await getEvents(new Date().getFullYear());
      if (Array.isArray(data)) {
        setEvents(data);
      }
    }
    loadEvents();
  }, []);

  const handleSelect = (eventKey) => {
    localStorage.setItem("selectedEvent", eventKey);

    // go where user expects (dashboard)
    navigate("/dashboard");
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>Select Event</h1>

      {/* CURRENT EVENT */}
      {currentEvent && (
        <div style={{
          marginBottom: "20px",
          padding: "10px",
          background: "#1e1e1e",
          borderRadius: "10px"
        }}>
          <p>Current Event: {currentEvent}</p>
        </div>
      )}

      {events.map(event => (
        <button
          key={event.key}
          onClick={() => handleSelect(event.key)}
          style={{
            display: "block",
            width: "100%",
            padding: "15px",
            marginBottom: "10px"
          }}
        >
          {event.name}
        </button>
      ))}
    </div>
  );
}
