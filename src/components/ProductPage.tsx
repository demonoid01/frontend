// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Heart } from "lucide-react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import api from "@/lib/api";
// import Cookies from "js-cookie";
// import { useContextData } from "@/ContextData/ContextDatastore";
// import { useRouter } from "next/navigation";
// import Lightbox from "react-image-lightbox";
// import "react-image-lightbox/style.css";

// const ProductPage = ({ product }) => {
//   const [isInWishlist, setIsInWishlist] = useState(false);
//   const [isInCart, setIsInCart] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAddingToCart, setIsAddingToCart] = useState(false);
//   const [selectedVariant, setSelectedVariant] = useState(null);
//   const [isLightboxOpen, setIsLightboxOpen] = useState(false);
//   const [photoIndex, setPhotoIndex] = useState(0);
//   const { user, addToWishlist, removeFromWishlist, addToCart } =
//     useContextData();
//   const router = useRouter();
//   const variantRef = useRef(null);

//   // Normalize images to an array
//   const images =
//     typeof product.images === "string"
//       ? JSON.parse(product.images)
//       : product.images || [];

//   useEffect(() => {
//     const checkWishlistStatus = async () => {
//       try {
//         if (user) {
//           const response = await api.get(`/wishlist?productId=${product.id}`);
//           setIsInWishlist(response.data.inWishlist);
//         } else {
//           const cookieWishlist = Cookies.get("wishlist");
//           const items = cookieWishlist ? JSON.parse(cookieWishlist) : [];
//           setIsInWishlist(items.some((item) => item.productId === product.id));
//         }
//       } catch (error) {
//         console.error("Error checking wishlist status:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const checkCartStatus = async () => {
//       try {
//         if (user) {
//           const response = await api.get(`/cart?productId=${product.id}`);
//           setIsInCart(response.data.inCart);
//         } else {
//           const cookieCart = Cookies.get("cart");
//           const items = cookieCart ? JSON.parse(cookieCart) : [];
//           setIsInCart(items.some((item) => item.productId === product.id));
//         }
//       } catch (error) {
//         console.error("Error checking cart status:", error);
//       }
//     };

//     checkCartStatus();
//     checkWishlistStatus();
//   }, [product.id, user]);

//   const calculateDiscount = (basePrice, salePrice) => {
//     if (!salePrice) return null;
//     const discount = ((basePrice - salePrice) / basePrice) * 100;
//     return Math.round(discount);
//   };

//   const discountPercentage = calculateDiscount(
//     Number(product.basePrice),
//     product.salePrice ? Number(product.salePrice) : null
//   );

//   const handleWishlistClick = async () => {
//     if (isInWishlist) {
//       await removeFromWishlist(product.id);
//       setIsInWishlist(false);
//     } else {
//       await addToWishlist(product.id);
//       setIsInWishlist(true);
//     }
//   };

//   const handleAddToCart = async (variantId) => {
//     setIsAddingToCart(true);
//     try {
//       if (variantId) {
//         await addToCart(product.id, 1, variantId);
//       } else {
//         await addToCart(product.id, 1);
//       }
//       setIsInCart(true);
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//     } finally {
//       setIsAddingToCart(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col mt-20">
//       {/* Image Gallery with Lightbox */}
//       <div className="relative max-h-[60vh] overflow-x-scroll">
//         <div className="flex items-center justify-start gap-1">
//           {typeof product?.images !== "string"
//             ? product?.images?.map((items, ind) => (
//                 <div key={ind} className="w-full h-full">
//                   <div className="w-96 h-96 relative">
//                     <Image
//                       onClick={() => {
//                         setPhotoIndex(ind);
//                         setIsLightboxOpen(true);
//                       }}
//                       src={items}
//                       blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD"
//                       placeholder="blur"
//                       fill={true}
//                       alt={"Product Image"}
//                       className="object-contain bg-white p-4"
//                     />
//                   </div>
//                 </div>
//               ))
//             : JSON.parse(product.images).map((items, ind) => (
//                 <div key={ind} className="w-full h-full">
//                   <div className="w-96 h-96 relative">
//                     <Image
//                       src={items}
//                       blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD"
//                       placeholder="blur"
//                       fill={true}
//                       alt={"Product Image"}
//                       className="object-contain bg-white p-4"
//                     />
//                   </div>
//                 </div>
//               ))}
//         </div>
//       </div>
//       {isLightboxOpen && (
//         <Lightbox
//           mainSrc={images[photoIndex]}
//           nextSrc={images[(photoIndex + 1) % images.length]}
//           prevSrc={images[(photoIndex + images.length - 1) % images.length]}
//           onCloseRequest={() => setIsLightboxOpen(false)}
//           onMovePrevRequest={() =>
//             setPhotoIndex((photoIndex + images.length - 1) % images.length)
//           }
//           onMoveNextRequest={() =>
//             setPhotoIndex((photoIndex + 1) % images.length)
//           }
//         />
//       )}

