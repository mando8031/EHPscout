import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MatchCard from "../components/MatchCard";
import { getMatches } from "../services/tbaService";

const MatchList = () => {
  const { eventKey } = useParams();
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!eventKey) return;

    async function load() {
      const data = await getMatches(eventKey);

      console.log("TBA match response:", data);

      if (Array.isArray(data)) {

        const qmMatches = data.filter(
          m => m.comp_level === "qm"
        );

        setMatches(qmMatches);

      } else {
        setMatches([]);
      }
    }

    load();
  }, [eventKey]);

  const openMatch = (match) => {
    navigate(`/scout/${eventKey}/${match.match_number}`);
  };

  if (!matches || matches.length === 0) {
    return (
      <div>
        <h1 className="text-3xl mb-6">Matches</h1>
        <p>No matches available for this event yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl mb-6">Matches</h1>

      <div className="grid gap-4">
        {matches.map((match) => (
          <MatchCard
            key={match.key}
            match={match}
            onClick={() => openMatch(match)}
          />
        ))}
      </div>
    </div>
  );
};

export default MatchList;
