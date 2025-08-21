import Link from "next/link";
import { Button } from "../ui/button";
import { BestSellerCarousel } from "./BestSellerCarousel";
import { categoryData } from "@/utils/categoryData";
import Image from "next/image";
const HomeBestSellers = () => {
  return (
    // <div className="px-4 py-10">
    //   <div className="flex justify-between items-center">
    //     <p className="text-xl font-semibold">Our Best-sellers</p>
    //     <Link href={"/best-sellers"}>
    //       <Button>Discover more</Button>
    //     </Link>
    //   </div>
    //   <div>
    //     <BestSellerCarousel />
    //   </div>
    // </div>
    <div className="sm:hidden space-y-8">
      <div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 gap-y-6 p-2">
          {categoryData.map((items) => {
            return (
              <div key={items.id} className="rounded-xl">
                <div className="w-full h-60 relative ">
                  <Image
                    src={items.imageUrl}
                    fill={true}
                    alt={items.title}
                    className="mix-blend object-cover bg-black p-4"
                  />
                </div>
                <p className="px-1 w-full text-start font-light md:text-2xl">
                  {items.title}
                </p>
                <div className="flex gap-2">
                  <p className="px-1  text-start font-light md:text-xl">
                    ₹ 5,600
                  </p>
                  <Image
                    src="/Group 20.png"
                    alt={items.title}
                    width={100}
                    height={0}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center px-4 py-4 items-center">
          {/* <p className="font-semibold text-xl">Car Stereo</p> */}
          <Button className="font-semibold">DISCOVER MORE</Button>
        </div>
      </div>

      <div></div>
    </div>



  );
};

export default HomeBestSellers;
