import { onAuthStateChanged } from "@firebase/auth";
import {
  getDownloadURL,
  getMetadata,
  list,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "@firebase/storage";
import {
  setDoc,
  doc,
  getDocs,
  query,
  collection,
  orderBy,
  limit,
  startAfter,
} from "@firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import { alert, footer, loader, navbar } from "../../../elements";
import { auth, firestore, storage } from "../../../modules/firebase";

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

  // loader
  const filesContainerLoader = loader();
  filesContainer.insertAdjacentElement("beforeend", filesContainerLoader);

  // Limit files
  const limitFiles = 10;

  // latest File
  let latestFile = null;

  // loading Files condition
  let isLoadingFiles = false;

  // load first files
  getFiles(
    query(collection(firestore, "files"), orderBy("timeCreated", "desc"), limit(limitFiles))
  );

  // load more articles on scrolled to bottom
  filesContainer.addEventListener("scroll", onFilesContainerScrolledToBottom);

  function onFilesContainerScrolledToBottom() {
    const triggerHeight = filesContainer.scrollTop + filesContainer.offsetHeight;
    if (triggerHeight >= filesContainer.scrollHeight) {
      getFiles(
        query(
          collection(firestore, "files"),
          orderBy("timeCreated", "desc"),
          startAfter(latestFile),
          limit(limitFiles)
        )
      );
    }
  }

  async function getFiles(query) {
    try {
      if (isLoadingFiles) return;
      isLoadingFiles = true;
      // add loader to files container
      filesContainer.insertAdjacentElement("beforeend", filesContainerLoader);

      // Get files
      const files = await getDocs(query);

      if (files.empty) {
        filesContainer.removeEventListener("scroll", onFilesContainerScrolledToBottom);
        return;
      }

      let index = 1;
      files.forEach(async (file) => {
        file = file.data();

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
              ${file.name}
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
                          background-image: url(${file.url});
                          overflow: hidden;
                          background-position: center;
                          background-size: contain;
                          background-repeat: no-repeat;
                        "
                      >
                        <img
                          src="${file.url}"
                          style="opacity: 0"
                        />
                      </div>
                    </div>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                      <div class="fw-bold">Name</div>
                      <a href="${file.url}" target="_blank">${file.name}</a>
                    </div>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                      <div class="fw-bold">Media Type</div>
                      ${file.mediaType}
                    </div>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                      <div class="fw-bold">Size</div>
                      ${Number(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                      <div class="fw-bold">Date Uploaded</div>
                      ${new Date(file.timeCreated).toLocaleDateString()}
                    </div>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto" style="word-break: break-all">
                      <div class="fw-bold">URL</div>
                      <div>
                        ${file.url}
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
                        })('${file.url}')
                          .then(() => window.alert('URL copied!'))
                          .catch(() => window.alert('Failed to copy URL!'));
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
        // increment latest files
        latestFile = files.docs[files.docs.length - 1];
      });
    } catch (error) {
      console.error(error);
      // Error alert
      filesContainer.insertAdjacentElement("afterbegin", alert("danger", "Failed to get files!"));
    } finally {
      // Remove loader
      filesContainer.removeChild(filesContainerLoader);
      isLoadingFiles = false;
    }
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
        console.error(error);
        window.alert("Upload file failed!");
        uploadProgess.style.display = "none";
      },
      async () => {
        // Jika berhasil mengupload file ke Cloud Storage Firebase
        try {
          const fileMetaData = await getMetadata(ref(storage, fileName));
          const fileUrl = await getDownloadURL(ref(storage, fileName));

          await setDoc(doc(firestore, "files", fileName), {
            name: fileName,
            mediaType: fileMetaData.contentType,
            size: fileMetaData.size,
            timeCreated: fileMetaData.timeCreated,
            url: fileUrl,
          });

          window.alert("File uploaded!");
          // Refresh page
          window.location.reload();
        } catch (error) {
          console.error(error);
          window.alert("Upload file failed!");
          uploadProgess.style.display = "none";

          deleteObject(ref(storage, fileName));
        }
      }
    );
  });
});
