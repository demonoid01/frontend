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

async function getCategory(id: number) {
    // const res = await fetch(`https://nomadautomobile.store/api/categories/${slug}`, {
    //   cache: "no-store",
    // });
    const res = await apiClient<OneCategory[]>(`http://147.93.107.197:3542/products/category/${id}`);
    // console.log('Category data:', res[0].status);

    if (res[0].status !== 1) {
        return null;
    }




    return res;
}


export default async function CategoryPage({ params }: { params: { id: string } }) {
    const { slug } = params;
    console.log('slug===', slug);

    const categoryData = await getCategory(slug);

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
            <h1>product page</h1>

        </div>


    );
}
