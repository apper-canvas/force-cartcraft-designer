import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ProductCard = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: fullStars }).map((_, index) => (
          <ApperIcon key={`full-${index}`} name="Star" size={16} className="text-yellow-400 fill-current" />
        ))}
        {hasHalfStar && (
          <ApperIcon name="StarHalf" size={16} className="text-yellow-400 fill-current" />
        )}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <ApperIcon key={`empty-${index}`} name="Star" size={16} className="text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {product.originalPrice > product.price && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-error to-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-3">
          <span className="inline-block bg-gradient-to-r from-accent/10 to-blue-100 text-accent px-3 py-1 rounded-full text-sm font-medium">
            {product.category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-primary mb-3 line-clamp-2 group-hover:text-accent transition-colors duration-200">
          {product.title}
        </h3>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {renderStars(product.rating)}
          <span className="text-sm text-secondary font-medium">
            {product.rating}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="Package" size={16} className="text-gray-400" />
            <span className="text-sm text-secondary">
              {product.stock} in stock
            </span>
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          className="w-full group"
          disabled={product.stock === 0}
        >
          <ApperIcon 
            name="ShoppingCart" 
            size={18}
            className="transition-transform duration-200 group-hover:scale-110" 
          />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;