"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ProductModal from "@/components/product-modal"
import DeleteConfirmModal from "@/components/delete-confirm-modal"
import type { Product } from "@/types"
import { useAuth } from "@/contexts/auth-context"

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || !user.is_admin) {
      router.push("/admin/login")
      return
    }
    fetchProducts()
  }, [user, router])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsProductModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return

    try {
      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== productToDelete.id))
        setIsDeleteModalOpen(false)
        setProductToDelete(null)
      }
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const handleProductSaved = (savedProduct: Product) => {
    if (selectedProduct) {
      setProducts(products.map((p) => (p.id === savedProduct.id ? savedProduct : p)))
    } else {
      setProducts([...products, savedProduct])
    }
    setIsProductModalOpen(false)
    setSelectedProduct(null)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user || !user.is_admin) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-400">Admin Dashboard</h1>
            <p className="text-gray-300">Manage your hardware catalog</p>
          </div>
          <div className="flex space-x-4">
            <Button onClick={handleAddProduct} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-blue-400">Product Name</TableHead>
                <TableHead className="text-blue-400">Current Stock</TableHead>
                <TableHead className="text-blue-400">Price</TableHead>
                <TableHead className="text-blue-400">Last Updated</TableHead>
                <TableHead className="text-blue-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="border-gray-700 hover:bg-gray-750">
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${product.stock > 0 ? "text-green-400" : "text-red-400"}`}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-green-400 font-semibold">${product.price}</TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(product.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteProduct(product)}
                        className="text-red-400 hover:text-red-300 hover:bg-gray-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No products found. Add your first product to get started.</p>
          </div>
        )}
      </div>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
        onSave={handleProductSaved}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        productName={productToDelete?.name || ""}
      />
    </div>
  )
}
