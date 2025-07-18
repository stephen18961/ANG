export interface User {
  id: number
  username: string
  email: string
  is_admin: boolean
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  image: string
  created_by: number
  created_at: string
  updated_at: string
}
