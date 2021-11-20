export default function () {
  const element = document.createElement("div");
  element.innerHTML = `
    <center>
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </center>
  `;
  return element;
  // return `
  //   <center>
  //     <div class="spinner-border text-success" role="status">
  //       <span class="visually-hidden">Loading...</span>
  //     </div>
  //   </center>
  // `;
}
