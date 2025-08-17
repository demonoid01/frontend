"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "@/lib/api";
import Cookies from "js-cookie";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextType {
  user: User | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  check: boolean;
  setCheck: React.Dispatch<React.SetStateAction<boolean>>;
  wishlistCount: number;
  cartCount: number;
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface ContextDatastoreProps {
  children: ReactNode;
  initialUser?: User | null;
}

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  addresses?: UserAddress[];
  wishlistCount?: number;
  cartCount?: number;
}

interface UserAddress {
  id: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export const ContextDatastore = ({ children }: ContextDatastoreProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const checkAuth = async () => {
    try {
      setLoading(true);
      // const response = await api.get("/auth/me");
      const response = { status: 200 };
      console.log(response, "======");

      if (response.status === 200) {
        // setUser(response.data.user);
        // setWishlistCount(response.data.user.wishlistCount || 0);
        // setCartCount(response.data.user.cartCount || 0);
      } else {
        setUser(null);
        const cookieWishlist = Cookies.get("wishlist");
        const wishlistItems = cookieWishlist ? JSON.parse(cookieWishlist) : [];
        setWishlistCount(wishlistItems.length);
        const cookieCart = Cookies.get("cart");
        const cartItems = cookieCart ? JSON.parse(cookieCart) : [];
        setCartCount(cartItems.length);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      const cookieWishlist = Cookies.get("wishlist");
      const wishlistItems = cookieWishlist ? JSON.parse(cookieWishlist) : [];
      setWishlistCount(wishlistItems.length);
      const cookieCart = Cookies.get("cart");
      const cartItems = cookieCart ? JSON.parse(cookieCart) : [];
      setCartCount(cartItems.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [check]);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      setWishlistCount(0);
      setCartCount(0);
      Cookies.remove("wishlist");
      Cookies.remove("cart");
      setCheck((prev) => !prev);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  const addToWishlist = async (productId: number) => {
    if (user) {
      try {
        const response = await api.put("/wishlist", {
          productId,
          action: "add",
        });
        if (response.data.action === "added") {
          setWishlistCount((prev) => prev + 1);
          toast.success("Added to wishlist");
        }
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        toast.error("Failed to add to wishlist");
      }
    } else {
      const cookieWishlist = Cookies.get("wishlist");
      let items = cookieWishlist ? JSON.parse(cookieWishlist) : [];
      if (!items.some((item) => item.productId === productId)) {
        items.push({ productId });
        Cookies.set("wishlist", JSON.stringify(items), { expires: 365 });
        setWishlistCount(items.length);
        toast.success("Added to wishlist");
      }
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (user) {
      try {
        const response = await api.put("/wishlist", {
          productId,
          action: "remove",
        });
        if (response.data.action === "removed") {
          setWishlistCount((prev) => prev - 1);
          toast.success("Removed from wishlist");
        }
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        toast.error("Failed to remove from wishlist");
      }
    } else {
      const cookieWishlist = Cookies.get("wishlist");
      let items = cookieWishlist ? JSON.parse(cookieWishlist) : [];
      const updatedItems = items.filter((item) => item.productId !== productId);
      Cookies.set("wishlist", JSON.stringify(updatedItems), { expires: 365 });
      setWishlistCount(updatedItems.length);
      toast.success("Removed from wishlist");
    }
  };

  const addToCart = async (
    productId: number,
    quantity: number = 1,
    variantId?: number
  ) => {
    if (user) {
      try {
        const requestBody: {
          productId: number;
          quantity: number;
          variantId?: number;
        } = {
          productId,
          quantity,
        };
        if (
          variantId !== undefined &&
          variantId !== null &&
          !isNaN(variantId)
        ) {
          requestBody.variantId = Number(variantId);
        }
        console.log("Sending to /cart:", requestBody);

        await api.post("/cart", requestBody);
        const response = await api.get("/auth/me");
        setCartCount(response.data.user.cartCount || 0);
        toast.success("Added to cart");
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add to cart");
      }
    } else {
      const cookieCart = Cookies.get("cart");
      let items = cookieCart ? JSON.parse(cookieCart) : [];

      const existingItem = items.find(
        (item) =>
          item.productId === productId && item.variantId === (variantId ?? null)
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        items.push({
          productId,
          quantity,
          variantId:
            variantId !== undefined && variantId !== null && !isNaN(variantId)
              ? Number(variantId)
              : null,
        });
      }

      Cookies.set("cart", JSON.stringify(items), { expires: 365 });
      setCartCount(items.length);
      toast.success("Added to cart");
    }
  };

  const removeFromCart = async (productId: number) => {
    if (user) {
      try {
        await api.delete(`/cart`, { data: { productId } });
        const response = await api.get("/auth/me");
        setCartCount(response.data.user.cartCount || 0);
        toast.success("Removed from cart");
      } catch (error) {
        console.error("Error removing from cart:", error);
        toast.error("Failed to remove from cart");
      }
    } else {
      const cookieCart = Cookies.get("cart");
      let items = cookieCart ? JSON.parse(cookieCart) : [];
      const updatedItems = items.filter((item) => item.productId !== productId);
      Cookies.set("cart", JSON.stringify(updatedItems), { expires: 365 });
      setCartCount(updatedItems.length);
      toast.success("Removed from cart");
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get("/auth/me");
      if (response.status === 200) {
        setUser(response.data.user);
        setWishlistCount(response.data.user.wishlistCount || 0);
        setCartCount(response.data.user.cartCount || 0);
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        checkAuth,
        logout,
        setCheck,
        check,
        wishlistCount,
        cartCount,
        addToWishlist,
        removeFromWishlist,
        addToCart,
        removeFromCart,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useContextData = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useContextData must be used within a ContextDatastore");
  }
  return context;
};