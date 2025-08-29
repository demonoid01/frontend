"use client"
import { Button } from "../ui/button";
import { homeProductsData } from "@/utils/homeProductsData";
import Image from "next/image";
import { useRouter } from "next/navigation";
const DesktopHomeProduct = () => {
    const router = useRouter();
    return (
        <div className="sm:block hidden my-20">
            <div>
                <div className="flex justify-between px-4 py-6 items-center">
                    <div className="flex">
                        <span><p className="font-normal text-lg">Car</p></span>
                        <span><p className="font-semibold text-xl pl-1">Stereo</p></span>

                    </div>
                    <Button onClick={() => router.push("/product")} >View more</Button>
                </div>

                <div className="grid sm:grid-cols-4 gap-5 gap-y-6 p-2">
                    {homeProductsData.car_stereo.slice(0, 4).map((items) => {
                        return (
                            <div key={items.id} className="rounded-xl">
                                <div className="w-full h-[365px] relative ">
                                    <Image
                                        src={items.imageUrl}
                                        fill={true}
                                        alt={items.title}
                                        className="mix-blend bg-[#1f1f1f] object-contain"
                                    />
                                </div>
                                <p className="px-1 w-full text-start font-light sm:text-lg">
                                    {items.title}
                                </p>
                                <div className="flex gap-2">
                                    <p className="px-1  text-start font-light sm:text-sm">
                                        ₹ 5,600
                                    </p>
                                    <Image
                                        src="/Group 20.png"
                                        alt={items.title}
                                        width={93}
                                        height={18}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div></div>
        </div>



    );
};

export default DesktopHomeProduct;
