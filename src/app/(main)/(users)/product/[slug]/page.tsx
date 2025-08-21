// import ProductPage from "@/components/ProductPage";
// import { PrismaClient } from "@prisma/client";
// import { notFound } from "next/navigation";

// const prisma = new PrismaClient();

// export const dynamic = 'force-dynamic';


// async function getProduct(slug: string) {
//   const product = await prisma.product.findUnique({
//     where: { slug },
//   });

//   if (!product) return null;
//   return { product };
// }


// export default async function SingleProductPage({
//   params,
// }: {
//   params: { slug: string };
// }) {
//   const { slug } = params;
//   const productData = await getProduct(slug);

//   if (!productData?.product) notFound();

//   const { product } = productData;

//   return <ProductPage product={product} />;
// }
