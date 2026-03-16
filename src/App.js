import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import ScoutLogin from "./pages/ScoutLogin";
import EventSelect from "./pages/EventSelect";
import MatchList from "./pages/MatchList";
import ScoutForm from "./pages/ScoutForm";
import MatchBoard from "./pages/MatchBoard";

import RobotSelect from "./pages/RobotSelect";
import Dashboard from "./pages/Dashboard";
import Picklist from "./pages/Picklist";

function App() {

return (


<BrowserRouter>

  <div style={{ minHeight: "100vh", background: "#111", color: "white" }}>

    <Navbar />

    <div style={{ padding: "20px" }}>

      <Routes>

        {/* Scout login */}
        <Route path="/login" element={<ScoutLogin />} />

        {/* Event selection */}
        <Route path="/" element={<EventSelect />} />

        {/* Match selection for an event */}
        <Route path="/matches/:eventKey" element={<MatchList />} />

        {/* Scout a specific match */}
        <Route path="/scout/:eventKey/:matchNumber" element={<ScoutForm />} />

        {/* Live scouting activity */}
        <Route path="/board" element={<MatchBoard />} />

        {/* Robot analysis */}
        <Route path="/robots" element={<RobotSelect />} />

        {/* Live rankings */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Alliance picklist */}
        <Route path="/picklist" element={<Picklist />} />

      </Routes>

    </div>

  </div>

</BrowserRouter>


);

}

export default App;
