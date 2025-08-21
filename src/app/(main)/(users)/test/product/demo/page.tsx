import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { homeProductsData } from "@/utils/homeProductsData";
import Image from "next/image";
import React from "react";

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col mt-20">
      <div className="relative max-h-[69vh] overflow-y-scroll">
        <div className="grid grid-cols-1 gap-4 p-2">
          {homeProductsData.car_stereo.map((items) => {
            return (
              <div key={items.id} className="">
                <div className="aspect-square relative">
                  <Image
                    src={items.imageUrl}
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD"
                    placeholder="blur"
                    fill={true}
                    alt={items.title}
                    className="mix-blend object-cover border-b p-10"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sticky top-0 bg-black text-white z-10 border-t-4 border-white/80">
        <div className="p-4 space-y-2">
          <p className="text-2xl font-light">Boult Cruisecam X1 1080p</p>
          <div className="text-sm space-y-2 text-white/80 px-1">
            <p>₹ 5,950.00</p>
            <p className="text-xs">MRP incl. of all taxes</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 space-y-8 pb-10">
        <div className="flex items-center justify-between gap-8">
          <Button className="w-full">ADD</Button>
          <Button className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>
          </Button>
        </div>
        <div className="space-y-4 text-sm">
          <p className="">
            Boult Cruisecam X1 1080p, 170° FOV, WIFI, G-Sensor, Collision
            Detection, App Control In-car Camera System (1 Camera, 1080p)
          </p>
          <p>
            Introducing the all-new CruiseCam X1 -where safety takes the wheel.
            This cutting-edge dashcam is designed to provide unparalleled
            protection and peace of mind on the road. Capture every detail with
            1080p Full HD recording and a high-quality 2MP sensor, ensuring your
            footage is crisp and clear. <br /> <br /> The 170-degree ultra-wide
            field of view offers expansive coverage, making sure nothing is
            missed.
          </p>
        </div>
        <div className="space-y-4">
          <Accordion className="" type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="border p-4">
                Choose product size
              </AccordionTrigger>
              <AccordionContent className="w-full bg-transparent rounded h-40 flex items-center justify-center overflow-scroll">
                {" "}
                Coming Soon{" "}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion className="" type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="border p-4">
                Shipping, Exchanges & Returns
              </AccordionTrigger>
              <AccordionContent className="w-full bg-transparent rounded h-40 flex items-center justify-center overflow-scroll">
                {" "}
                Coming Soon{" "}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion className="" type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="border p-4">
                Check Product Origin
              </AccordionTrigger>
              <AccordionContent className="w-full bg-transparent rounded h-40 flex items-center justify-center overflow-scroll">
                {" "}
                Coming Soon{" "}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div>
          <p>You might be interested in</p>
          <div className="mt-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900 animate-pulse aspect-square rounded-3xl"></div>
              <div className="bg-zinc-900 animate-pulse aspect-square rounded-3xl"></div>
              <div className="bg-zinc-900 animate-pulse aspect-square rounded-3xl"></div>
              <div className="bg-zinc-900 animate-pulse aspect-square rounded-3xl"></div>
              <div className="bg-zinc-900 animate-pulse aspect-square rounded-3xl"></div>
              <div className="bg-zinc-900 animate-pulse aspect-square rounded-3xl"></div>
              <div className="bg-zinc-900 animate-pulse aspect-square rounded-3xl"></div>
              <div className="bg-zinc-900 animate-pulse aspect-square rounded-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
