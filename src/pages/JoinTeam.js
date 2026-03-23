import React, { useState } from "react";
import { joinTeamWithCode } from "../utils/localTeams";
import { getCurrentUser } from "../utils/localAuth";
import { useNavigate } from "react-router-dom";

const JoinTeam = () => {

  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {

    const user = getCurrentUser();

    try {
      joinTeamWithCode(code, user.username);
      alert("Joined team!");
      navigate("/dashboard");
    } catch (e) {
      alert("Invalid code");
    }
  };

  return (
    <div>
      <h1>Join Team</h1>

      <input
        placeholder="Join Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button onClick={handleJoin}>Join</button>
    </div>
  );
};

export default JoinTeam;
