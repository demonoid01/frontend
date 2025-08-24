"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

// Product data array
const products = [
  {
    id: 1,
    name: "4K High Cost Performance Dash Cam",
    image: "/CrPic1.png",
    price: "₹ 10,000/-",
    badge: "New Launch",
    alt: "4K Dash Cam"
  },
  {
    id: 2,
    name: "ETON ARCOSIA",
    image: "/CrPic2.png",
    price: "₹ 10,000/-",
    badge: "New Launch",
    alt: "ETON ARCOSIA Car Speaker"
  },
  {
    id: 3,
    name: "DMH-ZF9350BT",
    image: "/CrPic3.png",
    price: "₹ 10,000/-",
    badge: "New Launch",
    alt: "Car Stereo DMH-ZF9350BT"
  }
]

export default function ProductComparison() {
  return (
    <div className="bg-black min-h-screen ">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white p-2">Related Products / Accessories</h1>
        <Button className="bg-white text-black hover:bg-gray-600 px-6 py-2 rounded">
          VIEW ALL
        </Button>
      </div>

      {/* Product Grid - 2x2 on mobile, 3 cards per row on PC */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {products.map((product) => (
          <div key={product.id} className="bg-black rounded-lg overflow-hidden">
            <div className="relative">
              <Image
                src={product.image}
                alt={product.alt}
                width={400}
                height={300}
                className="w-full h-auto"
              />
            </div>
            <div className="p-4 bg-black">
              <div className="text-white font-semibold mb-2">{product.name}</div>
              <div className="flex justify-between test items-center">
                <span className="text-white text-sm font-semibold">{product.price}</span>
                <span className="text-white text-xs px-2 py-1 rounded" style={{ background: 'linear-gradient(90deg, #FF4040 19%, #262525 99%)' }}>
                  {product.badge}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 