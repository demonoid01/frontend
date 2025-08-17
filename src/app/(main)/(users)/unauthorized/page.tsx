"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const UnauthorizedPage = () => {
  const [time, setTime] = useState(5); // Start countdown from 5
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    const timer = setTimeout(() => {
      router.push("/auth/login");
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [router]);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-red-600">Access Denied 🚫</h1>
      <p className="text-lg text-center mt-4">
        You do not have the necessary permissions to access the admin panel.
      </p>
      <p className="text-sm text-gray-200 mt-10">Redirecting to homepage in</p>
      <p className="text-3xl font-bold text-gray-100 mt-10">{time}</p>
    </div>
  );
};

export default UnauthorizedPage;
