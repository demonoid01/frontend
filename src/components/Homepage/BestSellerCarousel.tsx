"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { categoryData } from "@/utils/categoryData";
import Image from "next/image";

export function BestSellerCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-md md:max-w-full my-10"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="w-[90%]">
        {categoryData.map((item) => (
          <CarouselItem key={item.id} className="basis-1/2 md:basis-1/6 py-2">
            <div className="p-2">
              <Card className="border-none shadow-sm shadow-white/90">
                <CardContent className="aspect-square relative">
                  <Image
                    src={item.imageUrl}
                    fill={true}
                    alt={item.title}
                    className="w-auto bg-black overflow-hidden h-auto object-cover object-center rounded-xl"
                  />
                  <p className="absolute bottom-0 left-0 text-white rounded-xl text-base lg:text-2xl flex justify-center items-end pb-4 font-semibold bg-black/70 w-full h-full ">
                    {item.title}
                  </p>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  );
}
