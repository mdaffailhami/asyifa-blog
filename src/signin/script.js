import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from "../../modules/firebase";
import { footer, navbar } from "../../elements";

// show html body
document.body.style.display = "block";

// show navbar & footer
document.body.insertAdjacentElement("afterbegin", navbar());
document.body.insertAdjacentElement("beforeend", footer());

// elements
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", (e) => {
  // disable form action
  e.preventDefault();

  signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    .then((userCredential) => {
      // redirect
      window.location.pathname = "/admin/";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error code:", errorCode);
      console.error("Error message:", errorMessage);
      alert(errorCode);
    });
});
