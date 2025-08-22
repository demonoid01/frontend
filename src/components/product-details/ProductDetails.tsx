"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCountdown } from "@/hooks/use-countdown"
import { useTextCountdown } from "@/hooks/use-text-countdown"
import AOS from 'aos'

export default function ProductDetails() {
  const [showSpecifications, setShowSpecifications] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const toggleSpecifications = () => {
    setShowSpecifications(!showSpecifications);
  };

  // Countdown hooks for animated numbers
  const ramRomCountdown = useCountdown(4, { duration: 600, delay: 200 });
  const androidCountdown = useCountdown(10, { duration: 700, delay: 400 });
  const screenCountdown = useCountdown(11.5, { duration: 800, delay: 600 });

  // Text countdown hooks for specification values
  const modelCountdown = useTextCountdown("NICER 2K S15", { duration: 800, delay: 100 });
  const ramRomTextCountdown = useTextCountdown("4 + 64G / 6 + 128G / Other", { duration: 800, delay: 200 });
  const coreCountdown = useTextCountdown("8 Core / 10 Core", { duration: 800, delay: 300 });
  const amplifieCountdown = useTextCountdown("Depending On The Board Configuration", { duration: 800, delay: 400 });
  const radioCountdown = useTextCountdown("Depending On The Board Configuration", { duration: 800, delay: 500 });
  const screenSizeCountdown = useTextCountdown("11.5 inch", { duration: 800, delay: 600 });
  const resolutionCountdown = useTextCountdown("2000 x 1200 dpi", { duration: 800, delay: 700 });
  const screenCraftCountdown = useTextCountdown("QLED + In-Cell", { duration: 800, delay: 800 });
  const androidVersionCountdown = useTextCountdown("10.0 ~ 15.0", { duration: 800, delay: 900 });
  const carplayCountdown = useTextCountdown("Wireless", { duration: 800, delay: 1000 });
  const videoFormatsCountdown = useTextCountdown("MP4 / 3GP / AVI / DVIX / FLV / MKV / MPG / 4K", { duration: 800, delay: 1100 });
  const inputPowerCountdown = useTextCountdown("DC12V", { duration: 800, delay: 1200 });

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
  }, []);

  const slides = [
    {
      id: 1,
      title: "Music Player Interface",
      description: "Premium audio experience with integrated controls",
      image: "/curser.png"
    },
    {
      id: 2,
      title: "Dashboard Integration",
      description: "Seamless integration with car dashboard",
      image: "/about.png"
    },
    {
      id: 3,
      title: "Volume Control",
      description: "Intuitive volume knob with blue illumination",
      image: "/hero.png"
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }
  return (
    <div className="py-6 lg:py-0 space-y-8">
      {/* Check Compatibility Section */}
      <div className="bg-gray-200 text-black p-4 rounded-lg mx-2 lg:mx-0" data-aos="fade-up" data-aos-delay="100">
        <h3 className="text-lg font-semibold mb-4" data-aos="fade-right" data-aos-delay="200">Check Compatibility</h3>
        <div className="flex gap-3" data-aos="fade-up" data-aos-delay="300">
          <Select>
            <SelectTrigger className="flex-1 bg-white">
              <SelectValue placeholder="Type....." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="smartphone">BMW</SelectItem>
              <SelectItem value="tablet">Porsche</SelectItem>
              <SelectItem value="laptop">ASTON MARTIN</SelectItem>
              <SelectItem value="desktop">BENTLEY</SelectItem>
              <SelectItem value="gaming-console">AUDI</SelectItem>
              <SelectItem value="smart-tv">MERCEDES BENZ</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gray-800 text-white hover:bg-gray-700 px-6">CHECK</Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-2 lg:px-0 space-y-4" data-aos="fade-up" data-aos-delay="400">
        <Button className="w-full bg-white text-black hover:bg-gray-100 py-4 text-lg font-medium lg:text-xl" data-aos="zoom-in" data-aos-delay="500">
          ADD TO CART
        </Button>
        <Button className="w-full bg-black text-white border border-blue-500 hover:bg-gray-900 py-4 text-lg font-medium lg:text-xl" data-aos="zoom-in" data-aos-delay="600">
          BUY NOW
        </Button>
      </div>

      {/* Product Display Image - After Buy Now Button */}
      <div className="px-2 lg:px-0 py-6" data-aos="fade-up" data-aos-delay="700">
        <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden" data-aos="zoom-in" data-aos-delay="800">
          <Image
            src="/desc.png"
            alt="Device with colorful 2K display"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Specifications - Exact Same Style as Image */}
      <div className="bg-black p-6 lg:p-8 space-y-8">
        {/* RAM & ROM */}
        <div className="text-center space-y-2">
          <div className="text-sm lg:text-base text-white font-medium tracking-wider">RAM & ROM</div>
          <div className="text-4xl lg:text-5xl text-white font-bold">
            <span className={ramRomCountdown.isAnimating ? 'text-blue-400' : 'text-white'}>
              {ramRomCountdown.displayValue}+64 GB
            </span>
          </div>
        </div>

        {/* Android Version */}
        <div className="text-center space-y-2">
          <div className="text-sm lg:text-base text-white font-medium tracking-wider">ANDROID VERSION</div>
          <div className="text-4xl lg:text-5xl text-white font-bold">
            <span className={androidCountdown.isAnimating ? 'text-blue-400' : 'text-white'}>
              {androidCountdown.displayValue}.0 - 15.0
            </span>
          </div>
        </div>

        {/* Screen Size */}
        <div className="text-center space-y-2">
          <div className="text-sm lg:text-base text-white font-medium tracking-wider">SCREEN SIZE</div>
          <div className="text-4xl lg:text-5xl text-white font-bold">
            <span className={screenCountdown.isAnimating ? 'text-blue-400' : 'text-white'}>
              {screenCountdown.displayValue} INCH
            </span>
          </div>
        </div>

        {/* CarPlay & Android Auto */}
        <div className="text-center space-y-2">
          <div className="text-sm lg:text-base text-white font-medium tracking-wider">CARPLAY & ANDROID AUTO</div>
          <div className="text-4xl lg:text-5xl text-white font-bold">WIRELESS</div>
        </div>

        {/* View All Specification Button */}
        <div className="text-center pt-6">
          <button 
            onClick={toggleSpecifications}
            className="border border-white text-white px-8 py-4 text-lg lg:text-xl font-medium tracking-wider hover:bg-white hover:text-black transition-colors"
          >
            VIEW ALL SPECIFICATION
          </button>
        </div>
      </div>

      {/* Specifications Table - Slide Down Animation */}
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showSpecifications ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white text-black rounded-lg p-6 mt-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">💬</span>
            </div>
            <h3 className="text-lg font-bold">Specification</h3>
          </div>
          
                                           <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium">Model:</span>
                <span className={modelCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                  {modelCountdown.displayValue}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium">RAM & ROM:</span>
                <span className={ramRomTextCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                  {ramRomTextCountdown.displayValue}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium">CORE:</span>
                <span className={coreCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                  {coreCountdown.displayValue}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium">Amplifie IC:</span>
                <span className={amplifieCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                  {amplifieCountdown.displayValue}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium">Radio IC:</span>
                <span className={radioCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                  {radioCountdown.displayValue}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium">Screen Size:</span>
                <span className={screenSizeCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                  {screenSizeCountdown.displayValue}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium">Resolution:</span>
                <span className={resolutionCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                  {resolutionCountdown.displayValue}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium">Screen Craft:</span>
                <span className={screenCraftCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                  {screenCraftCountdown.displayValue}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium">Android Version:</span>
                <span className={androidVersionCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                  {androidVersionCountdown.displayValue}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium">CarPlay / Android Auto:</span>
                <span className={carplayCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                  {carplayCountdown.displayValue}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium">Video Formats:</span>
                <span className={videoFormatsCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                  {videoFormatsCountdown.displayValue}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Input Power:</span>
                <span className={inputPowerCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                  {inputPowerCountdown.displayValue}
                </span>
              </div>
            </div>
        </div>
      </div>

      {/* New Product Feature Section - After VIEW ALL SPECIFICATION */}
      <div className="px-2 lg:px-0 mt-8">
        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6">Nicer 2K</h3>

        {/* Product Feature Image - Using the actual reference image */}
        <div className="relative aspect-[4/4] bg-black rounded-lg overflow-hidden mb-6">
          <Image
            src="/about.png"
            alt="Dashboard with single knob control and smartphone interface"
            fill
            className="object-cover"
          />
        </div>

        {/* Feature Title */}
        <h4 className="text-lg lg:text-xl font-semibold text-white mb-6">
          Single Knob Quick Control
          <br />
          Damping Feel & Driving Fun
        </h4>

        {/* Feature List */}
        <div className="space-y-3 text-sm lg:text-base text-gray-300">
          <div className="flex items-start gap-2">
            <span className="text-white">•</span>
            <span>Exquisite Single Knob Easy To Use</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-white">•</span>
            <span>Damper All Metal Body</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-white">•</span>
            <span>Advanced Texture</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-white">•</span>
            <span>2K High Smart Control</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-white">•</span>
            <span>2K High Aesthetic Value Who Owned It & Who Looks Good</span>
          </div>
        </div>
      </div>

      {/* Photo Slider Section */}
      <div className="px-2 lg:px-0 mt-10">
        <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
          {/* Current Slide */}
          <div className="absolute inset-0">
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Slide Indicators - Below the image */}
        <div className="flex justify-center gap-3 mt-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-14 bg-white' 
                  : index === (currentSlide + 1) % slides.length || index === (currentSlide - 1 + slides.length) % slides.length
                  ? 'w-4 bg-white/70'
                  : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 