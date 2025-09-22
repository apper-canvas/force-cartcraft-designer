import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import orderService from "@/services/api/orderService";
import { toast } from "react-toastify";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const orderHistory = await orderService.getOrderHistory();
      setOrders(orderHistory);
    } catch (error) {
      toast.error("Failed to load order history");
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      processing: { variant: "warning", label: "Processing" },
      shipped: { variant: "info", label: "Shipped" },
      delivered: { variant: "success", label: "Delivered" }
    };
    const config = statusConfig[status] || statusConfig.processing;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getItemsSummary = (items) => {
    if (items.length === 1) {
      return items[0].title;
    } else {
      return `${items[0].title} +${items.length - 1} more`;
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="p-2 hover:bg-background rounded-lg transition-colors"
              >
                <ApperIcon name="ArrowLeft" size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-primary">My Orders</h1>
                <p className="text-secondary">Track and manage your order history</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-accent">{orders.length}</p>
              <p className="text-sm text-secondary">Total Orders</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="bg-surface p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by order number or item name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Empty
            icon="Package"
            title="No Orders Found"
            description={searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search or filters" 
              : "You haven't placed any orders yet"}
            action={
              <Link to="/">
                <Button className="flex items-center gap-2">
                  <ApperIcon name="ShoppingBag" size={16} />
                  Start Shopping
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.orderNumber}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-primary">
                          Order #{order.orderNumber}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-secondary">Order Date</p>
                          <p className="font-medium">{formatDate(order.orderDate)}</p>
                        </div>
                        <div>
                          <p className="text-secondary">Items</p>
                          <p className="font-medium">{getItemsSummary(order.items)}</p>
                        </div>
                        <div>
                          <p className="text-secondary">Total</p>
                          <p className="font-bold text-lg">${order.totals.grandTotal.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link to={`/orders/${order.orderNumber}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <ApperIcon name="Eye" size={16} />
                          View Details
                        </Button>
                      </Link>
                      {order.status === "delivered" && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => navigate(`/orders/${order.orderNumber}?action=reorder`)}
                        >
                          <ApperIcon name="RotateCcw" size={16} />
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrdersPage;