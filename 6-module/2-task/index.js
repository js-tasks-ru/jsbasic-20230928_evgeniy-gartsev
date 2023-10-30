import createElement from '../../assets/lib/create-element.js';

export default class ProductCard {
  constructor(product) {
    this._product = product;
    this.elem = createElement(`
    <div class="card">
    <div class="card__top">
        <img src="/assets/images/products/${product.image}" class="card__image" alt="product">
        <span class="card__price">€${product.price.toFixed(2)}</span>
    </div>
    <div class="card__body">
        <div class="card__title">${product.name}</div>
        <button type="button" class="card__button">
            <img src="/assets/images/icons/plus-icon.svg" alt="icon">
        </button>
    </div>
    </div>
    `);

    this._addEvents();
  }

  _addEvents() {
    this.elem.addEventListener("click", event => {
      if (event.target.closest("BUTTON")?.classList.contains("card__button")) {
        const customEvent = new CustomEvent("product-add",
          {detail: this._product.id, bubbles: true});
        this.elem.dispatchEvent(customEvent);
      }
    });
  }
}