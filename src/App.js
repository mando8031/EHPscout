import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import EventSelect from "./pages/EventSelect";
import MatchList from "./pages/MatchList";
import RobotSelect from "./pages/RobotSelect";
import ScoutForm from "./pages/ScoutForm";
import Dashboard from "./pages/Dashboard";
import Picklist from "./pages/Picklist";

function App(){

  return(

    <BrowserRouter>

      <Navbar/>

      <div className="p-6">

        <Routes>

          <Route path="/" element={<EventSelect/>} />

          <Route path="/matches/:eventKey" element={<MatchList/>} />

          <Route path="/robots" element={<RobotSelect/>} />

          <Route path="/scout" element={<ScoutForm/>} />

          <Route path="/dashboard" element={<Dashboard/>} />

          <Route path="/picklist" element={<Picklist/>} />

        </Routes>

      </div>

    </BrowserRouter>

  )

}

export default App
