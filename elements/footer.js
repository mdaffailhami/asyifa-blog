export default function () {
  const element = document.createElement("div");
  element.innerHTML = `
    <footer class="py-3 my-4">
      <p class="text-center text-muted">Copyright &copy; MDI. All Rights Reserved</p>
    </footer>
  `;
  return element;
}
