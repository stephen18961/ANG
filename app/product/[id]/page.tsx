"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Package, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types"
import Image from "next/image"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      } else {
        console.error("Product not found")
      }
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading product...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
          <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700">
            Back to Catalog
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => router.push("/")}
          variant="ghost"
          className="mb-6 text-blue-400 hover:text-blue-300 hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Catalog
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-blue-400">{product.name}</h1>
              <div className="flex items-center space-x-4 text-gray-300">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-1" />
                  <span className="text-2xl font-bold text-green-400">${product.price}</span>
                </div>
                <div className="flex items-center">
                  <Package className="h-5 w-5 mr-1" />
                  <span className={`font-semibold ${product.stock > 0 ? "text-green-400" : "text-red-400"}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-3 text-blue-400">Description</h2>
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-3 text-blue-400">Product Details</h2>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>Product ID:</span>
                  <span className="font-mono text-blue-300">#{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Availability:</span>
                  <span className={product.stock > 0 ? "text-green-400" : "text-red-400"}>
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
