class OrderService {
  constructor() {
    this.storageKeys = {
      shipping: 'checkout_shipping',
      payment: 'checkout_payment',
      orders: 'user_orders'
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Shipping Information Management
  async saveShippingInfo(shippingData) {
    await this.delay(200);
    localStorage.setItem(this.storageKeys.shipping, JSON.stringify(shippingData));
    return true;
  }

  async getShippingInfo() {
    await this.delay(100);
    const stored = localStorage.getItem(this.storageKeys.shipping);
    return stored ? JSON.parse(stored) : null;
  }

  // Payment Information Management
  async savePaymentInfo(paymentData) {
    await this.delay(200);
    // Store only safe payment info (not full card number)
    const safePaymentData = {
      cardNumber: paymentData.cardNumber,
      expiryDate: paymentData.expiryDate,
      cardName: paymentData.cardName,
      sameAsShipping: paymentData.sameAsShipping,
      billingAddress: paymentData.billingAddress,
      billingCity: paymentData.billingCity,
      billingState: paymentData.billingState,
      billingZip: paymentData.billingZip
    };
    localStorage.setItem(this.storageKeys.payment, JSON.stringify(safePaymentData));
    return true;
  }

  async getPaymentInfo() {
    await this.delay(100);
    const stored = localStorage.getItem(this.storageKeys.payment);
    return stored ? JSON.parse(stored) : null;
  }

  // Order Calculations
  async calculateShipping(cartData, shippingInfo) {
    await this.delay(300);
    
    // Mock shipping calculation based on location and cart value
    const baseShipping = 9.99;
    const freeShippingThreshold = 75;
    
    if (cartData.totalPrice >= freeShippingThreshold) {
      return 0;
    }
    
    // Add extra for expedited shipping to certain states
    const expeditedStates = ['CA', 'NY', 'FL'];
    if (expeditedStates.includes(shippingInfo?.state)) {
      return baseShipping + 5;
    }
    
    return baseShipping;
  }

  async calculateTax(cartData, shippingInfo) {
    await this.delay(200);
    
    // Mock tax calculation based on shipping state
    const taxRates = {
      'CA': 0.0875, // California
      'NY': 0.08,   // New York
      'TX': 0.0625, // Texas
      'FL': 0.06,   // Florida
      'WA': 0.065,  // Washington
    };
    
    const taxRate = taxRates[shippingInfo?.state] || 0.05; // Default 5%
    return cartData.totalPrice * taxRate;
  }

  async calculateOrderTotals(cartData, shippingInfo) {
    await this.delay(400);
    
    const subtotal = cartData.totalPrice;
    const shipping = await this.calculateShipping(cartData, shippingInfo);
    const tax = await this.calculateTax(cartData, shippingInfo);
    const total = subtotal + shipping + tax;
    
    return {
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      total: total
    };
  }

  // Order Processing
  generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CC${timestamp.slice(-6)}${random}`;
  }

  async placeOrder(orderData) {
    await this.delay(1000); // Simulate processing time
    
    const orderNumber = this.generateOrderNumber();
    const orderDate = new Date().toISOString();
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5); // 5 days from now
    
    const order = {
      orderNumber,
      orderDate,
      estimatedDelivery: estimatedDelivery.toISOString(),
      items: orderData.cart.items,
      shippingInfo: orderData.shippingInfo,
      paymentInfo: orderData.paymentInfo,
      totals: orderData.totals,
      status: 'confirmed',
      trackingNumber: `1Z${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };
    
    // Save order to local storage
    const existingOrders = JSON.parse(localStorage.getItem(this.storageKeys.orders) || '[]');
    existingOrders.unshift(order); // Add to beginning of array
    localStorage.setItem(this.storageKeys.orders, JSON.stringify(existingOrders));
    
    // Clear checkout session data
    localStorage.removeItem(this.storageKeys.shipping);
    localStorage.removeItem(this.storageKeys.payment);
    
    return order;
  }

  async getOrderHistory() {
    await this.delay(200);
    const orders = JSON.parse(localStorage.getItem(this.storageKeys.orders) || '[]');
    return orders;
  }

  async getOrderByNumber(orderNumber) {
    await this.delay(200);
    const orders = await this.getOrderHistory();
    return orders.find(order => order.orderNumber === orderNumber) || null;
  }

  // Validation Helpers
  validateShippingInfo(shippingData) {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    const missing = required.filter(field => !shippingData[field]?.trim());
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
    
    // Email validation
    if (!/\S+@\S+\.\S+/.test(shippingData.email)) {
      throw new Error('Invalid email address');
    }
    
    return true;
  }

  validatePaymentInfo(paymentData) {
    const required = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
    const missing = required.filter(field => !paymentData[field]?.trim());
    
    if (missing.length > 0) {
      throw new Error(`Missing required payment fields: ${missing.join(', ')}`);
    }
    
    // Basic card number validation (remove spaces)
    const cleanCardNumber = paymentData.cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length < 15 || cleanCardNumber.length > 19) {
      throw new Error('Invalid card number length');
    }
    
    // Expiry date validation
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentData.expiryDate)) {
      throw new Error('Invalid expiry date format (use MM/YY)');
    }
    
    // CVV validation
    if (!/^\d{3,4}$/.test(paymentData.cvv)) {
      throw new Error('Invalid CVV (3-4 digits required)');
    }
    
    return true;
  }
}

const orderService = new OrderService();
export default orderService;