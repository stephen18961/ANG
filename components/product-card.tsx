"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import type { Product } from "@/types"
import Image from "next/image"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/product/${product.id}`)
  }

  return (
    <Card
      className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors cursor-pointer group"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden mb-4">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-green-400">${product.price}</span>
          <span className={`text-sm ${product.stock > 0 ? "text-green-400" : "text-red-400"}`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
