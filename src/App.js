import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import EventSelect from "./pages/EventSelect";
import MatchList from "./pages/MatchList";
import ScoutForm from "./pages/ScoutForm";
import Dashboard from "./pages/Dashboard";
import Picklist from "./pages/Picklist";
import RobotSelect from "./pages/RobotSelect";

function App() {
  return (
    <BrowserRouter>

      <div style={{ minHeight: "100vh", background: "#111", color: "white" }}>

        {/* Top Navigation */}
        <Navbar />

        {/* Page Content */}
        <div style={{ padding: "20px" }}>

          <Routes>

            <Route path="/" element={<EventSelect />} />

            <Route path="/robots" element={<RobotSelect />} />

            <Route path="/matches/:eventKey" element={<MatchList />} />

            <Route path="/scout/:eventKey/:matchNumber" element={<ScoutForm />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/picklist" element={<Picklist />} />

          </Routes>

        </div>

      </div>

    </BrowserRouter>
  );
}

export default App;
