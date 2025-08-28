"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Cookies from "js-cookie";
import { apiClient } from "@/utils/helper";


type User = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
};



const UserRegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    image: "",
  });
  const [showpass, setShowpass] = useState("password");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get fresh CSRF token
      // const wishlistCookie = Cookies.get("wishlist");
      // const cartCookie = Cookies.get("cart");
      // const { data: csrfData } = await api.get("/auth/csrf");

      // const response = await api.post("/auth/register", {
      //   ...formData,
      //   wishlistCookie,
      //   cartCookie,
      //   _csrf: csrfData.csrfToken,
      // });
      console.log("formData===", formData);

      const response = await apiClient<User[]>('http://147.93.107.197:3542/auth/register', { method: 'POST', body: { ...formData } });

      console.log("Registration successful:", response);
      if (response.message === "User registered successfully") {
        // Clear cookies after syncing
        toast.success("Registered successfully");
        // Cookies.remove("wishlist");
        // Cookies.remove("cart");
        navigate.push("/");
      }
    } catch (err) {
      // Improved error handling
      const errorMessage =
        err?.response?.data?.message || "Registration failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex justify-center flex-col items-center gap-4 px-4">
      <form
        onSubmit={handleSubmit}
        className="mx-10 w-full max-w-md flex flex-col items-center gap-4 p-8 rounded-lg shadow-lg border bg-black border-zinc-800"
      >
        <h1 className="text-2xl font-light flex justify-start text-gray-100 pb-4">
          Create a new account
        </h1>
        <Input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="lastName"
          placeholder="Last Name (Optional)"
          value={formData.lastName}
          onChange={handleChange}
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <div className="w-full relative">
          <Input
            type={showpass}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="absolute top-[6px] right-2">
            {showpass === "text" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
                onClick={() => setShowpass("password")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
                onClick={() => setShowpass("text")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            )}
          </div>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <Button
          type="submit"
          className="bg-white text-black w-full"
          disabled={loading}
        >
          {loading ? (
            <div className="w-6 h-6 rounded-full border-t-2 border-r-2 border-black animate-spin"></div>
          ) : (
            "Register"
          )}
        </Button>
      </form>
      <p>
        Already have an account?{" "}
        <span
          onClick={() => navigate.push("/auth/login")}
          className="underline cursor-pointer"
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default UserRegisterPage;
