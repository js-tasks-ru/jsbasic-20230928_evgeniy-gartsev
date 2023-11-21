export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
  }

  addProduct(product) {
    if (product == null) {
      return;
    }

    const existsItemIndex = this.cartItems.findIndex(item => {
      return item.product.id == product.id;
    });

    if (existsItemIndex != -1) {
      this.cartItems[existsItemIndex].count += 1;
    }
    else {
      this.cartItems.push({product, count: 1});
    }

    this.onProductUpdate(this.cartItems);
  }

  updateProductCount(productId, amount) {
    const newCartItems = this.cartItems.map(item => {
      if (item.product.id == productId) {
        item.count += amount;
      }
      return item;
    }).filter(item => item.count != 0);

    this.cartItems = newCartItems;

    this.onProductUpdate(this.cartItems);
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

  onProductUpdate(cartItem) {
    // реализуем в следующей задаче

    this.cartIcon.update(this);
  }
}

