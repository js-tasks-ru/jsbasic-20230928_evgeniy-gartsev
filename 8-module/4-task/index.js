import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    if (product == null) {
      return;
    }

    let cartItem;
    const existsItemIndex = this.cartItems.findIndex(item => {
      return item.product.id == product.id;
    });

    if (existsItemIndex != -1) {
      cartItem = this.cartItems[existsItemIndex];
      cartItem.count += 1;
    }
    else {
      cartItem = {product, count: 1};
      this.cartItems.push(cartItem);
    }

    this.onProductUpdate(cartItem);
  }

  updateProductCount(productId, amount) {
    let cartItem;
    const newCartItems = this.cartItems.map(item => {
      if (item.product.id == productId) {
        item.count += amount;
        cartItem = item;
      }
      return item;
    }).filter(item => item.count != 0);

    this.cartItems = newCartItems;
    this.onProductUpdate(cartItem);
  }

  isEmpty() {
    return this.cartItems.length < 1;
  }

  getTotalCount() {
    return this.cartItems.reduce((accum, current) => {
      return accum + current.count;
    }, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce((accum, current) => {
      return accum + current.count * current.product.price;
    }, 0);
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(2)}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this.modal = new Modal();
    const div = document.createElement("DIV");
    const orderForm = this.renderOrderForm();

    this.modal.setTitle("Your order");
    this.cartItems.forEach(item => {
      const product = this.renderProduct(item.product, item.count);
      product.addEventListener("click", event => {
        const button = event.target.closest(".cart-counter__button");
        if (!button) {
          return;
        }

        const productItem = event.target.closest(".cart-product");
        const count = button.classList.contains("cart-counter__button_plus") ? 1 : -1;

        this.updateProductCount(productItem.dataset.productId, count);
      });
      div.append(product);
    });

    orderForm.addEventListener("submit", event => this.onSubmit(event));
    div.append(orderForm);
    this.modal.setBody(div);
    this.modal.open();
  }

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);

    if (!document.body.classList.contains("is-modal-open")) {
      return;
    }

    if (this.isEmpty()) {
      this.modal.close();
    }

    const cartItemElement = this.modal.modal.querySelector(`[data-product-id="${cartItem.product.id}"]`);

    if (cartItem.count < 1) {
      cartItemElement.remove();
      return;
    }
    const productCount = cartItemElement.querySelector(".cart-counter__count");
    const productPrice = cartItemElement.querySelector(".cart-product__price");
    const totalPrice = this.modal.modal.querySelector(".cart-buttons__info-price");
    const price = cartItem.count * cartItem.product.price;

    productCount.innerHTML = cartItem.count;
    productPrice.innerHTML = `€${price.toFixed(2)}`;
    totalPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
  }

  onSubmit(event) {
    const submitButton = this.modal.modal.querySelector(`[type="submit"]`);
    const cartForm = this.modal.modal.querySelector(".cart-form");

    event.preventDefault();
    submitButton.classList.add("is-loading");

    fetch("https://httpbin.org/post", {
      method: "POST",
      body: new FormData(cartForm)
    }).then(response => {
      if (response.ok) {
        this.actionOnSuccess();
      }
    });
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }

  actionOnSuccess() {
    const modalBody = createElement(`
      <div class="modal__body-inner">
        <p>
          Order successful! Your order is being cooked :) <br>
          We’ll notify you about delivery time shortly.<br>
          <img src="/assets/images/delivery.gif">
        </p>
      </div>`);

    this.cartItems = [];
    this.cartIcon.update(this);
    this.modal.setBody(modalBody);
    this.modal.setTitle("Success!");
  }
}

