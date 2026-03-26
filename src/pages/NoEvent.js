import React from "react";
import { useNavigate } from "react-router-dom";

export default function NoEvent() {

  const navigate = useNavigate();

  return (
    <div style={{
      padding: "20px",
      color: "white",
      textAlign: "center"
    }}>
      <h1>No Event Selected</h1>

      <p style={{ marginBottom: "20px" }}>
        You need to select an event before scouting or viewing the dashboard.
      </p>

      <button
        onClick={() => navigate("/event-select")}
        style={{
          padding: "15px",
          width: "100%",
          maxWidth: "300px"
        }}
      >
        Select Event
      </button>
    </div>
  );
}
