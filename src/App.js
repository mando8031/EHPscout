import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import ScoutLogin from "./pages/ScoutLogin";
import EventSelect from "./pages/EventSelect";
import MatchList from "./pages/MatchList";
import ScoutForm from "./pages/ScoutForm";
import RobotSelect from "./pages/RobotSelect";
import Dashboard from "./pages/Dashboard";
import Picklist from "./pages/Picklist";

function App() {

const scoutName = localStorage.getItem("scoutName");

return (


<BrowserRouter>

  <div style={{ minHeight: "100vh", background: "#111", color: "white" }}>

    <Navbar />

    <div style={{ padding: "20px" }}>

      <Routes>

        {/* Login page */}
        <Route path="/login" element={<ScoutLogin />} />

        {/* Default route */}
        <Route
          path="/"
          element={
            scoutName
              ? <EventSelect />
              : <Navigate to="/login" />
          }
        />

        {/* Event matches */}
        <Route
          path="/matches/:eventKey"
          element={
            scoutName
              ? <MatchList />
              : <Navigate to="/login" />
          }
        />

        {/* Scout match */}
        <Route
          path="/scout/:eventKey/:matchNumber"
          element={
            scoutName
              ? <ScoutForm />
              : <Navigate to="/login" />
          }
        />

        {/* Robot stats */}
        <Route
          path="/robots"
          element={
            scoutName
              ? <RobotSelect />
              : <Navigate to="/login" />
          }
        />

        {/* Rankings */}
        <Route
          path="/dashboard"
          element={
            scoutName
              ? <Dashboard />
              : <Navigate to="/login" />
          }
        />

        {/* Picklist */}
        <Route
          path="/picklist"
          element={
            scoutName
              ? <Picklist />
              : <Navigate to="/login" />
          }
        />

      </Routes>

    </div>

  </div>

</BrowserRouter>


);

}

export default App;
