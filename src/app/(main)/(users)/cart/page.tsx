"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useContextData } from "@/ContextData/ContextDatastore";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pendingUpdates, setPendingUpdates] = useState({});
  const { user, removeFromCart } = useContextData();


  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (user) {
          const response = await api.get("/cart");
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
  }, [user]);

  useEffect(() => {
    const calculateTotal = () => {
      const sum = cartItems.reduce((total, item) => {
        const price = item.product.salePrice || item.product.basePrice;
        return total + price * item.quantity;
      }, 0);
      setTotal(sum);
    };
    calculateTotal();
  }, [cartItems]);

  const updateCartCookie = (items) => {
    Cookies.set("cart", JSON.stringify(items), { expires: 365 }); // Persist for 1 year
  };

  const debouncedUpdate = useCallback(
    debounce(async (productId, quantity) => {
      try {
        const response = await api.put(`/cart`, { productId, quantity });
        if (response.data.product) {
          // Logged-in user: Update complete
          setPendingUpdates((prev) => {
            const updated = { ...prev };
            delete updated[productId];
            return updated;
          });
        } else {
          // Anonymous user: Update cookies
          const updatedItems = cartItems.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          );
          setCartItems(updatedItems);
          updateCartCookie(updatedItems);
          setPendingUpdates((prev) => {
            const updated = { ...prev };
            delete updated[productId];
            return updated;
          });
        }
      } catch (error) {
        console.error("Failed to update quantity:", error);
        setCartItems((items) =>
          items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity }
              : item
          )
        );
      }
    }, 500),
    [cartItems]
  );

  const updateQuantity = (productId, quantity) => {
    if (user) {
      setCartItems((items) =>
        items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
      setPendingUpdates((prev) => ({ ...prev, [productId]: true }));
      debouncedUpdate(productId, quantity);
    } else {
      const updatedItems = cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      setCartItems(updatedItems);
      updateCartCookie(
        updatedItems.map(({ productId, quantity }) => ({ productId, quantity }))
      );
    }
  };

  const removeItem = async (productId: number) => {
    try {
      await removeFromCart(productId);
      setCartItems([])
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    try {
      const response = await api.post(`/cart`, { productId, quantity });
      if (response.data.product) {
        // Logged-in user: Fetch updated cart
        const updatedResponse = await api.get("/cart");
        setCartItems(updatedResponse.data);
      } else {
        // Anonymous user: Update cookies
        const productRes = await api.get(`/products?id=${productId}`);
        const newItem = {
          productId,
          quantity,
          product: productRes.data.products[0],
        };
        const updatedItems = [...cartItems, newItem];
        setCartItems(updatedItems);
        updateCartCookie(updatedItems);
      }
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 mt-20">
        <h1 className="text-2xl font-bold ">Your Cart</h1>
        <hr />
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full bg-black" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 mt-32 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Your Cart ({cartItems?.length})
      </h1>
      <hr />
      {cartItems?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mt-8">
            {cartItems?.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 border p-4 rounded-lg"
              >
                <Image
                  src={
                    item?.product.images
                      ? typeof item?.product.images === "string"
                        ? JSON.parse(item?.product.images)[0]
                        : item?.product.images[0]
                      : "https://icon-library.com/images/images-icon/images-icon-13.jpg"
                  }
                  alt={item.product.name}
                  width={80}
                  height={80}
                  className="rounded-lg object-contain"
                />
                <div className="flex-1">
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="font-semibold hover:underline overflow-hidden"
                  >
                    {item.product.name}
                  </Link>
                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="bg-black"
                        size="sm"
                        disabled={
                          item.quantity <= 1 || pendingUpdates[item.productId]
                        }
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                      >
                        {pendingUpdates[item.productId] ? "..." : "-"}
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        className="bg-black"
                        size="sm"
                        disabled={pendingUpdates[item.productId]}
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                      >
                        {pendingUpdates[item.productId] ? "..." : "+"}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-end flex-col gap-4">
                  <p className="font-semibold">
                    {"₹ "}
                    {(
                      (item.product.salePrice || item.product.basePrice) *
                      item.quantity
                    ).toLocaleString("en-in")}
                  </p>
                  <Button
                    variant="destructive"
                    className="p-2 h-10"
                    onClick={() => removeItem(item.productId)}
                  >
                    <Trash size={20} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold">
                {"₹ "}
                {total.toLocaleString("en-in")}
              </span>
            </div>
            <Link href={"/checkout"}>
              <Button className="w-full mt-4" size="lg">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
