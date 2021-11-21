import { onAuthStateChanged } from "@firebase/auth";
import { getDownloadURL, getMetadata, list, ref, uploadBytesResumable } from "@firebase/storage";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import { alert, footer, loader, navbar } from "../../../elements";
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

  // elements
  const filesContainer = document.getElementById("files-container");
  const fileInput = document.getElementById("file-input");
  const uploadProgess = document.getElementById("upload-progress");

  // add loader to files container
  const filesContainerLoader = loader();
  filesContainer.insertAdjacentElement("afterbegin", filesContainerLoader);

  try {
    // Get files
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
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapse-${index}"
              aria-expanded="true"
              aria-controls="collapse-${index}"
            >
              ${fileMetaData.name}
            </button>
          </h2>
          <div
            id="collapse-${index}"
            class="accordion-collapse collapse"
            aria-labelledby="heading-${index}"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
              <div class="bg-danger">
                <ol class="list-group list-group-flush">
                  <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                      <div
                        class="border"
                        style="
                          width: 200px;
                          height: 200px;
                          background-image: url(${fileUrl});
                          overflow: hidden;
                          background-position: center;
                          background-size: contain;
                          background-repeat: no-repeat;
                        "
                      >
                        <img
                          src="${fileUrl}"
                          style="opacity: 0"
                        />
                      </div>
                    </div>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                      <div class="fw-bold">Name</div>
                      <a href="${fileUrl}" target="_blank">${fileMetaData.name}</a>
                    </div>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                      <div class="fw-bold">Uploaded</div>
                      ${new Date(fileMetaData.timeCreated).toLocaleDateString()}
                    </div>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto" style="word-break: break-all">
                      <div class="fw-bold">URL</div>
                      <div>
                        ${fileUrl}
                      </div>
                      <button
                        class="btn btn-primary"
                        onclick="((textToCopy) => {
                          // navigator clipboard api needs a secure context (https)
                          if (navigator.clipboard && window.isSecureContext) {
                              // navigator clipboard api method'
                              return navigator.clipboard.writeText(textToCopy);
                          } else {
                              // text area method
                              let textArea = document.createElement('textarea');
                              textArea.value = textToCopy;
                              // make the textarea out of viewport
                              textArea.style.position = 'fixed';
                              textArea.style.left = '-999999px';
                              textArea.style.top = '-999999px';
                              document.body.appendChild(textArea);
                              textArea.focus();
                              textArea.select();
                              return new Promise((res, rej) => {
                                  // here the magic happens
                                  document.execCommand('copy') ? res() : rej();
                                  textArea.remove();
                              });
                          }
                        })('${fileUrl}')
                          .then(() => window.alert('Text copied!'))
                          .catch(() => window.alert('Failed to copy text!'));
                        "
                      >
                        Copy URL
                      </button>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      `
      );

      // Increment index
      index++;
    });
  } catch (error) {
    console.error(error);
    // Error alert
    filesContainer.insertAdjacentElement("afterbegin", alert("danger", "Failed to fetch data!"));
  } finally {
    // Remove loader
    filesContainer.removeChild(filesContainerLoader);
  }

  // Upload File handler
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    // Generate file name
    let fileName = file.name.split(".");
    fileName.splice(fileName.length - 1, 0, Date.now().toString());
    fileName = fileName.join(".");

    const upload = uploadBytesResumable(ref(storage, fileName), file);
    uploadProgess.style.display = "block";

    upload.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        uploadProgess.value = progress;
      },
      (error) => {
        console.log(error);
        window.alert("Upload file failed!");
      },
      () => {
        window.alert("File uploaded!");
        // Refresh page
        window.location.reload();
      }
    );
  });
});
