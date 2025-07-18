import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export interface AuthenticatedRequest extends NextRequest {
  user?: { userId: number; isAdmin: boolean }
}

export function withAuth(
  handler: (request: AuthenticatedRequest, ...args: any[]) => Promise<NextResponse>
) {
  return async (request: AuthenticatedRequest, ...args: any[]) => {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
      request.user = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; isAdmin: boolean }
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 })
    }

    return handler(request, ...args)
  }
} 