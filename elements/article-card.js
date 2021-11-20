export default function (data, isAdmin = false) {
  const element = document.createElement("div");

  element.innerHTML = `
    <div class="card" style="overflow: hidden">
      <div class="d-flex flex-row" style="height: 175px">
        <div style="width: 40%">
          <div
            class="bg-secondary"
            style="
              background-image: url(${data.image});
              width: 100%;
              height: 100%;
              background-repeat: no-repeat;
              background-size: cover;
              background-position: center;
            "
          >
            <img src="${data.image}" width="100%" height="100%" style="opacity:0">
          </div>
        </div>
        <div class="card-body pt-3 pb-3" style="width: 60%; position: relative; margin-top: 10px; margin-bottom: 10px">
          <div
            style="
              position: absolute;
              top: 0;
              overflow: hidden;
              text-overflow: ellipsis;
              height: 72%;

            "
          >
            <h5 class="card-title">${data.title}</h5>
            <p class="card-text" style="line-height: 1">${data.description}</p>
          </div>
          <div style="position: absolute; bottom: 0; padding-top: 10px">
            <a class="read-article-link btn btn-primary" href="/article/?id=${
              data.id
            }">Read article</a>
          </div>
        </div>
      </div>
      ${(() => {
        if (isAdmin) {
          return `
            <div class="position-absolute top-0">
              <div>
                <a type="button" class="btn btn-success" href="/admin/edit-article/?id=${data.id}">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-pencil-square"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                    ></path>
                  </svg>
                </a>
              </div>
              <div>
                <button
                type="button"
                class="btn btn-danger"
                data-bs-toggle="modal"
                data-bs-target="#delete-article-modal-${data.id}">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-trash-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"
                    ></path>
                  </svg>
                </button>
                <div
                  class="modal fade"
                  id="delete-article-modal-${data.id}"
                  tabindex="-1"
                  aria-labelledby="delete-article-modal-label-${data.id}"
                  aria-hidden="true"
                >
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="delete-article-modal-label-${data.id}">Delete Article</h5>
                      </div>
                      <div class="modal-body">Are you sure you want to delete the "<b>${data.title}</b>" article?</div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                        <button id="confirm-delete-article-button-${data.id}" article-id="${data.id}" type="button" class="btn btn-danger" data-bs-dismiss="modal">Yes</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        } else {
          return "";
        }
      })()}
    </div>
  `;
  return element;
}
