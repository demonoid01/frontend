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

export function CategoryCarousel({ categories }) {
  const router = useRouter();
  // console.log(categories);
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-[27rem] md:max-w-full"
    >
      <CarouselContent>
        {categories?.map((item) => (
          <CarouselItem
            key={item.id}
            onClick={() => router.push(`/category/${item.slug}`)}
            className="basis-1/2 md:basis-1/6 cursor-pointer"
          >
            <div className="p-2">
              <Card className="border-none rounded-xl p-1">
                <CardContent className="aspect-square relative bg-black rounded-xl">
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
                <p className="text-black text-center uppercase bg-white rounded-b-xl py-2">
                  {item.name}
                </p>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselDots />
      {/* <div className="absolute -top-10 right-10">
        <Button>View more</Button>
      </div> */}
      {/* <div className="absolute -top-10 right-[60px]">
        <CarouselNext className="bg-black" />
      </div> */}
    </Carousel>
  );
}
