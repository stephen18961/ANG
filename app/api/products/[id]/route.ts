import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import pool from "@/lib/db"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth"

// Mock data - same as in route.ts
const products = [
  {
    id: 1,
    name: "NVIDIA GeForce RTX 4090",
    description:
      "The ultimate graphics card for gaming and content creation. Features 24GB GDDR6X memory and cutting-edge Ada Lovelace architecture.",
    price: 1599.99,
    stock: 15,
    image: "/placeholder.svg?height=400&width=400",
    created_by: 1,
  },
  {
    id: 2,
    name: "AMD Ryzen 9 7950X",
    description:
      "High-performance 16-core, 32-thread processor built on 5nm technology. Perfect for gaming, streaming, and productivity.",
    price: 699.99,
    stock: 25,
    image: "/placeholder.svg?height=400&width=400",
    created_by: 1,
  },
  {
    id: 3,
    name: "Corsair Dominator Platinum RGB 32GB",
    description: "Premium DDR5-5600 memory kit with stunning RGB lighting and exceptional performance for enthusiasts.",
    price: 299.99,
    stock: 40,
    image: "/placeholder.svg?height=400&width=400",
    created_by: 1,
  },
  {
    id: 4,
    name: "Samsung 980 PRO 2TB NVMe SSD",
    description:
      "Ultra-fast PCIe 4.0 NVMe SSD with read speeds up to 7,000 MB/s. Perfect for gaming and professional workloads.",
    price: 199.99,
    stock: 30,
    image: "/placeholder.svg?height=400&width=400",
    created_by: 1,
  },
  {
    id: 5,
    name: "ASUS ROG Strix Z790-E Gaming",
    description: "Premium Intel Z790 motherboard with WiFi 6E, DDR5 support, and comprehensive connectivity options.",
    price: 449.99,
    stock: 20,
    image: "/placeholder.svg?height=400&width=400",
    created_by: 1,
  },
  {
    id: 6,
    name: "Corsair RM1000x 1000W PSU",
    description: "Fully modular 80 PLUS Gold certified power supply with zero RPM fan mode and premium components.",
    price: 179.99,
    stock: 35,
    image: "/placeholder.svg?height=400&width=400",
    created_by: 1,
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id])
    const product = result.rows[0]

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Get product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function putHandler(request: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    if (!request.user?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const id = Number.parseInt(params.id)
    const formData = await request.formData()
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = formData.get("price") as string
    const stock = formData.get("stock") as string
    const image = formData.get("image")

    let imageUrl: string | undefined

    if (image instanceof File) {
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filename = `${Date.now()}-${image.name}`
      const path = join(process.cwd(), "public/uploads", filename)
      await writeFile(path, buffer)
      imageUrl = `/uploads/${filename}`
    }

    const query = `
      UPDATE products
      SET name = $1, description = $2, price = $3, stock = $4, image = COALESCE($5, image)
      WHERE id = $6
      RETURNING *
    `
    const values = [name, description, Number.parseFloat(price), Number.parseInt(stock), imageUrl, id]
    const result = await pool.query(query, values)

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function deleteHandler(request: AuthenticatedRequest, { params }: { params: { id: string } }) {
  if (!request.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const id = Number.parseInt(params.id)
  const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id])

  if (result.rowCount === 0) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json({ message: "Product deleted successfully" })
}

export const PUT = withAuth(putHandler)
export const DELETE = withAuth(deleteHandler)
