import Carousel from '../../6-module/3-task/index.js';
import slides from '../../6-module/3-task/slides.js';

import RibbonMenu from '../../7-module/1-task/index.js';
import categories from '../../7-module/1-task/categories.js';

import StepSlider from '../../7-module/4-task/index.js';
import ProductsGrid from '../../8-module/2-task/index.js';

import CartIcon from '../../8-module/1-task/index.js';
import Cart from '../../8-module/4-task/index.js';

export default class Main {

  constructor() {
  }

  async render() {
    this.carousel = new Carousel(slides);
    this.ribbonMenu = new RibbonMenu(categories);
    this.stepSlider = new StepSlider({steps: 5, value: 3});
    this.cartIcon = new CartIcon();
    this.cart = new Cart(this.cartIcon);
    this.noNutsCheckbox = document.querySelector("#nuts-checkbox");
    this.vegeterianCheckbox = document.querySelector("#vegeterian-checkbox");

    document.querySelector("[data-carousel-holder]").insertAdjacentElement("afterbegin", this.carousel.elem);
    document.querySelector("[data-ribbon-holder]").insertAdjacentElement("afterbegin", this.ribbonMenu.elem);
    document.querySelector("[data-slider-holder]").insertAdjacentElement("afterbegin", this.stepSlider.elem);
    document.querySelector("[data-cart-icon-holder]").insertAdjacentElement("afterbegin", this.cartIcon.elem);

    const response = await fetch("products.json");
    this.products = await response.json();
    const dataProductsGridHolder = document.querySelector("[data-products-grid-holder]");

    this.productsGrid = new ProductsGrid(this.products);

    this.filterProductsGrid({
      noNuts: this.noNutsCheckbox.checked,
      vegeterianOnly: this.vegeterianCheckbox.checked,
      maxSpiciness: this.stepSlider.elem.value,
      category: this.ribbonMenu.elem.value
    });

    dataProductsGridHolder.innerHTML = "";
    dataProductsGridHolder.insertAdjacentElement("afterbegin", this.productsGrid.elem);

    this.addEvents();
    return new Promise(resolve => {
      resolve();
    });
  }

  filterProductsGrid(filter) {
    this.productsGrid.updateFilter(filter);
  }

  addEvents() {
    this.ribbonMenu.elem.addEventListener("ribbon-select", event => {
      this.filterProductsGrid({
        category: event.detail
      });
    });

    this.stepSlider.elem.addEventListener("slider-change", event => {
      this.filterProductsGrid({
        maxSpiciness: event.detail
      });
    });

    this.noNutsCheckbox.addEventListener("change", event => {
      this.filterProductsGrid({
        noNuts: event.target.checked
      });
    });

    this.vegeterianCheckbox.addEventListener("change", event => {
      this.filterProductsGrid({
        vegeterianOnly: event.target.checked
      });
    });

    document.body.addEventListener("product-add", event => {
      const product = this.products.filter(product => product.id == event.detail);
      this.cart.addProduct(product[0]);
    });
  }
}
