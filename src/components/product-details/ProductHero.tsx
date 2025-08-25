import Image from "next/image"
import { ChevronLeft, ChevronRight, Truck, FileText, Shield, Wrench } from "lucide-react"

export default function ProductHero() {
  return (
    <div className="lg:sticky lg:top-8">
      {/* Main Product Image with Navigation - Full Width */}
      <div className="relative">
        <div className="relative lg:max-w-2xl lg:mx-auto lg:rounded-t-2xl overflow-hidden bg-gray-200">
          {/* Try regular img tag first */}
          <img
            src="/hero.png"
            alt="Dashboard interface devices"
            className="w-full h-auto object-contain p-2 lg:p-8"
          />

          {/* Navigation Arrows */}
         
        </div>

        {/* Product Info - Only show on mobile */}
        <div className="lg:hidden bg-black p-6 lg:rounded-b-2xl -mt-4 lg:-mt-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">DASHBOARD SYSTEM S15</h2>
          <div className="text-3xl lg:text-4xl font-bold text-white mb-4">₹ 1,000/-</div>
          <p className="text-gray-300 text-sm lg:text-base leading-relaxed mb-4">
            Experience next-level driving entertainment. The dashboard system comes with a vibrant 2K touchscreen,
            Android support, Bluetooth connectivity, and advanced interface features for modern vehicles.
          </p>

          {/* Product Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <img src="/icons/badge.png" alt="Badge" className="w-6 h-6" />
              <span className="text-white text-sm">No Cost <span className="text-green-400 font-semibold">EMI</span></span>
            </div>
            <div className="flex items-center gap-2">
              <img src="/icons/badge.png" alt="Badge" className="w-6 h-6" />
              <span className="text-white text-sm">Home Installation</span>
            </div>
          </div>

          {/* Service Icons */}
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center mb-2">
                <img src="/icons/COD.png" alt="COD" className="w-8 h-8" />
              </div>
              <span className="text-white text-xs text-center">COD Unavailable</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center mb-2">
                <img src="/icons/gst.png" alt="GST" className="w-8 h-8" />
              </div>
              <span className="text-white text-xs text-center">GST Available</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center mb-2">
                <img src="/icons/warranty.png" alt="Warranty" className="w-8 h-8" />
              </div>
              <span className="text-white text-xs text-center">1 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center mb-2">
                <img src="/icons/home-install.png" alt="Home Installation" className="w-8 h-8" />
              </div>
              <span className="text-white text-xs text-center">HOME Installation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
