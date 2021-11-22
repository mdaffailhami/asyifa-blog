export default function (title, image, description) {
  const element = document.createElement("div");

  // convert string to html (\n to <br />)
  function nl2br(str) {
    return (str + "").replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "$1" + "<br />" + "$2");
  }
  description = nl2br(description);

  element.innerHTML = `
    <div
      style="
        width: 100vw;
        height: 40vh;
        max-height: 300px;
        background-image: url(${image});
        background-size: cover;
        overflow: hidden;
      "
    >
      <div
        style="width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); position: relative"
      >
        <center>
          <div
            id="banner-content"
            style="
              width: 300px;
              height: 60%;
              margin: 0;
              position: absolute;
              top: 60%;
              left: 50%;
              -ms-transform: translate(-50%, -50%);
              transform: translate(-50%, -50%);
            "
          >
            <h1 class="text-light">${title}</h1>
            <p id="banner-description" style="color: rgb(200, 200, 200)">${description}</p>
          </div>
        </center>
      </div>
    </div>
  `;

  return element;
}
