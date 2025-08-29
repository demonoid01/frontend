import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { apiClient } from "@/utils/helper";
import { GoDotFill } from "react-icons/go";


export const dynamic = 'force-dynamic';


type OneCategory = {
    id: number;
    name: string;
    description: string;
    basePrice: string;
    salePrice: string;
    sku: string;
    slug: string;
    c_id: number;
    weight: {
        kg: number;
    };
    dimensions: {
        depth: number;
        width: number;
        height: number;
    };
    isstock: number;
    main_image: string;
    images: string[];
    card_img: string;
    status: number;
    isFeatured: number;
    createdAt: string;
    updatedAt: string;
    specifications: {
        data: {
            title: string;
            value: string;
        }[];
        image: string;
    }[];
    features: {
        image: string;
        details: string;
    }[];
    bestSeller: number;
};

async function getProduct(id: number) {

    const res = await apiClient<OneCategory[]>(`https://demonoid.in:3542/products/category/${id}`);
    // console.log('Category data:', res[0].status);

    if (res[0].status !== 1) {
        return null;
    }




    return res;
}


export default async function CategoryPage({ params }: { params: { id: string } }) {
    const { slug } = params;
    console.log('slug===', slug);

    const categoryData = await getProduct(slug);

    if (!categoryData) {
        notFound();
    }

    const [{ name: productName, description: productDiscription }] = categoryData;
    // console.log('categoryData====', category);


    const calculateDiscount = (basePrice: number, salePrice: number | null) => {
        if (!salePrice) return null;
        const discount = ((basePrice - salePrice) / basePrice) * 100;
        return Math.round(discount);
    };

    return (
        <div className="pt-20">
            <div className="relative w-full h-[60vh]">
                <Image
                    src="/Rectangle 70.png"
                    alt="Banner"
                    fill
                    className="object-fit"
                />
            </div>
            <div className="bg-white text-black flex justify-center items-center  py-2">
                <GoDotFill />
                <h1 className="uppercase text-xl font-semibold text-center mx-2">{productName}</h1>
                <GoDotFill />
            </div>


            <div className="min-h-[80vh] pt-32 container mx-auto px-4 pb-20">

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categoryData.map((product) => {



                        return (
                            <Link href={`/product/${product.slug}`} key={product.id}>
                                <div className="product-card rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                    {product?.card_img !== null ? (
                                        <div className="w-[297] h-[300px] relative">
                                            <Image
                                                src={"/CrPic1.png"}
                                                alt={product.name}
                                                fill
                                                className="object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ) : (

                                        <div key={product?.id} className="rounded-xl">
                                            <div className="w-[297] h-[300px] relative mb-2">
                                                <Image
                                                    src={product?.card_img ? typeof product.card_img === "string" ? product.card_img : product.card_img : "/Rectangle 70.png"}
                                                    // src="/Rectangle 70.png"
                                                    fill={true}
                                                    alt={product.name || "Product"}
                                                    // alt="Product Image "
                                                    className="mix-blend bg-[#1f1f1f] object-contain hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <p className="px-1 w-full text-start font-light sm:text-lg">
                                                {product.name}
                                            </p>
                                            <div className="flex gap-2">
                                                <p className="px-1  text-start font-light sm:text-sm">
                                                    {`₹ ${product.salePrice}`}
                                                </p>
                                                <Image
                                                    src="/Group 20.png"
                                                    alt="price banner"
                                                    width={93}
                                                    height={18}
                                                />
                                            </div>
                                        </div>

                                    )}


                                </div>

                            </Link>
                        );
                    })}
                </div>

                {categoryData.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-500">
                            No products found in this category.
                        </p>
                    </div>
                )}

            </div>

        </div >
    );
}
