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



    // <div className="min-h-[80vh] pt-32 container bg-slate-200 mx-auto px-4 pb-20">
    //   <h1 className="uppercase text-3xl font-semibold">{productName}</h1>
    //   <p className="text-gray-300 mt-2">{productDiscription}</p>
    //   <hr className="my-6" />
    //   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    //     {categoryData.map((product) => {
    //       const discountPercentage = calculateDiscount(
    //         Number(product.basePrice),
    //         product.salePrice ? Number(product.salePrice) : null
    //       );

    //       return (
    //         <Link href={`/product/${product.slug}`} key={product.id}>
    //           <div className="product-card bg-black rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
    //             <div className="relative h-64 w-full overflow-hidden">
    //               {product.images !== null ? (
    //                 <Image
    //                   src={
    //                     product?.images
    //                       ? typeof product.images === "string"
    //                         ? JSON.parse(product.images)[0]
    //                         : product.images[0]
    //                       : "https://icon-library.com/images/images-icon/images-icon-13.jpg"
    //                   }
    //                   alt={product.name}
    //                   fill
    //                   className="object-cover hover:scale-105 transition-transform duration-300"
    //                 />
    //               ) : (
    //                 <div className="bg-white/20 w-full h-full flex justify-center items-center">
    //                   <svg
    //                     xmlns="http://www.w3.org/2000/svg"
    //                     fill="none"
    //                     viewBox="0 0 24 24"
    //                     strokeWidth={1.5}
    //                     stroke="currentColor"
    //                     className="size-20"
    //                   >
    //                     <path
    //                       strokeLinecap="round"
    //                       strokeLinejoin="round"
    //                       d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
    //                     />
    //                   </svg>
    //                 </div>
    //               )}

    //               {discountPercentage && (
    //                 <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
    //                   {discountPercentage}% OFF
    //                 </div>
    //               )}

    //               {product.isFeatured && (
    //                 <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
    //                   Featured
    //                 </div>
    //               )}
    //             </div>

    //             <div className="p-4">
    //               <h2 className="text-lg font-semibold text-gray-100 line-clamp-1">
    //                 {product.name}
    //               </h2>
    //               <p className="text-sm text-gray-300 line-clamp-2 mt-1"
    //                 dangerouslySetInnerHTML={{ __html: product?.description }}
    //               >
    //               </p>

    //               <div className="mt-3 flex items-center">
    //                 {product.salePrice ? (
    //                   <>
    //                     <span className="text-xl font-bold text-gray-200">
    //                       ₹{Number(product.salePrice).toLocaleString("en-IN")}
    //                     </span>
    //                     <span className="ml-2 text-sm text-gray-500 line-through">
    //                       ₹{Number(product.basePrice).toLocaleString("en-IN")}
    //                     </span>
    //                   </>
    //                 ) : (
    //                   <span className="text-xl font-bold text-gray-700">
    //                     ₹{Number(product.basePrice).toLocaleString("en-IN")}
    //                   </span>
    //                 )}
    //               </div>

    //               <div className="mt-3 flex justify-between items-center">
    //                 <div className="text-sm text-gray-600">
    //                   {product.stockQuantity > 0 ? (
    //                     product.stockQuantity < 5 ? (
    //                       <span className="text-orange-500">
    //                         Only {product.stockQuantity} left
    //                       </span>
    //                     ) : (
    //                       <span className="text-green-500">In Stock</span>
    //                     )
    //                   ) : (
    //                     <span className="text-red-500">Out of Stock</span>
    //                   )}
    //                 </div>

    //                 <div className="text-sm text-gray-400">
    //                   SKU: {product.sku}
    //                 </div>
    //               </div>

    //               <button className="mt-4 w-full bg-white text-black py-2 rounded-md transition-colors duration-300">
    //                 View Details
    //               </button>
    //             </div>
    //           </div>
    //         </Link>
    //       );
    //     })}
    //   </div>

    //   {categoryData.length === 0 && (
    //     <div className="text-center py-12">
    //       <p className="text-xl text-gray-500">
    //         No products found in this category.
    //       </p>
    //     </div>
    //   )}
    // </div>
  );
}
