import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

const SuccessMessage = () => {
  return (
    <div className="text-center py-12 space-y-6">
      <div className="flex justify-center">
        <CheckCircle className="h-24 w-24 text-green-500" />
      </div>
      
      <h2 className="text-2xl font-bold">Payment Successful!</h2>
      
      <p className="text-gray-600 max-w-md mx-auto">
        Thank you for your purchase. Your order has been placed successfully and will be processed soon.
      </p>
      
      <div className="pt-6 space-x-4">
        <Link href="/orders">
          <Button variant="outline">View Orders</Button>
        </Link>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
};

export default SuccessMessage;
