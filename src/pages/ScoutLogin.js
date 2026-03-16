import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const ScoutLogin = () => {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const navigate = useNavigate();

async function login(e) {


e.preventDefault();

try {

  await signInWithEmailAndPassword(auth, email, password);

  navigate("/");

} catch (err) {

  alert("Login failed");
  console.error(err);

}


}

return (


<div style={{
  maxWidth: "400px",
  margin: "auto",
  padding: "40px"
}}>

  <h1>Scout Login</h1>

  <form onSubmit={login}>

    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e)=>setEmail(e.target.value)}
      style={{ width: "100%", padding: "12px", marginBottom: "10px" }}
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
      style={{ width: "100%", padding: "12px", marginBottom: "20px" }}
    />

    <button
      type="submit"
      style={{
        width: "100%",
        padding: "12px",
        background: "#3498db",
        color: "white",
        border: "none"
      }}
    >
      Login
    </button>

  </form>

</div>


);

};

export default ScoutLogin;
