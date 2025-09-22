import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import CheckoutProgressIndicator from "@/components/molecules/CheckoutProgressIndicator";
import cartService from "@/services/api/cartService";
import orderService from "@/services/api/orderService";
import { toast } from "react-toastify";

const CheckoutShippingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const cartData = await cartService.getCartForCheckout();
      if (cartData.items.length === 0) {
        toast.error('Your cart is empty');
        navigate('/');
        return;
      }
      setCart(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('Error loading cart information');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleContinue = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setLoading(true);
    try {
      await orderService.saveShippingInfo(formData);
      navigate('/checkout/payment');
    } catch (error) {
      console.error('Error saving shipping info:', error);
      toast.error('Error saving shipping information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Checkout</h1>
            <CheckoutProgressIndicator currentStep={1} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-surface rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-primary mb-6">Shipping Information</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        First Name *
                      </label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        error={errors.firstName}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Last Name *
                      </label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        error={errors.lastName}
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      error={errors.email}
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      error={errors.phone}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Address *
                    </label>
                    <Input
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      error={errors.address}
                      placeholder="Enter street address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        City *
                      </label>
                      <Input
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        error={errors.city}
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        State *
                      </label>
                      <Input
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        error={errors.state}
                        placeholder="Enter state"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        ZIP Code *
                      </label>
                      <Input
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        error={errors.zipCode}
                        placeholder="Enter ZIP code"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-surface rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-primary mb-4">Order Summary</h3>
                
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-secondary">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between font-semibold text-primary">
                    <span>Subtotal</span>
                    <span>${cart.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-secondary mt-1">
                    <span>Shipping</span>
                    <span>Calculated at next step</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ApperIcon name="ArrowLeft" size={16} />
              Return to Cart
            </Button>
            
            <Button
              onClick={handleContinue}
              disabled={loading}
              className="flex items-center gap-2"
            >
              Continue to Payment
              <ApperIcon name="ArrowRight" size={16} />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutShippingPage;