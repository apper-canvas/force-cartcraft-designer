import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import CheckoutProgressIndicator from "@/components/molecules/CheckoutProgressIndicator";
import cartService from "@/services/api/cartService";
import orderService from "@/services/api/orderService";
import { toast } from "react-toastify";

const CheckoutReviewPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [shippingInfo, setShippingInfo] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [orderTotals, setOrderTotals] = useState(null);

  useEffect(() => {
    loadReviewData();
  }, []);

  const loadReviewData = async () => {
    try {
      setLoading(true);
      
      const cartData = await cartService.getCartForCheckout();
      const shipping = await orderService.getShippingInfo();
      const payment = await orderService.getPaymentInfo();
      
      if (!shipping || !payment) {
        toast.error('Please complete all checkout steps');
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
      setPaymentInfo(payment);
      
      const totals = await orderService.calculateOrderTotals(cartData, shipping);
      setOrderTotals(totals);
    } catch (error) {
      console.error('Error loading review data:', error);
      toast.error('Error loading order information');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!shippingInfo || !paymentInfo || !orderTotals) {
      toast.error('Missing order information');
      return;
    }

    setPlacing(true);
    try {
      const orderData = {
        cart,
        shippingInfo,
        paymentInfo,
        totals: orderTotals
      };

      const order = await orderService.placeOrder(orderData);
      await cartService.clearCart();
      
      toast.success('Order placed successfully!');
      navigate('/checkout/confirmation', { state: { order } });
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Error placing order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (loading || !orderTotals) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="Loader2" size={32} className="animate-spin text-accent mx-auto mb-4" />
          <p className="text-secondary">Loading order review...</p>
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
            <CheckoutProgressIndicator currentStep={3} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-surface rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-primary mb-4">Order Items</h2>
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center">
                        <ApperIcon name="Package" size={24} className="text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-primary">{item.name}</h3>
                        <p className="text-sm text-secondary">Quantity: {item.quantity}</p>
                        <p className="text-sm text-secondary">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-surface rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-primary">Shipping Information</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/checkout/shipping')}
                  >
                    Edit
                  </Button>
                </div>
                {shippingInfo && (
                  <div className="text-sm text-secondary space-y-1">
                    <p className="font-medium text-primary">
                      {shippingInfo.firstName} {shippingInfo.lastName}
                    </p>
                    <p>{shippingInfo.email}</p>
                    <p>{shippingInfo.phone}</p>
                    <p>{shippingInfo.address}</p>
                    <p>
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Information */}
              <div className="bg-surface rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-primary">Payment Information</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/checkout/payment')}
                  >
                    Edit
                  </Button>
                </div>
                {paymentInfo && (
                  <div className="text-sm text-secondary space-y-1">
                    <p className="flex items-center gap-2">
                      <ApperIcon name="CreditCard" size={16} />
                      <span>**** **** **** {paymentInfo.cardNumber.slice(-4)}</span>
                    </p>
                    <p>Expires {paymentInfo.expiryDate}</p>
                    <p className="font-medium text-primary">{paymentInfo.cardName}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-surface rounded-lg shadow-sm border p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-primary mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">
                      Subtotal ({cart.totalItems} items)
                    </span>
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
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between font-semibold text-primary text-lg">
                    <span>Total</span>
                    <span>${orderTotals.total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="w-full mb-4"
                  size="lg"
                >
                  {placing ? (
                    <>
                      <ApperIcon name="Loader2" size={20} className="animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="CreditCard" size={20} />
                      Place Order
                    </>
                  )}
                </Button>

                <p className="text-xs text-secondary text-center">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={() => navigate('/checkout/payment')}
              className="flex items-center gap-2"
            >
              <ApperIcon name="ArrowLeft" size={16} />
              Back to Payment
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ApperIcon name="ShoppingCart" size={16} />
              Continue Shopping
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutReviewPage;