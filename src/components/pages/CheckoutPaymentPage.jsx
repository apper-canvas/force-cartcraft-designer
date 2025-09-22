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

const CheckoutPaymentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [shippingInfo, setShippingInfo] = useState(null);
  const [orderTotals, setOrderTotals] = useState(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    sameAsShipping: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCheckoutData();
  }, []);

  const loadCheckoutData = async () => {
    try {
      const cartData = await cartService.getCartForCheckout();
      const shipping = await orderService.getShippingInfo();
      
      if (!shipping) {
        toast.error('Please complete shipping information first');
        navigate('/checkout/shipping');
        return;
      }

      if (cartData.items.length === 0) {
        toast.error('Your cart is empty');
        navigate('/');
        return;
      }

      setCart(cartData);
      setShippingInfo(shipping);
      
      const totals = await orderService.calculateOrderTotals(cartData, shipping);
      setOrderTotals(totals);
    } catch (error) {
      console.error('Error loading checkout data:', error);
      toast.error('Error loading checkout information');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length < 15) {
      newErrors.cardNumber = 'Card number is invalid';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be in MM/YY format';
    }

    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }

    if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required';

    if (!formData.sameAsShipping) {
      if (!formData.billingAddress.trim()) newErrors.billingAddress = 'Billing address is required';
      if (!formData.billingCity.trim()) newErrors.billingCity = 'Billing city is required';
      if (!formData.billingState.trim()) newErrors.billingState = 'Billing state is required';
      if (!formData.billingZip.trim()) newErrors.billingZip = 'Billing ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
      if (formattedValue.length > 19) return;
    } else if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/');
      if (formattedValue.length > 5) return;
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) return;
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleContinue = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all payment fields correctly');
      return;
    }

    setLoading(true);
    try {
      await orderService.savePaymentInfo(formData);
      navigate('/checkout/review');
    } catch (error) {
      console.error('Error saving payment info:', error);
      toast.error('Error saving payment information');
    } finally {
      setLoading(false);
    }
  };

  if (!orderTotals) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="Loader2" size={32} className="animate-spin text-accent mx-auto mb-4" />
          <p className="text-secondary">Loading checkout information...</p>
        </div>
      </div>
    );
  }

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
            <CheckoutProgressIndicator currentStep={2} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-surface rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-primary mb-6">Payment Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Card Number *
                    </label>
                    <Input
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      error={errors.cardNumber}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Expiry Date *
                      </label>
                      <Input
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        error={errors.expiryDate}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        CVV *
                      </label>
                      <Input
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        error={errors.cvv}
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Name on Card *
                    </label>
                    <Input
                      value={formData.cardName}
                      onChange={(e) => handleInputChange('cardName', e.target.value)}
                      error={errors.cardName}
                      placeholder="Enter name as it appears on card"
                    />
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-primary mb-4">Billing Address</h3>
                    
                    <label className="flex items-center space-x-2 mb-4">
                      <input
                        type="checkbox"
                        checked={formData.sameAsShipping}
                        onChange={(e) => handleInputChange('sameAsShipping', e.target.checked)}
                        className="rounded border-secondary"
                      />
                      <span className="text-sm text-secondary">Same as shipping address</span>
                    </label>

                    {!formData.sameAsShipping && (
                      <div className="space-y-4">
                        <Input
                          value={formData.billingAddress}
                          onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                          error={errors.billingAddress}
                          placeholder="Billing address"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Input
                            value={formData.billingCity}
                            onChange={(e) => handleInputChange('billingCity', e.target.value)}
                            error={errors.billingCity}
                            placeholder="City"
                          />
                          <Input
                            value={formData.billingState}
                            onChange={(e) => handleInputChange('billingState', e.target.value)}
                            error={errors.billingState}
                            placeholder="State"
                          />
                          <Input
                            value={formData.billingZip}
                            onChange={(e) => handleInputChange('billingZip', e.target.value)}
                            error={errors.billingZip}
                            placeholder="ZIP"
                          />
                        </div>
                      </div>
                    )}
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

                <div className="border-t mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Subtotal</span>
                    <span>${orderTotals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Shipping</span>
                    <span>${orderTotals.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Tax</span>
                    <span>${orderTotals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-primary text-lg border-t pt-2">
                    <span>Total</span>
                    <span>${orderTotals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={() => navigate('/checkout/shipping')}
              className="flex items-center gap-2"
            >
              <ApperIcon name="ArrowLeft" size={16} />
              Back to Shipping
            </Button>
            
            <Button
              onClick={handleContinue}
              disabled={loading}
              className="flex items-center gap-2"
            >
              Review Order
              <ApperIcon name="ArrowRight" size={16} />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPaymentPage;