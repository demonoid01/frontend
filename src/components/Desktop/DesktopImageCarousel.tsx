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

const pic = [
    { path: "/CrPic1.png" },
    { path: "/CrPic2.png" },
    { path: "/CrPic3.png" },
    { path: "/CrPic4.png" },
    { path: "/CrPic5.png" },

]

export function DesktopImageCarousel() {
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    );

    return (
        <Carousel
            plugins={[plugin.current]}
            className="sm:block hidden w-full max-w-md md:max-w-full my-10"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent className="w-[90%] bg-red-800">
                {pic.map((item) => (
                    <CarouselItem key={item.path} className="bg-red-400 basis-1/2 md:basis-1/6 py-2">
                        {/* <div className="">
                            <Card className="border-none bg-slate-300">
                                <CardContent className="relative w-[565px] h-[759px]  bg-red-700" >
                                    <Image
                                        src={item.path}
                                        fill
                                        alt={item.path}
                                    />

                                </CardContent>
                            </Card>
                        </div> */}
                    </CarouselItem>
                ))}
            </CarouselContent>

        </Carousel>
    );
}
