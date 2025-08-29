"use client"
import { homeProductsData } from "@/utils/homeProductsData";
import { Button } from "../ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const HomeProducts = () => {
  const router = useRouter();
  return (
    <div className="sm:hidden space-y-8">
      <div>
        <div className="flex justify-between px-4 py-6 items-center">
          <div className="flex">
            <span><p className="font-normal text-lg">Car</p></span>
            <span><p className="font-semibold text-xl pl-1">Stereo</p></span>

          </div>
          <Button onClick={() => router.push("/category")} >View more</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 gap-y-6 p-2">
          {homeProductsData.car_stereo.map((items) => {
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
                {/* <p className="px-1 w-full text-start font-light md:text-2xl">
                  ₹ 5,600
                </p> */}
              </div>
            );
          })}
        </div>
      </div>
      {/* <div>
        <div className="flex justify-between px-4 py-6 items-center">
          <div className="flex">
            <span><p className="font-normal text-lg">Dash</p></span>
            <span><p className="font-semibold text-xl pl-1">Cam</p></span>
          </div>
          <Button>View more</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 gap-y-6 p-2">
          {homeProductsData.dash_cam.map((items) => {
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
      </div> */}
      <div></div>
    </div>
  );
};

export default HomeProducts;
