import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleIncrement = () => {
    onUpdateQuantity(item.productId, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.productId, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    onRemove(item.productId);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
    >
      <div className="flex-shrink-0">
        <img
          src={item.image}
          alt={item.title}
          className="w-16 h-16 object-cover rounded-lg"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-primary text-sm mb-1 truncate">
          {item.title}
        </h4>
        <p className="text-accent font-bold text-lg">
          {formatPrice(item.price)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
          <button
            onClick={handleDecrement}
            disabled={item.quantity <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-md bg-white hover:bg-accent hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-400"
          >
            <ApperIcon name="Minus" size={14} />
          </button>
          
          <span className="w-8 text-center font-semibold text-primary">
            {item.quantity}
          </span>
          
          <button
            onClick={handleIncrement}
            className="w-8 h-8 flex items-center justify-center rounded-md bg-white hover:bg-accent hover:text-white transition-all duration-200"
          >
            <ApperIcon name="Plus" size={14} />
          </button>
        </div>

        <button
          onClick={handleRemove}
          className="text-error hover:text-red-700 transition-colors duration-200 p-1"
        >
          <ApperIcon name="Trash2" size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default CartItem;