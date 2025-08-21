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


export function ViewCategory({ categories }) {
    const router = useRouter();
    console.log(categories);
    return (
        <Carousel
            opts={{
                align: "start",
            }}
            className="flex w-full max-w-[27rem] md:max-w-full overflow-hidden"
        >

            <div className="w-full sm:w-1/3  relative pl-40 pr-5 ">

                <h3 className="uppercase text-black font-bold text-lg mb-5">Categories</h3>
                <p className="text-black  text-base  leading-none text-justify  ">Upgrade your ride with our premium range of car accessories  from dash cameras and speakers to doors,
                    stereos, cables, and lights. Every product is built for performance, style, and reliability, giving your
                    car the care it deserves.</p>
                <div className="absolute bottom-5 right-[55%]">

                    <CarouselNext className="bg-black" />
                    <CarouselPrevious className="bg-black" />

                </div>
            </div>

            <div className="w-full sm:w-2/3 ml-2">
                <CarouselContent className=" " >

                    {categories?.map((item) => (
                        <CarouselItem
                            key={item.id}
                            onClick={() => router.push(`/category/${item.id}`)}
                            className="basis-1/2 sm:basis-1/3 lg:basis-1/4 cursor-pointer"
                        >
                            <div className="">
                                <Card className="border-none">
                                    <CardContent className="aspect-square sm:h-[250px] sm:w-full  relative bg-black ">
                                        <Image
                                            src={
                                                item?.imageUrl
                                                    ? item.imageUrl
                                                    : "https://icon-library.com/images/images-icon/images-icon-13.jpg"
                                            }
                                            fill={true}
                                            alt={item.name}
                                            className="object-contain h-full w-full "
                                        />

                                    </CardContent>
                                    <p className="text-black font-semibold  uppercase bg-white  py-2">
                                        {item.name}
                                    </p>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}


                </CarouselContent>
                {/* <CarouselDots /> */}
            </div>

        </Carousel>
    );
}
