import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import productService from "@/services/api/productService";
import cartService from "@/services/api/cartService";
import Header from "@/components/organisms/Header";
import CartDrawer from "@/components/organisms/CartDrawer";
import ImageGallery from "@/components/molecules/ImageGallery";
import ProductInfo from "@/components/molecules/ProductInfo";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState({
    size: 'M',
    color: 'Default'
  });
  const [quantity, setQuantity] = useState(1);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const productData = await productService.getById(parseInt(id));
      if (!productData) {
        setError("Product not found");
        return;
      }
      
      setProduct(productData);
    } catch (err) {
      console.error("Error loading product:", err);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const loadCartCount = async () => {
    try {
      const count = await cartService.getTotalItems();
      setCartItemCount(count);
    } catch (err) {
      console.error("Error loading cart count:", err);
    }
  };

  useEffect(() => {
    loadProduct();
    loadCartCount();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await cartService.addItem(product, quantity);
      toast.success(`Added ${quantity} ${product.title} to cart`);
      await loadCartCount();
      
      // Show success animation or navigate to cart
      setIsCartOpen(true);
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add item to cart");
    }
  };

  const handleCartUpdate = async () => {
    await loadCartCount();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    return product.price * quantity;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          cartItemCount={cartItemCount}
          onCartToggle={() => setIsCartOpen(!isCartOpen)}
          onSearch={() => {}}
        />
        <Loading />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          cartItemCount={cartItemCount}
          onCartToggle={() => setIsCartOpen(!isCartOpen)}
          onSearch={() => {}}
        />
        <Error 
          message={error || "Product not found"}
          onRetry={loadProduct}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={cartItemCount}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        onSearch={() => {}}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-secondary mb-8">
          <button
            onClick={() => navigate('/')}
            className="hover:text-accent transition-colors duration-200"
          >
            Home
          </button>
          <ApperIcon name="ChevronRight" size={16} />
          <span className="text-primary font-medium truncate">
            {product.title}
          </span>
        </nav>

        {/* Back Button */}
        <motion.button
          onClick={handleBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 text-secondary hover:text-accent transition-colors duration-200"
        >
          <ApperIcon name="ArrowLeft" size={20} />
          <span className="font-medium">Back</span>
        </motion.button>

        {/* Product Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-12"
        >
          {/* Image Gallery - 60% on desktop */}
          <div className="lg:col-span-3">
            <ImageGallery 
              images={[
                product.image,
                // Generate some additional mock images for gallery
                product.image.replace('w=500&h=500', 'w=500&h=500&rotate=15'),
                product.image.replace('w=500&h=500', 'w=500&h=500&brightness=1.2'),
                product.image.replace('w=500&h=500', 'w=500&h=500&contrast=1.1')
              ]}
              alt={product.title}
            />
          </div>

          {/* Product Info - 40% on desktop */}
          <div className="lg:col-span-2">
            <ProductInfo
              product={product}
              selectedVariant={selectedVariant}
              quantity={quantity}
              totalPrice={calculateTotalPrice()}
              onVariantChange={setSelectedVariant}
              onQuantityChange={setQuantity}
              onAddToCart={handleAddToCart}
              formatPrice={formatPrice}
            />
          </div>
        </motion.div>

        {/* Additional Product Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-3">
              <ApperIcon name="FileText" size={24} className="text-accent" />
              Product Details
            </h3>
            <div className="space-y-4 text-secondary">
              <p className="leading-relaxed">{product.description}</p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <span className="font-semibold text-primary">Category:</span>
                  <p>{product.category}</p>
                </div>
                <div>
                  <span className="font-semibold text-primary">Stock:</span>
                  <p>{product.stock} units</p>
                </div>
                <div>
                  <span className="font-semibold text-primary">Rating:</span>
                  <p>{product.rating}/5.0</p>
                </div>
                <div>
                  <span className="font-semibold text-primary">SKU:</span>
                  <p>PRD-{product.Id.toString().padStart(4, '0')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-3">
              <ApperIcon name="Truck" size={24} className="text-accent" />
              Shipping & Returns
            </h3>
            <div className="space-y-4 text-secondary">
              <div className="flex items-start gap-3">
                <ApperIcon name="Clock" size={20} className="text-accent mt-0.5" />
                <div>
                  <p className="font-semibold text-primary">Fast Delivery</p>
                  <p>Free shipping on orders over $50</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ApperIcon name="RefreshCw" size={20} className="text-accent mt-0.5" />
                <div>
                  <p className="font-semibold text-primary">Easy Returns</p>
                  <p>30-day return policy</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ApperIcon name="Shield" size={20} className="text-accent mt-0.5" />
                <div>
                  <p className="font-semibold text-primary">Warranty</p>
                  <p>1-year manufacturer warranty</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCartUpdate={handleCartUpdate}
      />
    </div>
  );
};

export default ProductDetailPage;