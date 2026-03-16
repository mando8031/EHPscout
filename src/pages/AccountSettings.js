import React from "react";
import { auth, db } from "../firebase";
import { deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AccountSettings = () => {

const navigate = useNavigate();

async function deleteAccount() {

const confirmDelete = window.confirm(
  "Are you sure you want to delete your account? This cannot be undone."
);

if (!confirmDelete) return;

try {

  const user = auth.currentUser;

  if (!user) {
    alert("No user logged in");
    return;
  }

  const uid = user.uid;

  await deleteDoc(doc(db, "users", uid));

  await deleteUser(user);

  alert("Account deleted");

  navigate("/login");

} catch (err) {

  console.error(err);

  if (err.code === "auth/requires-recent-login") {
    alert("Please log out and log back in before deleting your account.");
  } else {
    alert("Error deleting account");
  }

}


}

return (


<div style={{maxWidth:"500px",margin:"auto"}}>

  <h2>Account Settings</h2>

  <p>
    Deleting your account will permanently remove your login and profile.
  </p>

  <button
    onClick={deleteAccount}
    style={{
      background:"red",
      color:"white",
      padding:"10px 20px",
      border:"none",
      borderRadius:"6px"
    }}
  >
    Delete Account
  </button>

</div>


);

};

export default AccountSettings;
