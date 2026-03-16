import React, { useState } from "react";
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

const [scoutName, setScoutName] = useState(
localStorage.getItem("scoutName")
);

function handleLogin(name) {
localStorage.setItem("scoutName", name);
setScoutName(name);
}

return (


<BrowserRouter>

  <div style={{ minHeight: "100vh", background: "#111", color: "white" }}>

    <Navbar />

    <div style={{ padding: "20px" }}>

      <Routes>

        <Route
          path="/login"
          element={<ScoutLogin onLogin={handleLogin} />}
        />

        <Route
          path="/"
          element={
            scoutName
              ? <EventSelect />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/matches/:eventKey"
          element={
            scoutName
              ? <MatchList />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/scout/:eventKey/:matchNumber"
          element={
            scoutName
              ? <ScoutForm />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/robots"
          element={
            scoutName
              ? <RobotSelect />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/dashboard"
          element={
            scoutName
              ? <Dashboard />
              : <Navigate to="/login" />
          }
        />

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
