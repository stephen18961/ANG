import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import pool from "@/lib/db"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth"

// Mock data - in a real app, this would come from PostgreSQL
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

let nextId = 7

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC")
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function postHandler(request: AuthenticatedRequest) {
  try {
    if (!request.user?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const formData = await request.formData()
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = formData.get("price") as string
    const stock = formData.get("stock") as string
    const image = formData.get("image")

    if (!name || !description || !price || !stock || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let imageUrl = ""

    if (image instanceof File) {
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filename = `${Date.now()}-${image.name}`
      const path = join(process.cwd(), "public/uploads", filename)
      await writeFile(path, buffer)
      imageUrl = `/uploads/${filename}`
    } else {
      return NextResponse.json({ error: "Image is required" }, { status: 400 })
    }

    const query = `
      INSERT INTO products (name, description, price, stock, image, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `
    const values = [name, description, Number.parseFloat(price), Number.parseInt(stock), imageUrl, request.user.userId]
    const result = await pool.query(query, values)

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const POST = withAuth(postHandler)