//       {/* Product Info */}
//       <div className="sticky -top-20 bg-black text-white z-10 border-t-4 border-white/80">
//         <div className="p-4 space-y-2 relative">
//           {discountPercentage && (
//             <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
//               {discountPercentage}% OFF
//             </div>
//           )}
//           {product.isFeatured && (
//             <div className="absolute bottom-4 right-4 bg-yellow-600 text-white text-xs font-bold px-2 py-1 rounded">
//               Featured
//             </div>
//           )}
//           <p className="text-2xl font-light">{product?.name}</p>
//           <div className="text-sm space-y-2 text-white/80 px-1">
//             <div className="flex items-center gap-2">
//               <p className="text-xl font-bold">₹ {product?.basePrice}</p>
//               {product?.salePrice && (
//                 <p className="text-base line-through text-red-600">
//                   ₹ {product?.salePrice}
//                 </p>
//               )}
//             </div>
//             <p className="text-xs">MRP incl. of all taxes</p>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 px-4 space-y-8 pb-10">
//         {/* Main Add to Cart Button */}
//         <div className="flex items-center justify-between gap-8 pt-4">
//           <Button
//             className={`w-full ${isInCart ? "bg-blue-900 text-white" : ""}`}
//             onClick={() => {
//               if (product.variants?.length > 0) {
//                 variantRef.current.scrollIntoView({ behavior: "smooth" });
//               } else {
//                 isInCart ? router.push("/cart") : handleAddToCart(null);
//               }
//             }}
//             disabled={isAddingToCart}
//           >
//             {isAddingToCart
//               ? "ADDING..."
//               : isInCart
//               ? "Go to Cart"
//               : "ADD TO CART"}
//           </Button>
//           <Button
//             variant={"outline"}
//             onClick={handleWishlistClick}
//             className={`bg-black ${
//               isInWishlist ? "text-red-500" : "text-white"
//             }`}
//           >
//             <Heart fill={isInWishlist ? "currentColor" : "none"} />
//           </Button>
//         </div>

//         {/* Variant Selection */}
//         {product.variants?.length > 0 && (
//           <div ref={variantRef}>
//             <Accordion type="single" collapsible>
//               <AccordionItem value="item-1">
//                 <AccordionTrigger className="border p-4">
//                   Choose Product Variant
//                 </AccordionTrigger>
//                 <AccordionContent className="w-full bg-transparent rounded p-4">
//                   <label htmlFor="variant" className="block mb-2">
//                     Select a Variant:
//                   </label>
//                   <select
//                     id="variant"
//                     value={selectedVariant || ""}
//                     onChange={(e) => setSelectedVariant(e.target.value)}
//                     className="w-full p-2 border rounded text-black"
//                   >
//                     <option value="">-- Select Variant --</option>
//                     {product.variants.map((variant) => (
//                       <option key={variant.id} value={variant.id}>
//                         {variant.name} - ₹{variant.price}
//                       </option>
//                     ))}
//                   </select>
//                   {selectedVariant && (
//                     <Button
//                       className="mt-4 w-full"
//                       onClick={() => handleAddToCart(selectedVariant)}
//                       disabled={isAddingToCart}
//                     >
//                       {isAddingToCart ? "Adding..." : "Add to Cart"}
//                     </Button>
//                   )}
//                 </AccordionContent>
//               </AccordionItem>
//             </Accordion>
//           </div>
//         )}

//         {/* Other Sections */}
//         <div className="space-y-4 text-sm">
//           <p className="text-base">Product Description:</p>
//           <p
//             className="text-base"
//             dangerouslySetInnerHTML={{ __html: product?.description }}
//           ></p>
//         </div>
//         {/* Additional Accordions */}
//         {/* <Accordion type="single" collapsible>
//           <AccordionItem value="item-1">
//             <AccordionTrigger className="border p-4">
//               Shipping, Exchanges & Returns
//             </AccordionTrigger>
//             <AccordionContent className="w-full bg-transparent rounded h-40 flex items-center justify-center overflow-scroll">
//               Coming Soon
//             </AccordionContent>
//           </AccordionItem>
//         </Accordion> */}

//         <Accordion type="single" collapsible>
//           <AccordionItem value="item-1">
//             <AccordionTrigger className="border p-4">
//               Some Additional Details
//             </AccordionTrigger>
//             <AccordionContent className="w-full bg-transparent rounded h-40 flex items-center justify-center">
//               Coming Soon
//             </AccordionContent>
//           </AccordionItem>
//         </Accordion>

//         <p className="text-xl font-medium">You might be interested in</p>
//         <div className="mt-10">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-zinc-900 animate-pulse aspect-square rounded-3xl"></div>
//             <div className="bg-zinc-900 animate-pulse aspect-square rounded-3xl"></div>
//             <div className="bg-zinc-900 animate-pulse aspect-square rounded-3xl"></div>
//             <div className="bg-zinc-900 animate-pulse aspect-square rounded-3xl"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductPage;
