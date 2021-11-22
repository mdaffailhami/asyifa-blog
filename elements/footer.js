export default function () {
  const element = document.createElement("div");
  element.innerHTML = `
    <footer class="py-3 my-4">
      <p class="text-center text-muted">&copy; MDI</p>
    </footer>
  `;
  return element;
}
