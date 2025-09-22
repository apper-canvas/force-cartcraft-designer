import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import QuantitySelector from "@/components/molecules/QuantitySelector";
import Badge from "@/components/atoms/Badge";

const ProductInfo = ({
  product,
  selectedVariant,
  quantity,
  totalPrice,
  onVariantChange,
  onQuantityChange,
  onAddToCart,
  formatPrice
}) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <ApperIcon
          key={i}
          name="Star"
          size={16}
          className="text-yellow-400 fill-current"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <ApperIcon
          key="half"
          name="Star"
          size={16}
          className="text-yellow-400 fill-current opacity-50"
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <ApperIcon
          key={`empty-${i}`}
          name="Star"
          size={16}
          className="text-gray-300"
        />
      );
    }

    return stars;
  };

  const handleSizeChange = (size) => {
    onVariantChange({ ...selectedVariant, size });
  };

  const handleColorChange = (color) => {
    onVariantChange({ ...selectedVariant, color });
  };

  const getSavingsPercentage = () => {
    if (product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { name: 'Default', color: '#8B7355' },
    { name: 'Black', color: '#000000' },
    { name: 'Navy', color: '#1e3a8a' },
    { name: 'Gray', color: '#6b7280' }
  ];

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 sticky top-8">
      {/* Product Title & Category */}
      <div className="mb-6">
        <div className="mb-3">
          <Badge variant="secondary" className="bg-gradient-to-r from-accent/10 to-blue-100 text-accent">
            {product.category}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-primary mb-4 leading-tight">
          {product.title}
        </h1>
        
        {/* Rating */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1">
            {renderStars(product.rating)}
          </div>
          <span className="text-lg font-semibold text-secondary">
            {product.rating}
          </span>
          <span className="text-secondary">
            (Based on {Math.floor(Math.random() * 100) + 50} reviews)
          </span>
        </div>
      </div>

      {/* Price Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-4xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <div className="flex items-center gap-2">
              <span className="text-xl text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <Badge variant="danger" size="sm">
                Save {getSavingsPercentage()}%
              </Badge>
            </div>
          )}
        </div>
        
        {quantity > 1 && (
          <div className="text-lg text-secondary">
            Total: <span className="font-bold text-accent">{formatPrice(totalPrice)}</span>
          </div>
        )}
      </div>

      {/* Product Description */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-primary mb-3">Description</h3>
        <p className="text-secondary leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Size Selector */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-primary mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeChange(size)}
              className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                selectedVariant.size === size
                  ? 'border-accent bg-accent text-white'
                  : 'border-gray-300 text-secondary hover:border-accent hover:text-accent'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selector */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-primary mb-3">Color</h3>
        <div className="flex gap-3">
          {colors.map((colorOption) => (
            <button
              key={colorOption.name}
              onClick={() => handleColorChange(colorOption.name)}
              className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                selectedVariant.color === colorOption.name
                  ? 'border-accent scale-110'
                  : 'border-gray-300 hover:scale-105'
              }`}
              style={{ backgroundColor: colorOption.color }}
              title={colorOption.name}
            >
              {selectedVariant.color === colorOption.name && (
                <ApperIcon name="Check" size={16} className="text-white mx-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity & Stock */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary">Quantity</h3>
          <div className="flex items-center gap-2">
            <ApperIcon name="Package" size={16} className="text-accent" />
            <span className="text-sm text-secondary font-medium">
              {product.stock} in stock
            </span>
          </div>
        </div>
        
        <QuantitySelector
          value={quantity}
          onChange={onQuantityChange}
          min={1}
          max={product.stock}
          className="w-32"
        />
      </div>

      {/* Add to Cart Button */}
      <div className="mb-6">
        <Button
          onClick={onAddToCart}
          disabled={product.stock === 0 || quantity > product.stock}
          size="lg"
          className="w-full"
        >
          <ApperIcon name="ShoppingCart" size={20} />
          {product.stock === 0 ? 'Out of Stock' : `Add ${quantity} to Cart`}
        </Button>
      </div>

      {/* Features */}
      <div className="space-y-3 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3 text-secondary">
          <ApperIcon name="Truck" size={20} className="text-accent" />
          <span>Free shipping on orders over $50</span>
        </div>
        <div className="flex items-center gap-3 text-secondary">
          <ApperIcon name="RefreshCw" size={20} className="text-accent" />
          <span>30-day return policy</span>
        </div>
        <div className="flex items-center gap-3 text-secondary">
          <ApperIcon name="Shield" size={20} className="text-accent" />
          <span>1-year warranty included</span>
        </div>
        <div className="flex items-center gap-3 text-secondary">
          <ApperIcon name="Headphones" size={20} className="text-accent" />
          <span>24/7 customer support</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;