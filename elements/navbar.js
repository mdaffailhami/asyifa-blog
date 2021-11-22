export default function (isAdmin = false) {
  const element = document.createElement("div");

  element.innerHTML = `
    <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-secondary">
      <style>
        body {
          padding-top: 50px;
        }
      </style>
      <div class="container-fluid">
        <a class="navbar-brand" href="/"><strong>Home</strong></a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            ${(() => {
              if (isAdmin) {
                return `
                  <li class="nav-item">
                    <a class="nav-link" aria-current="page" href="/admin/">Admin</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" aria-current="page" href="/admin/storage/">Storage</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" aria-current="page" href="/admin/settings/">Settings</a>
                  </li>
                  <li id="sign-out-button" class="nav-item">
                    <a class="nav-link" aria-current="page" href="/signout/">Sign out</a>
                  </li>
                `;
              } else {
                return "";
              }
            })()}
          </ul>
          <!-- <form class="d-flex">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form> -->
        </div>
      </div>
    </nav>
  `;
  return element;
}
