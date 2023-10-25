function initCarousel() {
  const moveLeft = document.querySelector(".carousel__arrow_left");
  const moveRight = document.querySelector(".carousel__arrow_right");
  const carouselInner = document.querySelector(".carousel__inner");
  const carouselWidth = Array.from(carouselInner.children).reduce(
    (accum, elem) => accum + elem.offsetWidth,
    0
  );
  const carouselElemWidth = carouselInner.children[0].offsetWidth;
  moveLeft.style.display = "none";

  document.addEventListener("click", (event) => {
    const isMoveLeft = event.target
      .closest("DIV")
      ?.classList.contains("carousel__arrow_left");
    const isMoveRight = event.target
      .closest("DIV")
      ?.classList.contains("carousel__arrow_right");

    if (isMoveRight) {
      const translateXOffset =
        getCurrentTranslateXOffset(carouselInner.style.transform) -
        carouselElemWidth;
      const target = event.target.closest("DIV");
      carouselInner.style.transform = `translateX(${translateXOffset}px)`;

      if (-translateXOffset >= carouselWidth - carouselElemWidth) {
        target.style.display = "none";
      }
      moveLeft.style.display = "";
    }

    if (isMoveLeft) {
      const translateXOffset =
        getCurrentTranslateXOffset(carouselInner.style.transform) +
        carouselElemWidth;
      const target = event.target.closest("DIV");
      carouselInner.style.transform = `translateX(${translateXOffset}px)`;

      if (translateXOffset >= 0) {
        target.style.display = "none";
      }
      moveRight.style.display = "";
    }
  });

  function getCurrentTranslateXOffset(styleTranslateX) {
    let match = styleTranslateX.match(/translateX\((.+?)px\)/);
    return match ? Number(match[1]) : 0;
  }
}
