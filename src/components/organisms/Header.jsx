import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Badge from "@/components/atoms/Badge";
import orderService from "@/services/api/orderService";

const Header = ({ cartItemCount, onCartToggle, onSearch }) => {
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
const fetchOrderCount = async () => {
    try {
      // Check if orderService and getOrders method exist
      if (orderService && typeof orderService.getOrders === 'function') {
        const orders = await orderService.getOrders();
        setOrderCount(orders?.length || 0);
      } else {
        console.warn('orderService.getOrders is not available');
        setOrderCount(0);
      }
      } catch (error) {
        console.error('Failed to fetch order count:', error);
        setOrderCount(0);
      }
    };

    fetchOrderCount();
  }, []);

  const handleCartClick = () => {
    if (onCartToggle) {
      onCartToggle();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-blue-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="ShoppingBag" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-blue-600 bg-clip-text text-transparent">
                CartCraft
              </h1>
              <p className="text-xs text-secondary hidden sm:block">
                Premium Shopping Experience
              </p>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile, shown on md+ */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar 
              onSearch={onSearch}
              placeholder="Search for products..."
              className="w-full"
            />
          </div>

{/* My Orders Link */}
          <Link 
            to="/orders" 
            className="flex items-center gap-2 px-4 py-2 text-secondary hover:text-primary transition-colors duration-200"
          >
            <ApperIcon name="Package" size={20} />
            <span className="hidden sm:inline">My Orders</span>
            {orderCount > 0 && (
              <Badge variant="accent" className="text-xs">
                {orderCount}
              </Badge>
            )}
          </Link>

          {/* Cart Button */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={handleCartClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-3 rounded-xl bg-gradient-to-r from-accent/10 to-blue-100 hover:from-accent/20 hover:to-blue-200 transition-all duration-200"
            >
              <ApperIcon name="ShoppingCart" size={24} className="text-accent" />
              
              {cartItemCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1"
                >
                  <Badge 
                    variant="primary" 
                    size="sm"
                    className="animate-cart-bounce"
                  >
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </Badge>
                </motion.div>
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <SearchBar 
            onSearch={onSearch}
            placeholder="Search products..."
            className="w-full"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;