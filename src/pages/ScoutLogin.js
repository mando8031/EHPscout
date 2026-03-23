import React, { useState } from "react";
import { loginUser, registerUser } from "../utils/localAuth";
import { useNavigate } from "react-router-dom";

const ScoutLogin = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); //  VERY IMPORTANT

    console.log("Login clicked");

    if (!username || !password) {
      alert("Enter username and password");
      return;
    }

    setLoading(true);

    try {
      loginUser(username, password);

      console.log("Login success");

      navigate("/team-select");

    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid login");
    }

    setLoading(false);
  };

  const handleRegister = (e) => {
    e.preventDefault(); //  VERY IMPORTANT

    console.log("Register clicked");

    if (!username || !password) {
      alert("Enter username and password");
      return;
    }

    setLoading(true);

    try {
      registerUser(username, password);

      console.log("Register success");

      navigate("/team-select");

    } catch (err) {
      console.error("Register failed:", err);
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>

      <h1>Login / Create Account</h1>

      <form>

        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "20px" }}
        />

        <button
          onClick={handleLogin}
          style={{ width: "100%", padding: "15px", marginBottom: "10px" }}
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <button
          onClick={handleRegister}
          style={{ width: "100%", padding: "15px" }}
        >
          Create Account
        </button>

      </form>

    </div>
  );
};

export default ScoutLogin;
