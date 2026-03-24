import React, { useEffect, useState } from "react";
import { getEvents } from "../services/tbaService";

export default function EventSelect() {

  const [events, setEvents] = useState([]);

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

    // 🔥 FORCE RELOAD so App.js sees updated event
    window.location.href = "/dashboard";
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>Select Event</h1>

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
