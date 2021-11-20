export default function (variant, text) {
  const element = document.createElement("div");
  element.innerHTML = `
  <div class="alert alert-${variant}">
    <b>${text}</b>
  </div>
  `;
  return element;
}
