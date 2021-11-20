import { doc, setDoc } from "@firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "simplemde/dist/simplemde.min.css";
import SimpleMDE from "simplemde/dist/simplemde.min.js";
import { navbar, footer } from "../../../elements";
import { firestore } from "../../../modules/firebase";

// show html body
document.body.style.display = "block";

// add navbar & footer
document.body.insertAdjacentElement("afterbegin", navbar(true));
document.body.insertAdjacentElement("beforeend", footer());

const titleInput = document.getElementById("title-input");
const imageInput = document.getElementById("image-input");
const descriptionInput = document.getElementById("description-input");
const bodySimpleMde = new SimpleMDE({ element: document.getElementById("body-input") });
const addArticleForm = document.getElementById("add-article-form");

addArticleForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  // Validasi
  if (bodySimpleMde.value().length == 0) {
    alert("Please fill out body field!");
    return;
  }

  // Jika validation sudah terpenuhi lalu publish Article..
  try {
    const docId = Date.now().toString();
    await setDoc(doc(firestore, "articles", docId), {
      id: docId,
      title: titleInput.value,
      image: imageInput.value,
      description: descriptionInput.value,
      body: bodySimpleMde.value(),
    });

    alert("Article successfully created!");

    // redirect
    window.location.pathname = "/admin/";
  } catch (error) {
    console.error(error);
    alert("Failed to submit article!");
  }
});
