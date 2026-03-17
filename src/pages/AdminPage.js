import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const AdminPage = () => {

const [teamId, setTeamId] = useState(null);
const [joinCode, setJoinCode] = useState("");
const [events, setEvents] = useState([]);
const [selectedEvent, setSelectedEvent] = useState("");

useEffect(() => {


async function loadData() {

  try {

    const user = auth.currentUser;
    if (!user) return;

    const userSnap = await getDoc(doc(db, "users", user.uid));

    if (!userSnap.exists()) {
      console.log("No user doc");
      return;
    }

    const data = userSnap.data();

    console.log("USER DATA:", data);

    setTeamId(data.teamId);

    const teamSnap = await getDoc(doc(db, "teams", data.teamId));

    if (teamSnap.exists()) {

      const teamData = teamSnap.data();

      console.log("TEAM DATA:", teamData);

      setJoinCode(teamData.joinCode || "");
      setSelectedEvent(teamData.eventKey || "");

    }

    // Load events
    const res = await fetch(
      "https://www.thebluealliance.com/api/v3/events/2026",
      {
        headers: {
          "X-TBA-Auth-Key": process.env.REACT_APP_TBA_KEY
        }
      }
    );

    const eventData = await res.json();
    setEvents(eventData);

  } catch (err) {
    console.error("LOAD ERROR:", err);
  }

}

loadData();


}, []);

async function saveEvent(e) {

e.preventDefault();

console.log("Saving event...");
console.log("teamId:", teamId);
console.log("selectedEvent:", selectedEvent);

if (!teamId) {
  alert("No team found");
  return;
}

if (!selectedEvent) {
  alert("Select an event");
  return;
}

try {

  const selected = events.find(ev => ev.key === selectedEvent);

  await updateDoc(doc(db, "teams", teamId), {
    eventKey: selectedEvent,
    eventName: selected ? selected.name : ""
  });

  console.log("EVENT SAVED");

  alert("Event saved successfully");

} catch (err) {

  console.error("SAVE ERROR:", err);
  alert("Failed to save event");

}


}

return (

<div style={{ maxWidth: "600px", margin: "auto" }}>

  <h1>Admin Panel</h1>

  {/* JOIN CODE */}
  <div style={{
    border: "1px solid #444",
    padding: "20px",
    marginBottom: "30px"
  }}>
    <h2>Join Code</h2>
    <div style={{ fontSize: "24px", fontWeight: "bold" }}>
      {joinCode}
    </div>
  </div>

  {/* EVENT SELECT */}
  <div style={{
    border: "1px solid #444",
    padding: "20px"
  }}>

    <h2>Select Event</h2>

    <form onSubmit={saveEvent}>

      <select
        value={selectedEvent}
        onChange={(e)=>setSelectedEvent(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px"
        }}
      >

        <option value="">-- Select Event --</option>

        {events.map((event) => (
          <option key={event.key} value={event.key}>
            {event.name}
          </option>
        ))}

      </select>

      <button type="submit" style={{
        width: "100%",
        padding: "12px"
      }}>
        Save Event
      </button>

    </form>

  </div>

</div>

);

};

export default AdminPage;
