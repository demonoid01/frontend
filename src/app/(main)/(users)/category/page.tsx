
import { Card, CardContent } from "@/components/ui/card";
import { apiClient } from "@/utils/helper";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import React, { use } from "react";
import { homeProductsData } from "@/utils/homeProductsData";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots
} from "@/components/ui/carousel";
import { ViewCategory } from "@/components/ViewCategory";

export const dynamic = 'force-dynamic';

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  image: string;
};

async function getCategories() {
  const categories = await apiClient<Category[]>('http://localhost:3542/categories/');
  // console.log("categories==", categories);
  return { categories };
}


export default async function categoryPage() {
  const categoriesData = await getCategories();


  if (!categoriesData?.categories) {
    notFound();
  }
  const { categories } = categoriesData;

  return (
    <div className="pt-20">

      <div className="relative w-full h-[40vh] sm:h-[60vh]">
        <Image
          src="/Rectangle 70.png"
          alt="Banner"
          fill
          className="object-fit"
        />
      </div>
      {/* view categories */}
      <div className="bg-white pt-10 pb-10">
        <ViewCategory categories={categories} />
      </div>

      <div className="pt-16 pb-10">
        <h2 className="uppercase text-xl text-center px-4 font-semibold  pb-12">our feature products</h2>
        <div className="sm:w-[80%] w-[95%] sm:h-[370px] h-[30vh] mx-auto">
          {/* {mobile view} */}
          <div className="sm:hidden grid grid-cols-2 gap-5 p-2">
            {homeProductsData.car_stereo.slice(0, 2).map((items) => {
              return (
                <div key={items.id} className="rounded-xl">
                  <div className="sm:w-[297] h-[300px] relative ">
                    <Image
                      src={items.imageUrl}
                      fill={true}
                      alt={items.title}
                      className="mix-blend bg-[#1f1f1f] object-contain"
                    />
                  </div>
                  <p className="px-1 w-full text-start font-light sm:text-lg">
                    {items.title}
                  </p>
                  <div className="flex gap-2">
                    <p className="px-1  text-start font-light sm:text-sm">
                      ₹ 5,600
                    </p>
                    <Image
                      src="/Group 20.png"
                      alt={items.title}
                      width={93}
                      height={18}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {/* desktop view */}
          <div className="hidden sm:block">
            <div className="grid sm:grid-cols-4 gap-5 p-2">
              {homeProductsData.car_stereo.slice(0, 4).map((items) => {
                return (
                  <div key={items.id} className="rounded-xl">
                    <div className="sm:w-[297] h-[300px] relative ">
                      <Image
                        src={items.imageUrl}
                        fill={true}
                        alt={items.title}
                        className="mix-blend bg-[#1f1f1f] object-contain"
                      />
                    </div>
                    <p className="px-1 w-full text-start font-light sm:text-lg">
                      {items.title}
                    </p>
                    <div className="flex gap-2">
                      <p className="px-1  text-start font-light sm:text-sm">
                        ₹ 5,600
                      </p>
                      <Image
                        src="/Group 20.png"
                        alt={items.title}
                        width={93}
                        height={18}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
        <div className="flex justify-center pt-12">
          <Button className="border border-white bg-transparent text-white pt-1 pb-1 px-10 ">
            View all
          </Button>
        </div>

      </div>



    </div>
  );
}