function toggleText() {
  document
    .querySelector(".toggle-text-button")
    .addEventListener("click", () => {
      document.querySelector("#text").toggleAttribute("hidden");
    });
}
