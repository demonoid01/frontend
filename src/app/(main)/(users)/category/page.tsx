import { Card, CardContent } from "@/components/ui/card";
// import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import React from "react";

// const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';


async function getCategories() {
  // const categories = await prisma.category.findMany();
  // const categories = await prisma.category.findMany();
  // return { categories };
}


export default async function categoryPage() {
  const categoriesData = await getCategories();

  if (!categoriesData?.categories) {
    notFound();
  }

  const { categories } = categoriesData;

  return (
    <div className="pt-40">
      <h1 className="text-2xl text-center px-4 font-semibold">
        Our Categories
      </h1>
      <hr className="my-6 opacity-10" />
      <div className="grid grid-cols-2 ">
        {categories.map((item) => {
          return (
            <Link
              href={`/category/${item.slug}`}
              key={item.id}
              // onClick={() => router.push(`/category/${item.slug}`)}
              className="basis-1/2 md:basis-1/6 py-4 cursor-pointer"
            >
              <div className="p-2">
                <Card className="border-none">
                  <CardContent className="aspect-square relative bg-[#111]">
                    <Image
                      src={
                        item?.imageUrl
                          ? item.imageUrl
                          : "https://icon-library.com/images/images-icon/images-icon-13.jpg"
                      }
                      fill={true}
                      alt={item.name}
                      className="w-auto bg-gray-100 object-contain rounded-xl p-2"
                    />
                  </CardContent>
                  <p className="text-white text-center bg-[#111] pt-2">
                    {item.name}
                  </p>
                </Card>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
