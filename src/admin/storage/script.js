import { onAuthStateChanged } from "@firebase/auth";
import { getDownloadURL, getMetadata, list, ref } from "@firebase/storage";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import { footer, navbar } from "../../../elements";
import { auth, storage } from "../../../modules/firebase";

// Check user
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location = "/signin/"; //If User is not logged in, redirect to login page
    return;
  }
  // show html body
  document.body.style.display = "block";

  // add navbar & footer
  document.body.insertAdjacentElement("afterbegin", navbar(true));
  document.body.insertAdjacentElement("beforeend", footer());

  // tes
  const filesContainer = document.getElementById("files-container");
  const files = await list(ref(storage), { maxResults: 50 });

  let index = 1;
  files.items.forEach(async (file) => {
    const fileUrl = await getDownloadURL(ref(storage, file.fullPath));
    const fileMetaData = await getMetadata(ref(storage, file.fullPath));

    filesContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div id="item-${index}" class="accordion-item">
        <h2 class="accordion-header" id="heading-${index}">
          <button
            class="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapse-${index}"
            aria-expanded="true"
            aria-controls="collapse-${index}"
          >
            ${file.name}
          </button>
        </h2>
        <div
          id="collapse-${index}"
          class="accordion-collapse collapse show"
          aria-labelledby="heading-${index}"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            <img src="${fileUrl}" alt=""/>
            ${fileMetaData.size}
            ${fileMetaData.timeCreated}
            ${fileUrl}
          </div>
        </div>
      </div>
    `
    );

    // Increment index
    index++;
  });
});
