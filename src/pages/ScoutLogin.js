import React, { useState } from "react";
import { loginUser, registerUser } from "../utils/localAuth";
import { useNavigate } from "react-router-dom";

const ScoutLogin = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    try {
      loginUser(username, password);
      navigate("/team-select");
    } catch {
      alert("Invalid login");
    }
  };

  const handleRegister = () => {
    try {
      registerUser(username, password);
      navigate("/team-select");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <h1>Login / Register</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default ScoutLogin;
