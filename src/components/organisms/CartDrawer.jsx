import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import CartItem from "@/components/molecules/CartItem";
import cartService from "@/services/api/cartService";
import { toast } from "react-toastify";

const CartDrawer = ({ isOpen, onClose, onCartUpdate }) => {
const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0 });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (err) {
      console.error("Error loading cart:", err);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
  }, [isOpen]);

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      const updatedCart = await cartService.updateQuantity(productId, quantity);
      setCart(updatedCart);
      
      if (onCartUpdate) {
        onCartUpdate();
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const updatedCart = await cartService.removeItem(productId);
      setCart(updatedCart);
      
      if (onCartUpdate) {
        onCartUpdate();
      }
      
      toast.success("Item removed from cart");
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      await cartService.clearCart();
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
      
      if (onCartUpdate) {
        onCartUpdate();
      }
      
      toast.success("Cart cleared");
    } catch (err) {
      console.error("Error clearing cart:", err);
      toast.error("Failed to clear cart");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-accent/5 to-blue-50">
              <div className="flex items-center gap-3">
                <ApperIcon name="ShoppingCart" size={24} className="text-accent" />
                <div>
                  <h2 className="text-xl font-bold text-primary">Shopping Cart</h2>
                  <p className="text-sm text-secondary">
                    {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/80 transition-colors duration-200"
              >
                <ApperIcon name="X" size={24} className="text-secondary" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto cart-scroll p-6">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse bg-gray-100 rounded-xl h-20" />
                  ))}
                </div>
              ) : cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-accent/10 to-blue-100 rounded-full flex items-center justify-center mb-6">
                    <ApperIcon name="ShoppingCart" size={48} className="text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">Your cart is empty</h3>
                  <p className="text-secondary mb-6">Add some products to get started!</p>
                  <Button onClick={onClose} variant="secondary">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {cart.items.map((item) => (
                      <CartItem
                        key={item.productId}
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                      />
                    ))}
                  </AnimatePresence>

                  {cart.items.length > 1 && (
                    <div className="pt-4 border-t border-gray-200">
                      <Button
                        onClick={handleClearCart}
                        variant="ghost"
                        size="sm"
                        className="w-full text-error hover:bg-error/5"
                      >
                        <ApperIcon name="Trash2" size={16} />
                        Clear Cart
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.items.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gradient-to-r from-accent/5 to-blue-50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-semibold text-primary">Total:</span>
                    <span className="font-bold text-2xl text-accent">
                      {formatPrice(cart.totalPrice)}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
<Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => {
                        onClose();
                        navigate('/checkout/shipping');
                      }}
                    >
                      <ApperIcon name="CreditCard" size={20} />
                      Proceed to Checkout
                    </Button>
                    
                    <Button 
                      onClick={onClose}
                      variant="secondary" 
                      className="w-full"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;