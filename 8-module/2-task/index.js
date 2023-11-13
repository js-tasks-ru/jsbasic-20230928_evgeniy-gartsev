import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};
    this.elem = createElement(`
      <div class="products-grid">
        <div class="products-grid__inner">
        </div>
      </div>
    `);

    this.renderCards(products);
  }

  cards(products) {
    let cards = [];
    for (let product of products) {
      cards.push(new ProductCard(product));
    }
    return cards;
  }

  renderCards(products) {
    const productGridInner = this.elem.querySelector(".products-grid__inner");
    const cards = this.cards(products).map(card => card.elem);
    productGridInner.replaceChildren(...cards);
  }

  updateFilter(filters) {
    Object.assign(this.filters, filters);
    let filteredProducts = this.products.filter(product => {
      for (let [filter, value] of Object.entries(this.filters)) {
        if (filter == "noNuts" && value && product.nuts) {
          return false;
        }

        if (filter == "vegeterianOnly" && value && !product.vegeterian) {
          return false;
        }

        if (filter == "maxSpiciness" && product.spiciness > value) {
          return false;
        }

        if (filter == "category" && value && product.category != value) {
          return false;
        }
      }
      return true;
    });

    this.renderCards(filteredProducts);
  }
}
