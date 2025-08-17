import { Button } from "@/components/ui/button";
import Image from "next/image";

const OrderSummaryStep = ({
  cartItems,
  orderSummary,
  selectedAddress,
  onNext,
  onPrev,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Order Summary</h2>

      {/* Delivery Address */}
      <div className="border p-4 rounded-lg">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold">Delivery Address</h3>
          <Button variant="link" onClick={onPrev}>
            Change
          </Button>
        </div>
        <div className="mt-2">
          <p className="font-medium">{selectedAddress.fullName}</p>
          <p className="text-sm mt-1">{selectedAddress.phoneNumber}</p>
          <p className="text-sm mt-1">
            {selectedAddress.houseNumber}, {selectedAddress.roadName},
            {selectedAddress.nearbyArea && `${selectedAddress.nearbyArea}, `}
            {selectedAddress.city}, {selectedAddress.state} -{" "}
            {selectedAddress.pincode}
          </p>
        </div>
      </div>

      {/* Cart Items */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-4 border-b">
          <h3 className="font-semibold">Items ({cartItems.length})</h3>
        </div>
        <div className="divide-y">
          {cartItems.map((item) => (
            <div key={item.productId} className="flex p-4 gap-4">
              <Image
                src={
                  item?.product.images
                    ? typeof item?.product.images === "string"
                      ? JSON.parse(item?.product.images)[0]
                      : item?.product.images[0]
                    : "https://icon-library.com/images/images-icon/images-icon-13.jpg"
                }
                alt={item.product.name}
                width={60}
                height={60}
                className="rounded-md object-contain"
              />
              <div className="flex-1">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {"₹ "}
                  {(
                    (item.product.salePrice || item.product.basePrice) *
                    item.quantity
                  ).toLocaleString("en-in")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-4 border-b">
          <h3 className="font-semibold">Price Details</h3>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹ {orderSummary.subtotal.toLocaleString("en-in")}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span className="text-green-600">
              - ₹ {orderSummary.discount.toLocaleString("en-in")}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charge</span>
            <span>₹ {orderSummary.deliveryCharge.toLocaleString("en-in")}</span>
          </div>
          <div className="flex justify-between">
            <span>Packaging Fee</span>
            <span>₹ {orderSummary.packagingFee.toLocaleString("en-in")}</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>₹ {orderSummary.total.toLocaleString("en-in")}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onPrev}>
          Back to Address
        </Button>
        <Button onClick={onNext}>Proceed to Payment</Button>
      </div>
    </div>
  );
};

export default OrderSummaryStep;
