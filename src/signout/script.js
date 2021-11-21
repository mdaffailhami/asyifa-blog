import { signOut } from "@firebase/auth";
import { auth } from "../../modules/firebase";

const confirmation = window.confirm("Are you sure you want to sign out?");

if (confirmation) {
  signOut(auth)
    .then(() => {
      window.location.href = "/signin/";
    })
    .catch((error) => {
      console.error(error);
    });
} else {
  history.back();
}
