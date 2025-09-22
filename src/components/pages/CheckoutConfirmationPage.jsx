import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { toast } from "react-toastify";

const CheckoutConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (location.state?.order) {
      setOrder(location.state.order);
    } else {
      toast.error('No order information found');
      navigate('/');
    }
  }, [location, navigate]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="Loader2" size={32} className="animate-spin text-accent mx-auto mb-4" />
          <p className="text-secondary">Loading order confirmation...</p>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-success rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ApperIcon name="Check" size={40} className="text-white" />
          </motion.div>

          <h1 className="text-3xl font-bold text-primary mb-2">Order Confirmed!</h1>
          <p className="text-secondary mb-8">
            Thank you for your purchase. Your order has been successfully placed and is being processed.
          </p>

          {/* Order Details Card */}
          <div className="bg-surface rounded-lg shadow-sm border p-6 text-left mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-primary mb-1">Order Details</h2>
                <p className="text-sm text-secondary">Order #{order.orderNumber}</p>
              </div>
              <Badge variant="success" className="px-3 py-1">
                Confirmed
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium text-primary mb-2">Shipping Address</h3>
                <div className="text-sm text-secondary space-y-1">
                  <p>{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
                  <p>{order.shippingInfo.address}</p>
                  <p>{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-primary mb-2">Order Information</h3>
                <div className="text-sm text-secondary space-y-1">
                  <p>Order Date: {formatDate(order.orderDate)}</p>
                  <p>Payment Method: **** {order.paymentInfo.cardNumber.slice(-4)}</p>
                  <p>Estimated Delivery: {formatDate(order.estimatedDelivery)}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-primary mb-4">Items Ordered</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center">
                        <ApperIcon name="Package" size={16} className="text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium text-primary">{item.name}</p>
                        <p className="text-sm text-secondary">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Totals */}
            <div className="border-t pt-6 mt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Subtotal</span>
                  <span>${order.totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Shipping</span>
                  <span>${order.totals.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Tax</span>
                  <span>${order.totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-primary text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${order.totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-surface rounded-lg shadow-sm border p-6 text-left mb-8">
            <h3 className="font-semibold text-primary mb-4">What's Next?</h3>
            <div className="space-y-3 text-sm text-secondary">
              <div className="flex items-start space-x-3">
                <ApperIcon name="Mail" size={16} className="text-accent mt-1" />
                <p>You'll receive an order confirmation email at {order.shippingInfo.email}</p>
              </div>
              <div className="flex items-start space-x-3">
                <ApperIcon name="Package" size={16} className="text-accent mt-1" />
                <p>Your order will be processed and shipped within 1-2 business days</p>
              </div>
              <div className="flex items-start space-x-3">
                <ApperIcon name="Truck" size={16} className="text-accent mt-1" />
                <p>Track your order using the tracking number that will be sent to your email</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
              size="lg"
            >
              <ApperIcon name="ShoppingBag" size={20} />
              Continue Shopping
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="flex items-center gap-2"
              size="lg"
            >
              <ApperIcon name="Printer" size={20} />
              Print Receipt
            </Button>
          </div>

          {/* Support Information */}
          <div className="mt-8 p-4 bg-background rounded-lg">
            <p className="text-sm text-secondary mb-2">
              Need help with your order?
            </p>
            <p className="text-sm text-secondary">
              Contact our support team at support@cartcraft.com or call 1-800-CARTCRAFT
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutConfirmationPage;