import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import ProductGrid from "@/components/organisms/ProductGrid";
import CartDrawer from "@/components/organisms/CartDrawer";
import cartService from "@/services/api/cartService";

const HomePage = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  const loadCartCount = async () => {
    try {
      const count = await cartService.getTotalItems();
      setCartItemCount(count);
    } catch (err) {
      console.error("Error loading cart count:", err);
    }
  };

  useEffect(() => {
    loadCartCount();
  }, []);

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCartUpdate = () => {
    loadCartCount();
  };

  const handleSearch = (query) => {
    console.log("Search query:", query);
    // Search functionality placeholder
    // In a real app, this would filter the products
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={cartItemCount}
        onCartToggle={handleCartToggle}
        onSearch={handleSearch}
      />
      
      <main>
        <ProductGrid onCartUpdate={handleCartUpdate} />
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCartUpdate={handleCartUpdate}
      />
    </div>
  );
};

export default HomePage;