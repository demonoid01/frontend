// "use client"
// import React, { useRef } from "react";
import Image from "next/image";
import HomeBestSellers from "@/components/Homepage/HomeBestSellers";
import CategorySlider from "@/components/Homepage/CategorySlider";
import HomeProducts from "@/components/Homepage/HomeProducts";
import TopVideo from "@/components/Homepage/TopVideo";
import { notFound } from "next/navigation";

import HomeFaq from "@/components/HomeFaq";
import TopVideo2 from "@/components/Homepage/TopVideo2";
import CarouselSeamless from "@/components/Homepage/CarouselSeamless";
import { ImageCarousel } from "@/components/Homepage/ImageCarousel";
import { apiClient } from "@/utils/helper";
import DesktopTopVideo from "@/components/Homepage/DesktopTopVideo";
import DesktopBestSellers from "@/components/Desktop/DesktopBestSellers";
import DesktopHomeProduct from "@/components/Desktop/DesktopHomeProducts";
import { DesktopImageCarousel } from "@/components/Desktop/DesktopImageCarousel";
import DesktopTopVideo2 from "@/components/Desktop/DesktopTopVideo2";



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
  // const categories = await prisma.category.findMany();
  // let categories = await fetch("http://localhost:3542/categories");
  // categories = await categories.json()
  // console.log(categories);
  // return { categories }
  const categories = await apiClient<Category[]>('http://localhost:3542/categories/');
  console.log("categories==", categories);

  return { categories };
  // const categories = await apiClient<Category[]>('http://localhost:3542/categories', { method: 'POST', body: { id: 1 } });
  // return { categories };

}


export default async function Homepage() {
  const categoriesData = await getCategories();

  if (!categoriesData?.categories) {
    notFound();
  }

  // const targetRef = useRef(null) -[#111];

  const { categories } = categoriesData;

  return (
    <div className="min-h-dvh bg-[#111]">

      <TopVideo />
      <DesktopTopVideo />

      <div className="mt-[100vh] sm:mt-0 pb-4 bg-[#111]">
        <CategorySlider categories={categories} />
        <div className="sm:hidden relative h-[430px] md:h-[430px] md:w-[700px] w-full aspect-square bg-repeat mb-5 bg-yellow-400">
          <TopVideo2 />
        </div>
        <div className="hidden sm:block sm:w-full bg-repeat  bg-black mb-5">
          <DesktopTopVideo2 />
        </div>
        <CarouselSeamless />
        <HomeBestSellers />
        <DesktopBestSellers />
        <div className="w-full relative h-[250px] sm:h[405px]">
          <Image
            src="/banner.png"
            fill
            alt="banner"
          // className="object-cover"
          />
        </div>
        <HomeProducts />
        <DesktopHomeProduct />


        <div className="">
          <div className="w-full bg-white  overflow-hidden py-4 ">
            <div className="flex whitespace-nowrap gap-10 animate-marquee font-bold items-center uppercase ">
              {/* First block */}
              <div className="flex items-center space-x-10 shrink-0">
                <div className="flex items-center gap-2 text-black/75">
                  <span>FREE Home Installation</span>
                </div>
                <div className="flex items-center gap-2 text-black/75">
                  <span>FREE Home Installation</span>
                </div>
              </div>

              {/* Duplicate block for seamless loop */}
              <div className="flex items-center space-x-10 shrink-0">
                <div className="flex items-center gap-2 text-black/75">
                  <span>FREE Home Installation</span>
                </div>
                <div className="flex items-center gap-2 text-black/75">
                  <span>FREE Home Installation</span>
                </div>
              </div>
              <div className="flex items-center space-x-10 shrink-0">
                <div className="flex items-center gap-2 text-black/75">
                  <span>FREE Home Installation</span>
                </div>
                <div className="flex items-center gap-2 text-black/75">
                  <span>FREE Home Installation</span>
                </div>
              </div>
              <div className="flex items-center space-x-10 shrink-0">
                <div className="flex items-center gap-2 text-black/75">
                  <span>FREE Home Installation</span>
                </div>
                <div className="flex items-center gap-2 text-black/75">
                  <span>FREE Home Installation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ImageCarousel />
        <DesktopImageCarousel />

        <HomeFaq />
      </div>
    </div>
  );
}
