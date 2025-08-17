"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import AddressStep from "@/components/checkout/AddressStep";
import OrderSummaryStep from "@/components/checkout/OrderSummaryStep";
import PaymentStep from "@/components/checkout/PaymentStep";
import SuccessMessage from "@/components/checkout/SuccessMessage";

const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    discount: 0,
    deliveryCharge: 49,
    packagingFee: 20,
    total: 0,
  });
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get("/cart");
        if (response.data && Array.isArray(response.data)) {
          setCartItems(response.data);
        } else {
          const cookieCart = Cookies.get("cart");
          const items = cookieCart ? JSON.parse(cookieCart) : [];
          const detailedItems = await Promise.all(
            items.map(async (item) => {
              const productRes = await api.get(
                `/products?id=${item.productId}`
              );
              return { ...item, product: productRes.data.products[0] };
            })
          );
          setCartItems(detailedItems);
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    const calculateSummary = () => {
      const subtotal = cartItems.reduce((total, item) => {
        const price = item.product.salePrice || item.product.basePrice;
        return total + price * item.quantity;
      }, 0);

      const discount = 0; // Calculate any applicable discounts
      const deliveryCharge = 49;
      const packagingFee = 20;
      const total = subtotal - discount + deliveryCharge + packagingFee;

      setOrderSummary({
        subtotal,
        discount,
        deliveryCharge,
        packagingFee,
        total,
      });
    };

    if (cartItems.length > 0) {
      calculateSummary();
    }
  }, [cartItems]);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handlePaymentSuccess = (response) => {
    setPaymentStatus("success");
    setCurrentStep(4); // Move to success page
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 mt-20">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <div className="space-y-4 mt-8">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 mt-24 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Checkout Progress */}
      <div className="flex justify-between mb-8">
        <div
          className={`flex flex-col items-center ${
            currentStep >= 1 ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            1
          </div>
          <span>Address</span>
        </div>
        <div
          className={`flex flex-col items-center ${
            currentStep >= 2 ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            2
          </div>
          <span>Order Summary</span>
        </div>
        <div
          className={`flex flex-col items-center ${
            currentStep >= 3 ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            3
          </div>
          <span>Payment</span>
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <AddressStep
          onAddressSelect={handleAddressSelect}
          selectedAddress={selectedAddress}
          onNext={nextStep}
        />
      )}

      {currentStep === 2 && (
        <OrderSummaryStep
          cartItems={cartItems}
          orderSummary={orderSummary}
          selectedAddress={selectedAddress}
          onNext={nextStep}
          onPrev={prevStep}
        />
      )}

      {currentStep === 3 && (
        <PaymentStep
          amount={orderSummary.total}
          onSuccess={handlePaymentSuccess}
          onPrev={prevStep}
        />
      )}

      {currentStep === 4 && <SuccessMessage />}
    </div>
  );
};

export default CheckoutPage;
