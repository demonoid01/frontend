import Link from "next/link";
import { Button } from "../ui/button";
import { BestSellerCarousel } from "./BestSellerCarousel";
import { categoryData } from "@/utils/categoryData";
import Image from "next/image";
const DesktopBestSellers = () => {
    return (
        <div className="sm:block hidden space-y-5">
            <div>

                <div className="grid sm:grid-cols-4 gap-5 gap-y-6 p-2">
                    {categoryData.slice(0, 4).map((items) => {
                        return (
                            <div key={items.id} className="rounded-xl">
                                <div className="w-full h-[365px] bg-orange-300 relative ">
                                    <Image
                                        src={items.imageUrl}
                                        fill={true}
                                        alt={items.title}
                                        className="mix-blend object-cover bg-green-200"
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
                <div className="flex justify-center px-4 py-4 items-center">
                    <Button className="font-semibold">DISCOVER MORE</Button>
                </div>
            </div>

            <div></div>
        </div>



    );
};

export default DesktopBestSellers;
