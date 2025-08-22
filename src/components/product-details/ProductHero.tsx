import Image from "next/image"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductHero() {
  return (
    <div className="lg:sticky lg:top-8">
      {/* Main Product Image with Navigation - Full Width */}
      <div className="relative">
        <div className="relative aspect-square  lg:rounded-t-2xl overflow-hidden">
          <Image
            src="/hero.png"
            alt="Dashboard interface devices"
            fill
            className="object-contain -p-2 lg:p-8"
          />

          {/* Navigation Arrows */}
         
        </div>

        {/* Product Info Immediately After Image - No Gap */}
        <div className="bg-black p-6 lg:rounded-b-2xl -mt-4 lg:-mt-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">DASHBOARD SYSTEM S15</h2>
          <div className="text-3xl lg:text-4xl font-bold text-white mb-4">₹ 10,000/-</div>
          <p className="text-gray-300 text-sm lg:text-base leading-relaxed">
            Experience next-level driving entertainment. The dashboard system comes with a vibrant 2K touchscreen,
            Android support, Bluetooth connectivity, and advanced interface features for modern vehicles.
          </p>

          {/* Star Rating */}
          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                />
              ))}
            </div>
            <span className="text-gray-400 text-sm">8 Reviews</span>
          </div>
        </div>
      </div>

      {/* Additional Product Images - Desktop Only */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4 lg:mt-6">
        <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg?height=200&width=200&text=Side+view"
            alt="Side view"
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg?height=200&width=200&text=Back+view"
            alt="Back view"
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg?height=200&width=200&text=Accessories"
            alt="Accessories"
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
} 