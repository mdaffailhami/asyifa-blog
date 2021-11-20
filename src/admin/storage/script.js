import { onAuthStateChanged } from "@firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import { footer, navbar } from "../../../elements";
import { auth } from "../../../modules/firebase";

// Check user
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location = "/signin/"; //If User is not logged in, redirect to login page
    return;
  }
  // show html body
  document.body.style.display = "block";

  // add navbar & footer
  document.body.insertAdjacentElement("afterbegin", navbar(true));
  document.body.insertAdjacentElement("beforeend", footer());
});
