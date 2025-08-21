"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselDots
} from "@/components/ui/carousel";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function DesktopCategory({ categories }) {
    const router = useRouter();
    console.log(categories);
    return (
        <Carousel
            opts={{
                align: "start",
            }}
            className="w-full max-w-[27rem] md:max-w-full "
        >
            <CarouselContent>
                {categories?.map((item) => (
                    <CarouselItem
                        key={item.id}
                        onClick={() => router.push(`/category/${item.slug}`)}
                        className="basis-1/2 sm:basis-1/5 cursor-pointer mb-6 "
                    >
                        <div className="p-2 h-[300px]">
                            <Card className="border-none h-full relative">
                                <CardContent className=" relative bg-black rounded-b-md h-[250px] ">
                                    <Image
                                        src={
                                            item?.imageUrl
                                                ? item.imageUrl
                                                : "https://icon-library.com/images/images-icon/images-icon-13.jpg"
                                        }
                                        fill={true}
                                        alt={item.name}
                                        className="object-contain h-full w-full rounded-xl"
                                    />
                                </CardContent>
                                <p className="text-black text-center uppercase bg-white rounded-b-md py-2">
                                    {item.name}
                                </p>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselDots />
            <div className="absolute -bottom- right-[60px]">
                <CarouselNext className="bg-black" />
                <CarouselPrevious className="bg-black" />
            </div>
        </Carousel>
    );
}
