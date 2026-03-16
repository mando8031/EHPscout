import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
signInWithEmailAndPassword,
createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../firebase";

const ScoutLogin = () => {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [creating, setCreating] = useState(false);

const navigate = useNavigate();

async function handleSubmit(e) {


e.preventDefault();

try {

  if (creating) {

    await createUserWithEmailAndPassword(auth, email, password);
    alert("Account created!");

  } else {

    await signInWithEmailAndPassword(auth, email, password);

  }

  navigate("/");

} catch (err) {

  console.error(err);
  alert(err.message);

}


}

return (


<div style={{
  maxWidth: "400px",
  margin: "auto",
  padding: "40px"
}}>

  <h1 style={{ marginBottom: "20px" }}>
    {creating ? "Create Account" : "Scout Login"}
  </h1>

  <form onSubmit={handleSubmit}>

    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e)=>setEmail(e.target.value)}
      style={{
        width: "100%",
        padding: "12px",
        marginBottom: "10px"
      }}
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
      style={{
        width: "100%",
        padding: "12px",
        marginBottom: "20px"
      }}
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
      {creating ? "Create Account" : "Login"}
    </button>

  </form>

  <button
    onClick={()=>setCreating(!creating)}
    style={{
      marginTop: "20px",
      background: "none",
      border: "none",
      color: "#3498db",
      cursor: "pointer"
    }}
  >
    {creating
      ? "Already have an account? Login"
      : "Create a new account"}
  </button>

</div>

);

};

export default ScoutLogin;
