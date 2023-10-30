function hideSelf() {
  document
    .querySelector(".hide-self-button")
    .addEventListener("click", function (event) {
      this.hidden = true;
    });
}
