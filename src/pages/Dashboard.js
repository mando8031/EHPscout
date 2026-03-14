import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import StatChart from "../components/StatChart";
import { calculateTeamStats } from "../utils/statsCalculator";

const Dashboard = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    async function load() {
      const snapshot = await getDocs(collection(db, "scouting"));
      const data = snapshot.docs.map((doc) => doc.data());
      const calculated = calculateTeamStats(data);
      setStats(calculated);
    }

    load();
  }, []);

  return (
    <div>
      <h1 className="text-3xl mb-6">Team Statistics</h1>
      <StatChart data={stats} />
    </div>
  );
};

export default Dashboard;
