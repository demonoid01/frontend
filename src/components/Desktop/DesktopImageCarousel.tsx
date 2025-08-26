"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
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
            <CarouselContent className="">
                {pic.map((item) => (
                    <CarouselItem key={item.path} className="sm:basis-1/3 py-2">

                        <Card className="border-none relative sm:w-[100%] sm:h-[70vh]">
                            <CardContent className="" >
                                <Image
                                    src={item.path}
                                    fill
                                    className="object-fill bg-black"
                                    alt={item.path}
                                />

                            </CardContent>
                        </Card>

                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}
