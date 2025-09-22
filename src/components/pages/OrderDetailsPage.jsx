import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import orderService from "@/services/api/orderService";
import cartService from "@/services/api/cartService";
import { toast } from "react-toastify";

function OrderDetailsPage() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reorderLoading, setReorderLoading] = useState(false);

  useEffect(() => {
    loadOrderDetails();
    
    // Handle reorder action from URL params
    if (searchParams.get('action') === 'reorder') {
      handleReorder();
    }
  }, [orderNumber, searchParams]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const orderDetails = await orderService.getOrderByNumber(orderNumber);
      if (!orderDetails) {
        toast.error("Order not found");
        navigate("/orders");
        return;
      }
      setOrder(orderDetails);
    } catch (error) {
      toast.error("Failed to load order details");
      console.error("Error loading order:", error);
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async () => {
    if (!order) return;
    
    try {
      setReorderLoading(true);
      const items = await orderService.reorderItems(order.orderNumber);
      await cartService.addMultipleItems(items);
      toast.success(`${items.length} items added to cart`);
      navigate("/");
    } catch (error) {
      toast.error("Failed to reorder items");
      console.error("Error reordering:", error);
    } finally {
      setReorderLoading(false);
    }
  };

  const getStatusProgress = () => {
    return orderService.getStatusProgress(order?.status);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      processing: { variant: "warning", label: "Processing" },
      shipped: { variant: "info", label: "Shipped" },
      delivered: { variant: "success", label: "Delivered" }
    };
    const config = statusConfig[status] || statusConfig.processing;
    return <Badge variant={config.variant} className="px-3 py-1">{config.label}</Badge>;
  };

  if (loading) {
    return <Loading />;
  }

  if (!order) {
    return (
      <Empty
        icon="Package"
        title="Order Not Found"
        description="The order you're looking for doesn't exist"
        action={
          <Button onClick={() => navigate("/orders")} className="flex items-center gap-2">
            <ApperIcon name="ArrowLeft" size={16} />
            Back to Orders
          </Button>
        }
      />
    );
  }

  const statusProgress = getStatusProgress();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/orders")}
                className="p-2 hover:bg-background rounded-lg transition-colors"
              >
                <ApperIcon name="ArrowLeft" size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-primary">Order #{order.orderNumber}</h1>
                <p className="text-secondary">Placed on {formatDate(order.orderDate)}</p>
              </div>
            </div>
            {getStatusBadge(order.status)}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Progress */}
        <div className="bg-surface rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-primary mb-6">Order Progress</h2>
          
          {/* Progress Bar */}
          <div className="relative mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-secondary">Processing</span>
              <span className="text-sm font-medium text-secondary">Shipped</span>
              <span className="text-sm font-medium text-secondary">Delivered</span>
            </div>
            
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${statusProgress.progress}%` }}
                ></div>
              </div>
              
              {/* Progress Steps */}
              <div className="flex justify-between absolute -top-2 w-full">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      step <= statusProgress.step 
                        ? 'bg-accent border-accent text-white' 
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {step <= statusProgress.step && (
                      <ApperIcon name="Check" size={12} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-primary mb-3">Current Status</h3>
              <p className="text-lg font-medium text-accent">{statusProgress.label}</p>
              {order.status === 'shipped' && order.shippedDate && (
                <p className="text-sm text-secondary mt-1">
                  Shipped on {formatDate(order.shippedDate)}
                </p>
              )}
              {order.status === 'delivered' && order.deliveredDate && (
                <p className="text-sm text-secondary mt-1">
                  Delivered on {formatDate(order.deliveredDate)}
                </p>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-3">Tracking Information</h3>
              <p className="font-mono text-sm bg-background px-3 py-2 rounded border">
                {order.trackingNumber}
              </p>
              <p className="text-sm text-secondary mt-2">
                Estimated delivery: {formatDate(order.estimatedDelivery)}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-surface rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-primary">Order Items</h2>
            <Button
              onClick={handleReorder}
              disabled={reorderLoading}
              className="flex items-center gap-2"
              size="sm"
            >
              {reorderLoading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  Adding to Cart...
                </>
              ) : (
                <>
                  <ApperIcon name="RotateCcw" size={16} />
                  Reorder All Items
                </>
              )}
            </Button>
          </div>
          
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-primary">{item.title}</h3>
                  <p className="text-sm text-secondary">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
<p className="font-semibold text-primary">${((item?.price ?? 0) * (item?.quantity ?? 0)).toFixed(2)}</p>
                  <p className="text-sm text-secondary">${(item?.price ?? 0).toFixed(2)} each</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Order Summary & Shipping */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Address */}
          <div className="bg-surface rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-primary mb-4">Shipping Address</h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
              <p>{order.shippingInfo.address}</p>
              {order.shippingInfo.apartment && (
                <p>{order.shippingInfo.apartment}</p>
              )}
              <p>{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}</p>
              <p>{order.shippingInfo.country}</p>
              {order.shippingInfo.phone && (
                <p className="mt-3">
                  <span className="text-secondary">Phone:</span> {order.shippingInfo.phone}
                </p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-surface rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-primary mb-4">Order Summary</h2>
            <div className="space-y-3">
<div className="flex justify-between">
                <span className="text-secondary">Subtotal</span>
                <span>${(order?.totals?.subtotal ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Shipping</span>
                <span>${(order?.totals?.shipping ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Tax</span>
                <span>${(order?.totals?.tax ?? 0).toFixed(2)}</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-accent">${(order?.totals?.grandTotal ?? 0).toFixed(2)}</span>
              </div>
              
              {/* Payment Method */}
              <div className="mt-6 pt-4 border-t">
                <h3 className="font-semibold text-primary mb-2">Payment Method</h3>
                <p className="text-sm">•••• •••• •••• {order.paymentInfo.cardNumber.slice(-4)}</p>
                <p className="text-sm text-secondary">{order.paymentInfo.cardholderName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;