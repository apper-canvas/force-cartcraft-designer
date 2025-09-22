class CartService {
  constructor() {
    this.storageKey = "cartcraft-cart";
    this.loadCart();
  }

  loadCart() {
    try {
      const savedCart = localStorage.getItem(this.storageKey);
      this.cart = savedCart ? JSON.parse(savedCart) : {
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      this.cart = {
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
    }
  }

  saveCart() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }

  calculateTotals() {
    this.cart.totalItems = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
    this.cart.totalPrice = this.cart.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
  }

  // Simulate API delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getCart() {
    await this.delay(100);
    return { ...this.cart, items: [...this.cart.items] };
  }

  async addItem(product, quantity = 1) {
    await this.delay(200);
    
    const existingItemIndex = this.cart.items.findIndex(
      item => item.productId === product.Id.toString()
    );

    if (existingItemIndex >= 0) {
      this.cart.items[existingItemIndex].quantity += quantity;
    } else {
      this.cart.items.push({
        productId: product.Id.toString(),
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: quantity,
        addedAt: new Date().toISOString()
      });
    }

    this.calculateTotals();
    this.saveCart();
    return { ...this.cart, items: [...this.cart.items] };
  }

  async updateQuantity(productId, quantity) {
    await this.delay(150);
    
    const itemIndex = this.cart.items.findIndex(
      item => item.productId === productId.toString()
    );

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        this.cart.items.splice(itemIndex, 1);
      } else {
        this.cart.items[itemIndex].quantity = quantity;
      }
      
      this.calculateTotals();
      this.saveCart();
    }

    return { ...this.cart, items: [...this.cart.items] };
  }

  async removeItem(productId) {
    await this.delay(150);
    
    this.cart.items = this.cart.items.filter(
      item => item.productId !== productId.toString()
    );
    
    this.calculateTotals();
    this.saveCart();
    return { ...this.cart, items: [...this.cart.items] };
  }

async clearCart() {
    await this.delay(100);
    
    this.cart = {
      items: [],
      totalItems: 0,
      totalPrice: 0
    };
    
    this.saveCart();
    return { ...this.cart };
  }

  async getCartForCheckout() {
    await this.delay(100);
    return { ...this.cart };
  }

  async getTotalItems() {
    await this.delay(50);
    return this.cart.totalItems;
  }
}

export default new CartService();