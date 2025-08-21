"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useContextData } from "@/ContextData/ContextDatastore";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, removeFromWishlist } = useContextData();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        if (user) {
          const response = await api.get("/wishlist");
          setWishlistItems(response.data);
        } else {
          // Anonymous user: Use cookies
          const cookieWishlist = Cookies.get("wishlist");
          const items = cookieWishlist ? JSON.parse(cookieWishlist) : [];
          // Fetch product details for each wishlist item
          const detailedItems = await Promise.all(
            items.map(async (item) => {
              const productRes = await api.get(
                `/products?id=${item.productId}`
              );
              return { ...item, product: productRes.data.products[0] };
            })
          );
          setWishlistItems(detailedItems);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        setWishlistItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishlist();
  }, [user]);

  const updateWishlistCookie = (items) => {
    Cookies.set("wishlist", JSON.stringify(items), { expires: 365 }); // Persist for 1 year
  };

  const removeItem = async (productId: number) => {
    try {
      await removeFromWishlist(productId);
      setWishlistItems([])
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 mt-20">
        <h1 className="text-2xl font-bold ">Your Wishlist</h1>
        <hr />
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 bg-black" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 mt-32 h-[80vh]">
      <h1 className="text-2xl font-bold mb-6">
        Your Wishlist ({wishlistItems.length})
      </h1>
      <hr />
      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <p className="text-gray-500 mb-4">Your wishlist is empty</p>
          <Link href="/">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistItems.map((item) => (
            <div key={item?.productId} className="border rounded-lg p-4">
              <Link href={`/product/${item?.product.slug}`}>
                <Image
                  src={
                    item?.product.images
                      ? typeof item?.product.images === "string"
                        ? JSON.parse(item?.product.images)[0]
                        : item?.product.images[0]
                      : "https://icon-library.com/images/images-icon/images-icon-13.jpg"
                  }
                  alt={item?.product.name}
                  width={400}
                  height={300}
                  className="h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold hover:underline">
                  {item?.product.name}
                </h3>
                <div className="flex justify-between items-center mt-2">
                  <p className="font-semibold">
                    ₹{item?.product.salePrice || item?.product.basePrice}
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      removeItem(item?.productId);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
