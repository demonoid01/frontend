import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import Script from "next/script";
import { toast } from "sonner";

const PaymentStep = ({ amount, onSuccess, onPrev }) => {
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    // Create Razorpay order when component mounts
    const createOrder = async () => {
      try {
        setLoading(true);
        const response = await api.post("/orders/create", {
          amount: amount * 100, // Razorpay expects amount in paise
        });

        if (response.data && response.data.id) {
          setOrderId(response.data.id);
        } else {
          toast({
            title: "Error",
            description: "Failed to create payment order",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Payment order creation failed:", error);
        toast({
          title: "Error",
          description: "Failed to initialize payment",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    createOrder();
  }, [amount, toast]);

  const handlePayment = () => {
    if (!orderId) {
      toast({
        title: "Error",
        description: "Payment initialization failed. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount * 100, // in paise
      currency: "INR",
      name: "Your Store Name",
      description: "Purchase Payment",
      order_id: orderId,
      handler: function (response) {
        // Handle successful payment
        verifyPayment(response);
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  const verifyPayment = async (paymentResponse) => {
    try {
      setLoading(true);
      const response = await api.post("/orders/verify", {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      });

      if (response.data && response.data.success) {
        toast({
          title: "Success",
          description: "Payment successful!",
        });
        onSuccess(response.data);
      } else {
        toast({
          title: "Error",
          description: "Payment verification failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      toast({
        title: "Error",
        description: "Payment verification failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <h2 className="text-xl font-semibold">Payment</h2>

      <div className="border rounded-lg p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold">Order Total</h3>
          <p className="text-3xl font-bold mt-2">
            ₹ {amount.toLocaleString("en-in")}
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm">
              You'll be redirected to Razorpay's secure payment gateway to
              complete your purchase.
            </p>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={onPrev} disabled={loading}>
              Back to Order Summary
            </Button>
            <Button
              onClick={handlePayment}
              disabled={loading || !orderId}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Processing..." : "Pay Now"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
