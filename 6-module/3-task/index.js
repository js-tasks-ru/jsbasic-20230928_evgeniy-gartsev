import createElement from "../../assets/lib/create-element.js";

export default class Carousel {
  constructor(slides) {
    this.slides = slides;
    this.elem = createElement(`
    <!--Корневой элемент карусели-->
    <div class="carousel">
      <!--Кнопки переключения-->
      <div class="carousel__arrow carousel__arrow_right">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </div>
      <div class="carousel__arrow carousel__arrow_left" style="display: none;">
        <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
      </div>
      <div class="carousel__inner">
        ${this.cards}
      </div>
    </div>
    `);

    this._addEvents();
    this.currentIndex = 0;
    this.currentTranslateX = 0;
  }

  get cards() {
    return this.slides.map(card => {
      return `<div class="carousel__slide" data-id="${card.id}">
      <img src="/assets/images/carousel/${card.image}" class="carousel__img" alt="slide">
        <div class="carousel__caption">
          <span class="carousel__price">€${card.price.toFixed(2)}</span>
          <div class="carousel__title">${card.name}</div>
          <button type="button" class="carousel__button">
            <img src="/assets/images/icons/plus-icon.svg" alt="icon">
          </button>
        </div>
      </div>`;
    }).join("");
  }

  get cardsSizes() {
    return Array.from(this.elem.querySelectorAll(".carousel__slide"))
      .map(e => e.offsetWidth);
  }

  _addEvents() {
    this.elem.addEventListener("click", event => {
      const leftArrow = event.target.closest(".carousel__arrow_left");
      const rightArrow = event.target.closest(".carousel__arrow_right");
      const carouselInner = this.elem.querySelector(".carousel__inner");

      if (rightArrow) {
        this.currentTranslateX -= this.cardsSizes[this.currentIndex];
        carouselInner.style.transform = `translateX(${this.currentTranslateX}px)`;
        this.currentIndex += 1;

        if (this.currentIndex >= this.slides.length - 1) {
          rightArrow.style.display = "none";
        }
        this.elem.querySelector(".carousel__arrow_left").style.display = "";
      }

      if (leftArrow) {
        this.currentTranslateX += this.cardsSizes[this.currentIndex];
        carouselInner.style.transform = `translateX(${this.currentTranslateX}px)`;
        this.currentIndex -= 1;

        if (this.currentIndex <= 0) {
          leftArrow.style.display = "none";
        }
        this.elem.querySelector(".carousel__arrow_right").style.display = "";
      }

      if (event.target.closest(".carousel__button")) {
        const card = event.target.closest(".carousel__slide");
        const productAddEvent = new CustomEvent("product-add", {detail: card.dataset.id, bubbles: true});
        this.elem.dispatchEvent(productAddEvent);
      }
    });
  }
}
