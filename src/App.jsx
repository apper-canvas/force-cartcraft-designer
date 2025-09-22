import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "@/components/pages/HomePage";
import ProductDetailPage from "@/components/pages/ProductDetailPage";
import CheckoutShippingPage from "@/components/pages/CheckoutShippingPage";
import CheckoutPaymentPage from "@/components/pages/CheckoutPaymentPage";
import CheckoutReviewPage from "@/components/pages/CheckoutReviewPage";
import CheckoutConfirmationPage from "@/components/pages/CheckoutConfirmationPage";
import MyOrdersPage from "@/components/pages/MyOrdersPage";
import OrderDetailsPage from "@/components/pages/OrderDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
<Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/checkout/shipping" element={<CheckoutShippingPage />} />
          <Route path="/checkout/payment" element={<CheckoutPaymentPage />} />
          <Route path="/checkout/review" element={<CheckoutReviewPage />} />
          <Route path="/checkout/confirmation" element={<CheckoutConfirmationPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
          <Route path="/orders/:orderNumber" element={<OrderDetailsPage />} />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;