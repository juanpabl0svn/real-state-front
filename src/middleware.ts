import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "./auth"

export const protectedRoutes = ["/settings", "/properties"]

export const authRoutes = ["/login", "/register"]

export async function middleware(req: NextRequest) {
  const session = await auth()
  const pathname = req.nextUrl.pathname

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  if (isProtectedRoute && !session) {
    const url = new URL("/login", req.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
  
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}