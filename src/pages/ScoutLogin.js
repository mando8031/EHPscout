import React, { useState } from "react";
import { loginUser, registerUser } from "../utils/localAuth";

const ScoutLogin = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // login or register

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Enter username and password");
      return;
    }

    try {
      if (mode === "login") {
        loginUser(username, password);
      } else {
        registerUser(username, password);
        alert("Account created! Now log in.");
        setMode("login");
        return;
      }

      // 🔥 FORCE APP TO SEE NEW USER
      window.location.href = "/team-select";

    } catch (err) {
      console.error("Auth error:", err);
      alert(err.message || "Error");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>

      <h1>{mode === "login" ? "Login" : "Create Account"}</h1>

      <form onSubmit={handleSubmit}>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "20px" }}
        />

        <button
          type="submit"
          style={{ width: "100%", padding: "15px", marginBottom: "10px" }}
        >
          {mode === "login" ? "Login" : "Create Account"}
        </button>

      </form>

      <button
        onClick={() =>
          setMode(mode === "login" ? "register" : "login")
        }
        style={{ width: "100%", padding: "10px" }}
      >
        {mode === "login"
          ? "Switch to Create Account"
          : "Switch to Login"}
      </button>

    </div>
  );
};

export default ScoutLogin;
