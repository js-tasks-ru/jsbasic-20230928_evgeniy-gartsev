import createElement from "../../assets/lib/create-element.js";

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.elem = createElement(`
    <div class="ribbon">
      <button class="ribbon__arrow ribbon__arrow_left">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button>

      <nav class="ribbon__inner">
        ${this.links}
      </nav>

      <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button>
    </div>
    `);

    this.addEvents();
  }

  get links() {
    return this.categories
      .map((v) => {
        return `<a href="#" class="ribbon__item" data-id="${v.id}">${v.name}</a>`;
      })
      .join("");
  }

  addEvents() {
    const ribbonInner = this.elem.querySelector(".ribbon__inner");
    const arrowLeft = this.elem.querySelector(".ribbon__arrow_left");
    const arrowRight = this.elem.querySelector(".ribbon__arrow_right");

    document.addEventListener("click", (event) => {
      const arrow = event.target.closest(".ribbon__arrow");
      const ribbonItem = event.target.closest(".ribbon__item");

      if (arrow) {
        if (arrow.classList.contains("ribbon__arrow_right")) {
          ribbonInner.scrollBy(350, 0);
        }

        if (arrow.classList.contains("ribbon__arrow_left")) {
          ribbonInner.scrollBy(-350, 0);
        }
      }

      if (ribbonItem) {
        event.preventDefault();

        const currentActiveLink = Array.from(
          document.querySelectorAll(".ribbon__item_active")
        ).forEach((e) => {
          e.classList.remove("ribbon__item_active");
        });

        ribbonItem.classList.add("ribbon__item_active");

        const ribbonSelectEvent = new CustomEvent("ribbon-select", {
          detail: event.target.dataset.id,
          bubbles: true,
        });

        this.elem.dispatchEvent(ribbonSelectEvent);
      }
    });

    ribbonInner.addEventListener("scroll", () => {
      const scrolled = ribbonInner.scrollLeft + ribbonInner.clientWidth;
      const remainPartScroll = ribbonInner.scrollWidth - scrolled;

      if (remainPartScroll < 1) {
        arrowRight.classList.remove("ribbon__arrow_visible");
      } else {
        arrowRight.classList.add("ribbon__arrow_visible");
      }

      if (ribbonInner.scrollLeft <= 0) {
        arrowLeft.classList.remove("ribbon__arrow_visible");
      } else {
        arrowLeft.classList.add("ribbon__arrow_visible");
      }
    });
  }
}
