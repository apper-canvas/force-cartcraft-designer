import productsData from "@/services/mockData/products.json";

class ProductService {
  constructor() {
    this.products = [...productsData];
  }

  // Simulate API delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay(300);
    return [...this.products];
  }

  async getById(id) {
    await this.delay(200);
    const product = this.products.find(p => p.Id === parseInt(id));
    return product ? { ...product } : null;
  }

  async getByCategory(category) {
    await this.delay(250);
    return this.products.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    ).map(p => ({ ...p }));
  }

  async searchProducts(query) {
    await this.delay(200);
    const searchTerm = query.toLowerCase();
    return this.products.filter(p => 
      p.title.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    ).map(p => ({ ...p }));
  }

  async getFeatured() {
    await this.delay(250);
    return this.products
      .filter(p => p.rating >= 4.5)
      .slice(0, 8)
      .map(p => ({ ...p }));
  }

  async getByPriceRange(minPrice, maxPrice) {
    await this.delay(200);
    return this.products.filter(p => 
      p.price >= minPrice && p.price <= maxPrice
    ).map(p => ({ ...p }));
  }
}

export default new ProductService();