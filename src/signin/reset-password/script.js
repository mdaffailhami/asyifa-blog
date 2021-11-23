import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";
import { sendPasswordResetEmail } from "@firebase/auth";
import { auth } from "../../../modules/firebase";
import { alert, footer, navbar } from "../../../elements";

// show html body
document.body.style.display = "block";

// show navbar & footer
document.body.insertAdjacentElement("afterbegin", navbar());
document.body.insertAdjacentElement("beforeend", footer());

// elements
const resetPasswordForm = document.getElementById("reset-password-form");
const emailInput = document.getElementById("email-input");
const alertContainer = document.getElementById("alert-container");

resetPasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  alertContainer.innerHTML = "";

  try {
    await sendPasswordResetEmail(auth, emailInput.value);
    alertContainer.insertAdjacentElement(
      "afterbegin",
      alert("success", "Verification email has been sent to " + emailInput.value)
    );
  } catch (error) {
    alertContainer.insertAdjacentElement("afterbegin", alert("Failed to send verification email!"));
    window.alert("Failed to send verification email!");
    console.error(error);
  }
});
