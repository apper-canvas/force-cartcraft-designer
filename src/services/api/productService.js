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

  // Enhanced filtering method
  async filterProducts({ search = '', categories = [], brands = [], priceRange = null, minRating = 0 }) {
    await this.delay(250);
    
    let filteredProducts = [...this.products];

    // Search filter
    if (search.trim()) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.title.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (categories.length > 0) {
      filteredProducts = filteredProducts.filter(p => 
        categories.some(cat => p.category.toLowerCase() === cat.toLowerCase())
      );
    }

    // Brand filter (extract brand from title for demo)
    if (brands.length > 0) {
      filteredProducts = filteredProducts.filter(p => {
        const productBrand = this.extractBrand(p.title);
        return brands.some(brand => brand.toLowerCase() === productBrand.toLowerCase());
      });
    }

    // Price range filter
    if (priceRange) {
      filteredProducts = filteredProducts.filter(p => 
        p.price >= priceRange.min && p.price <= priceRange.max
      );
    }

    // Rating filter
    if (minRating > 0) {
      filteredProducts = filteredProducts.filter(p => p.rating >= minRating);
    }

    return filteredProducts.map(p => ({ ...p }));
  }

  // Sort products by various criteria
  async sortProducts(products, sortBy) {
    await this.delay(100);
    
    const sortedProducts = [...products];

    switch (sortBy) {
      case 'price-low':
        return sortedProducts.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sortedProducts.sort((a, b) => b.price - a.price);
      case 'rating':
        return sortedProducts.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return sortedProducts.sort((a, b) => b.Id - a.Id);
      case 'featured':
      default:
        return sortedProducts.sort((a, b) => b.rating - a.rating);
    }
  }

  // Get unique categories
  async getCategories() {
    await this.delay(100);
    const categories = [...new Set(this.products.map(p => p.category))];
    return categories.sort();
  }

  // Extract brand names from product titles (simplified for demo)
  extractBrand(title) {
    const brands = ['Apple', 'Samsung', 'Sony', 'Nike', 'Canon', 'iPhone', 'MacBook', 'AirPods'];
    const found = brands.find(brand => 
      title.toLowerCase().includes(brand.toLowerCase())
    );
    return found || 'Other';
  }

  // Get unique brands
  async getBrands() {
    await this.delay(100);
    const brands = [...new Set(this.products.map(p => this.extractBrand(p.title)))];
    return brands.sort();
  }

  // Get price range
  async getPriceRange() {
    await this.delay(100);
    const prices = this.products.map(p => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }

  // Get search suggestions based on product data
  async getSearchSuggestions(query) {
    if (!query || query.length < 2) return [];
    
    await this.delay(150);
    const searchTerm = query.toLowerCase();
    const suggestions = new Set();

    // Add matching product titles
    this.products.forEach(p => {
      if (p.title.toLowerCase().includes(searchTerm)) {
        suggestions.add(p.title);
      }
      if (p.category.toLowerCase().includes(searchTerm)) {
        suggestions.add(p.category);
      }
      // Add partial matches from description
      const words = p.description.toLowerCase().split(' ');
      words.forEach(word => {
        if (word.includes(searchTerm) && word.length > 3) {
          suggestions.add(word);
        }
      });
    });

    return Array.from(suggestions).slice(0, 8);
  }
}

export default new ProductService();