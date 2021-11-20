import { doc, setDoc } from "@firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";
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
const bodyInput = new EasyMDE({
  element: document.getElementById("body-input"),
  placeholder: "Body",
  showIcons: ["bold", "italic", "strikethrough", "heading", "redo", "undo", "horizontal-rule"],
});
const addArticleForm = document.getElementById("add-article-form");

addArticleForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  // Validasi
  if (bodyInput.value().length == 0) {
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
      body: bodyInput.value(),
    });

    alert("Article successfully created!");

    // redirect
    window.location.pathname = "/admin/";
  } catch (error) {
    console.error(error);
    alert("Failed to submit article!");
  }
});
