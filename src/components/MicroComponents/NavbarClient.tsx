"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Link from "next/link";
import { useContextData } from "@/ContextData/ContextDatastore";
import { Gift, Truck } from "lucide-react";
import Image from "next/image";

const NavbarClient = () => {
  const [isSidebarOpen, setSidebar] = useState(false);
  const { user, loading, logout, wishlistCount, cartCount } = useContextData();

  return (
    <div
      className={`fixed top-0 left-0 w-full z-[999] backdrop-blur-lg transition-transform duration-300 bg-black`}
    >
      <div className="w-full bg-white  overflow-hidden py-2 h-9">
        <div className="flex flex-col justify-center items-center bg-white">
          {/* First block */}
          <div className="animate-slide-up ">
            <div className="">
              <p className="flex items-center justify-center text-gray-800 mb-20">
                Style That Roars.
              </p>
            </div>
            <div className="">
              <p className="flex items-center text-gray-800">
                Home Installation
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* <div className="w-full bg-white  overflow-hidden py-2 h-9 flex items-center justify-center">
        <div className="animate-slide-up">
          <p className="h-10 flex items-center text-lg font-bold text-gray-800">
            FREE Home Installation
          </p>
          <p className="h-10 flex items-center text-lg font-bold text-gray-800">
            Home FREE Home Installation
          </p>
        </div>
      </div> */}

      {/* main navbar */}
      <div className=" flex justify-between items-center relative h-full  py-4 px-3 sm:px-4 sm:pt-7">

        <div className="sm:hidden flex items-center relative">
          <svg
            xmlns="https://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={0.75}
            stroke="currentColor"
            className="size-10 text-white"
            onClick={() => setSidebar(true)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
            />
          </svg>
          <div className="">

            <Sidebar
              isSidebarOpen={isSidebarOpen}
              setSidebar={setSidebar}
              user={user}
              loading={loading}
              logout={logout}
            />
          </div>
        </div>

        {/* logo */}
        <div className="absolute left-1/2 -translate-x-1/2 sm:left-20">
          <Link href={"/"}>
            <Image src="/Group 36.png" alt="Logo" width={1200} height={600} className="w-full max-w-4xl h-auto object-cover" />
          </Link>
        </div>
        <div className="hidden sm:block absolute sm:left-1/2 sm:-translate-x-1/2">
          <div className=" uppercase text-white space-x-1 text-sm">
            <Link className="transition duration-300 hover:shadow-[0_4px_10px_white] p-2" href={"/"}>Home</Link>
            <Link className="transition duration-300 hover:shadow-[0_4px_10px_white] p-2" href={""}>Crazy Deal</Link>
            <Link className="transition duration-300 hover:shadow-[0_4px_10px_white] p-2" href={""}>Categories</Link>
          </div>

        </div>

        {/* icons */}
        <div className="absolute right-4 flex items-center gap-2">
          <div>
            <Link href={"/search"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={0.75}
                stroke="currentColor"
                className="size-8 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </Link>
          </div>
          {/* <div className="relative">
            <Link href={"/wishlist"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={0.75}
                stroke="currentColor"
                className="size-5 sm:size-7  text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </Link>
            <span className="absolute -top-2 bg-white text-black px-1 rounded-full -right-2 font-bold border text-xs">
              {wishlistCount}
            </span>
          </div> */}
          <div className="relative">
            <Link href={"/cart"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={0.75}
                stroke="currentColor"
                className="size-8 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </Link>
            <span className="absolute -top-2 bg-white text-black px-1 rounded-full -right-2 font-bold border text-xs">
              {cartCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarClient;