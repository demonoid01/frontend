
import ProductHero from "@/components/product-details/ProductHero"
import ProductDetails from "@/components/product-details/ProductDetails"
import ProductComparison from "@/components/product-details/ProductComparison"

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">
          <ProductHero />
          <ProductDetails />
        </div>

        <ProductComparison />
      </div>
    </div>
  )
}
