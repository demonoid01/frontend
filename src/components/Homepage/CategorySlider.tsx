"use client"
import React from "react";
import { CategoryCarousel } from "./CategoryCarousel";
import { Button } from "../ui/button";
import { DesktopCategory } from "../Desktop/DesktopCategory";

import { useRouter } from "next/navigation";

const CategorySlider = ({ categories }) => {
  const router = useRouter();



  return (
    <div className="bg-[linear-gradient(to_top,#700200_0%,#330000_74%,#000000_100%)]" >

      <div className="relative pb-10">
        <div className="flex justify-between px-4 py-6 items-center">
          <p className="px-4 py-6 font-thin">Our
            <span className="font-medium text-xl"> Categories</span>
          </p>
          <Button onClick={() => router.push("/category")} >View more</Button>
        </div>
        <div className="sm:hidden">
          <CategoryCarousel categories={categories} />
        </div>
        <div className="hidden sm:block">
          <DesktopCategory categories={categories} />
        </div>
      </div>
    </div>
  );
};

export default CategorySlider;
