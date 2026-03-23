import React, { useState } from "react";
import { loginUser, registerUser } from "../utils/localAuth";

const ScoutLogin = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    try {
      loginUser(username, password);
      alert("Logged in!");
      window.location.reload();
    } catch {
      alert("Invalid login");
    }
  };

  const handleRegister = () => {
    try {
      registerUser(username, password);
      alert("Account created!");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Login</h1>

      <input placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      <input type="password" placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default ScoutLogin;
