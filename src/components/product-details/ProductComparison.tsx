"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductComparison() {
  const [currentMobileSlide, setCurrentMobileSlide] = useState(0)

  const products = [
    {
      id: 1,
      name: "ARCOSIA",
      subtitle: "OUR MILESTONE IN SOUND",
      image: "/PRD.jpg",
      model: "DMH-ZF9350BT",
      price: "₹ 10,000/-",
      isNew: true,
      features: [
        "Premium Sound Quality",
        "Advanced Audio Technology",
        "Professional Grade",
        "High Performance",
        "Studio Quality"
      ]
    },
    {
      id: 2,
      name: "4K High Cost Performance Dash Cam",
      subtitle: "Professional Recording",
      image: "/PRD2.jpg",
      model: "DMH-ZF9350BT",
      price: "₹ 10,000/-",
      isNew: true,
      features: [
        "4K UHD Resolution",
        "Night Vision",
        "WDR Technology",
        "Parking Monitoring",
        "G-sensor"
      ]
    },
    {
      id: 3,
      name: "Premium Dashboard System",
      subtitle: "Advanced Integration",
      image: "/PRD.jpg",
      model: "DMH-ZF9350BT",
      price: "₹ 15,000/-",
      isNew: false,
      features: [
        "2K Display",
        "Wireless Connectivity",
        "Android Support",
        "Bluetooth Audio",
        "Touch Control"
      ]
    },
    {
      id: 4,
      name: "Smart Car Monitor",
      subtitle: "Intelligent Surveillance",
      image: "/PRD2.jpg",
      model: "DMH-ZF9350BT",
      price: "₹ 12,000/-",
      isNew: false,
      features: [
        "HD Recording",
        "Motion Detection",
        "Loop Recording",
        "Emergency Save",
        "GPS Tracking"
      ]
    }
  ]

  const nextSlide = () => {
    setCurrentMobileSlide((prev) => (prev + 1) % products.length)
  }

  const prevSlide = () => {
    setCurrentMobileSlide((prev) => (prev - 1 + products.length) % products.length)
  }

  return (
    <>
      <div className="px-4 lg:px-0 py-12">
        <div className="bg-black border border-gray-800 rounded-lg p-6 lg:p-8">
          <h3 className="text-xl lg:text-2xl font-bold mb-8 text-center text-white">Our Products</h3>

          {/* Desktop Product Cards Grid */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-black rounded-lg overflow-hidden">
                {/* Title */}
                <div className="p-3">
                  <h4 className="text-sm font-medium text-white">{product.name}</h4>
                </div>

                {/* Product Image Section */}
                <div className="relative aspect-[4/3] bg-black overflow-hidden">
                  {/* Background 4K Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[120px] font-bold text-gray-800/20">4K</span>
                  </div>
                  
                  {/* Product Image */}
                  <div className="relative z-10 h-full flex items-center justify-center p-8">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={180}
                      height={180}
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Price and Badge */}
                <div className="p-3 flex items-center justify-between">
                  <p className="text-base font-bold text-white">{product.model}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-white">{product.price}</p>
                    {product.isNew && (
                      <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded">
                        New Launch
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Product Slider */}
          <div className="lg:hidden">
            <div className="bg-black rounded-lg overflow-hidden">
              {/* Title */}
              <div className="p-3">
                <h4 className="text-sm font-medium text-white">{products[currentMobileSlide].name}</h4>
              </div>

              {/* Product Image Section */}
              <div className="relative aspect-[4/3] bg-black overflow-hidden">
                {/* Background 4K Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[120px] font-bold text-gray-800/20">4K</span>
                </div>
                
                {/* Product Image */}
                <div className="relative z-10 h-full flex items-center justify-center p-8">
                  <Image
                    src={products[currentMobileSlide].image}
                    alt={products[currentMobileSlide].name}
                    width={180}
                    height={180}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Price and Badge */}
              <div className="p-3 flex items-center justify-between">
                <p className="text-base font-bold text-white">{products[currentMobileSlide].model}</p>
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-white">{products[currentMobileSlide].price}</p>
                  {products[currentMobileSlide].isNew && (
                    <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded">
                      New Launch
                    </span>
                  )}
                </div>
              </div>
            </div>

            

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMobileSlide(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentMobileSlide 
                      ? 'w-14 bg-white' 
                      : index === (currentMobileSlide + 1) % products.length || index === (currentMobileSlide - 1 + products.length) % products.length
                      ? 'w-4 bg-white/70'
                      : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-4 py-6 text-center">
        <div className="text-lg font-bold mb-2 text-white">DEMONOID</div>
        <div className="flex justify-center space-x-6 text-gray-400">
          <span className="text-sm">About</span>
          <span className="text-sm">Contact</span>
          <span className="text-sm">Support</span>
        </div>
      </footer>
    </>
  )
} 