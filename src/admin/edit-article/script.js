import { doc, getDoc, updateDoc } from "@firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";
import { navbar, footer } from "../../../elements";
import { firestore } from "../../../modules/firebase";

// show html body after success getting article from database
// document.body.style.display = "block";

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

const docId = getQueryVariable("id");

// add default value to form
getDoc(doc(firestore, "articles", docId))
  .then((article) => {
    article = article.data();

    titleInput.value = article.title;
    imageInput.value = article.image;
    descriptionInput.value = article.description;

    // Show html body
    document.body.style.display = "block";

    // set article body value after showing html body because there's a bug
    bodyInput.value(article.body);
  })
  .catch((error) => {
    console.error(error);
    window.alert("Article not found!");

    // Redirect and clear query string
    window.location.href = window.location.origin + "/admin/";
  });

// Form event when submitted
addArticleForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  // Validasi
  if (bodyInput.value().length == 0) {
    alert("Please fill out body field!");
    return;
  }

  // Jika validation sudah terpenuhi lalu publish Article..
  try {
    // const docId = getQueryVariable("id");

    await updateDoc(doc(firestore, "articles", docId), {
      title: titleInput.value,
      image: imageInput.value,
      description: descriptionInput.value,
      body: bodyInput.value(),
      keywords: titleInput.value.toLowerCase().split(" "),
    });

    alert("Article successfully edited!");

    // Redirect and clear query string
    window.location.href = window.location.origin + "/admin/";
  } catch (error) {
    console.error(error);
    alert("Failed to edit article!");
  }
});

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  console.log("Query variable %s not found", variable);
}
