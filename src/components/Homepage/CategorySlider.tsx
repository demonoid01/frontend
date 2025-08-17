import React from "react";
import { CategoryCarousel } from "./CategoryCarousel";
import { Button } from "../ui/button";
import { DesktopCategory } from "../Desktop/DesktopCategory";
// import { Category } from "@prisma/client";

const CategorySlider = ({ categories }) => {
  return (
    <div className="bg-gradient-to-b from-black to-red-900" >

      <div className="relative pb-10">
        <div className="flex justify-between px-4 py-6 items-center">
          <p className="px-4 py-6 font-thin">Our
            <span className="font-medium text-xl"> Categories</span>
          </p>
          <Button>View more</Button>
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
