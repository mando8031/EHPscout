import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

import ScoutLogin from "./pages/ScoutLogin";
import CreateTeam from "./pages/CreateTeam";
import EventSelect from "./pages/EventSelect";
import ScoutForm from "./pages/ScoutForm";
import Dashboard from "./pages/Dashboard";

import { getCurrentUser } from "./utils/localAuth";
import { getTeams } from "./utils/localTeams";

function App() {

  const user = getCurrentUser();
  const teams = getTeams();

  const userHasTeam =
    user && teams.some(t => t.members.includes(user.username));

  return (
    <Router>

      {/* NAVBAR */}
      <nav style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "10px",
        background: "#111",
        color: "white",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}>
        <Link style={{ color: "white" }} to="/">Home</Link>

        {user && userHasTeam && (
          <>
            <Link style={{ color: "white" }} to="/dashboard">Dashboard</Link>
            <Link style={{ color: "white" }} to="/event-select">Events</Link>

            {/* ✅ NEW SCOUT FORM LINK */}
            <Link style={{ color: "white" }} to="/scout">Scout</Link>
          </>
        )}
      </nav>

      {/* ROUTES */}
      <Routes>

        <Route
          path="/"
          element={
            user
              ? userHasTeam
                ? <Navigate to="/dashboard" />
                : <Navigate to="/create-team" />
              : <ScoutLogin />
          }
        />

        <Route path="/create-team" element={<CreateTeam />} />
        <Route path="/event-select" element={<EventSelect />} />

        {/* ✅ NEW ROUTE */}
        <Route path="/scout" element={<ScoutForm />} />

        <Route
          path="/dashboard"
          element={
            user && userHasTeam
              ? <Dashboard />
              : <Navigate to="/" />
          }
        />

      </Routes>

    </Router>
  );
}

export default App;
