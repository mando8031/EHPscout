import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

import { db } from "../firebase";
import { calculateTeamStats } from "../utils/statsCalculator";

const Picklist = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const load = async () => {
      const snapshot = await getDocs(collection(db, "scouting"));

      const data = snapshot.docs.map((doc) => doc.data());

      const stats = calculateTeamStats(data);

      setTeams(stats);
    };

    load();
  }, []);

  return (
    <div>
      <h1 className="text-3xl mb-6">Picklist</h1>

      {teams.map((team) => (
        <div
          key={team.team}
          className="bg-gray-800 p-4 rounded mb-3"
        >
          Team {team.team} — {team.score}
        </div>
      ))}
    </div>
  );
};

export default Picklist;
