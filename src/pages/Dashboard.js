import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import StatChart from "../components/StatChart";
import { calculateTeamStats } from "../utils/statsCalculator";

const Dashboard = () => {

  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [topTeams, setTopTeams] = useState([]);
  const [bestStats, setBestStats] = useState({});

  useEffect(() => {

    async function load() {

      try {

        const snapshot = await getDocs(collection(db, "scouting"));
        const data = snapshot.docs.map(doc => doc.data());

        const calculated = calculateTeamStats(data);

        setStats(calculated);

        const sorted = [...calculated].sort((a,b)=>b.overall-a.overall);
        setTopTeams(sorted.slice(0,5));

        setBestStats({
          auton: sorted.reduce((a,b)=>a.auton>b.auton?a:b),
          climb: sorted.reduce((a,b)=>a.climb>b.climb?a:b),
          accuracy: sorted.reduce((a,b)=>a.accuracy>b.accuracy?a:b)
        });

      } catch (err) {

        console.error("Dashboard load error:", err);

      }

      setLoading(false);

    }

    load();

  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl mb-6">Team Statistics</h1>
        <p>Loading scouting data...</p>
      </div>
    );
  }

  return (
    <div>

      <h1 className="text-3xl mb-6">Team Statistics Dashboard</h1>

      {/* Top Teams */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-3">Top Teams</h2>
        <ul>
          {topTeams.map((t,i)=>(
            <li key={t.team}>
              #{i+1} Team {t.team} — {t.overall.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      {/* Best Categories */}
      <div className="mb-10 grid grid-cols-3 gap-6">

        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Best Auton</h3>
          <p>Team {bestStats.auton?.team}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Best Climb</h3>
          <p>Team {bestStats.climb?.team}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Best Accuracy</h3>
          <p>Team {bestStats.accuracy?.team}</p>
        </div>

      </div>

      {/* Chart */}
      <StatChart data={stats} />

    </div>
  );
};

export default Dashboard;
