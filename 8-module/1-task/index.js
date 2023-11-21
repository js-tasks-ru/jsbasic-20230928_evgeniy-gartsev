import createElement from "../../assets/lib/create-element.js";

export default class CartIcon {
  constructor() {
    this.render();

    this.addEventListeners();
  }

  render() {
    this.elem = createElement('<div class="cart-icon"></div>');
  }

  update(cart) {
    if (!cart.isEmpty()) {
      this.elem.classList.add("cart-icon_visible");

      this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart
            .getTotalPrice()
            .toFixed(2)}</span>
        </div>`;

      this.updatePosition();

      this.elem.classList.add("shake");
      this.elem.addEventListener(
        "transitionend",
        () => {
          this.elem.classList.remove("shake");
        },
        { once: true }
      );
    } else {
      this.elem.classList.remove("cart-icon_visible");
    }
  }

  addEventListeners() {
    document.addEventListener("scroll", () => this.updatePosition());
    window.addEventListener("resize", () => this.updatePosition());
  }

  updatePosition() {
    if (!this.elem.offsetWidth || !this.elem.offsetHeight) {
      return;
    }

    const cartCoords = this.elem.getBoundingClientRect();
    const containerCoords = document.querySelector(".container").getBoundingClientRect();

    if (cartCoords.top < 0) {
      let left = containerCoords.right + 20;
      if (document.documentElement.clientWidth - left - this.elem.offsetWidth < 10) {
        left = document.documentElement.clientWidth - this.elem.offsetWidth - 10;
      }

      Object.assign(this.elem.style, {
        position: "fixed",
        top: 50 + "px",
        left: left + "px",
        zIndex: 1000,
      });
    }

    if (window.pageYOffset < 5) {
      Object.assign(this.elem.style, {
        position: "absolute",
        top: "",
        left: "",
        zIndex: "",
      });
    }
  }
}
