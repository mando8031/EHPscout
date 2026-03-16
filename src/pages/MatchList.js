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

      if (Array.isArray(data)) {
        setMatches(data);
      } else {
        setMatches([]);
      }
    }

    load();
  }, [eventKey]);

  const openMatch = (match) => {
    navigate(`/scout/${eventKey}/${match.match_number}`);
  };

  // ---- SORT MATCHES ----

  const qualificationMatches = matches
    .filter((m) => m.comp_level === "qm")
    .sort((a, b) => a.match_number - b.match_number);

  const playoffMatches = matches
    .filter((m) => m.comp_level !== "qm")
    .sort((a, b) => a.match_number - b.match_number);

  // ---- MATCH NAME BUILDER ----

  function getMatchName(match) {
    if (match.comp_level === "qm") {
      return `Qualification Match ${match.match_number}`;
    }

    if (match.comp_level === "qf") {
      return `Quarterfinal ${match.set_number} Match ${match.match_number}`;
    }

    if (match.comp_level === "sf") {
      return `Semifinal ${match.set_number} Match ${match.match_number}`;
    }

    if (match.comp_level === "f") {
      return `Final ${match.match_number}`;
    }

    return `Match ${match.match_number}`;
  }

  if (matches.length === 0) {
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

      {/* Qualification Matches */}

      {qualificationMatches.length > 0 && (
        <>
          <h2 className="text-2xl mb-4">Qualification Matches</h2>

          <div className="grid gap-4 mb-8">
            {qualificationMatches.map((match) => (
              <button
                key={match.key}
                onClick={() => openMatch(match)}
                className="p-4 bg-gray-700 rounded"
              >
                {getMatchName(match)}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Playoff Matches */}

      {playoffMatches.length > 0 && (
        <>
          <h2 className="text-2xl mb-4">Playoff Matches</h2>

          <div className="grid gap-4">
            {playoffMatches.map((match) => (
              <button
                key={match.key}
                onClick={() => openMatch(match)}
                className="p-4 bg-gray-700 rounded"
              >
                {getMatchName(match)}
              </button>
            ))}
          </div>
        </>
      )}

    </div>
  );
};

export default MatchList;
