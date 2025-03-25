import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "./lib/auth"

export async function middleware(req: NextRequest) {
  const session = await auth()
  const pathname = req.nextUrl.pathname

  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ["/profile", "/properties"]

  // Rutas de autenticación (accesibles solo si NO está autenticado)
  const authRoutes = ["/login", "/register"]

  // Verificar si la ruta está protegida y el usuario no está autenticado
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  if (isProtectedRoute && !session) {
    const url = new URL("/login", req.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // Verificar si es una ruta de autenticación y el usuario ya está autenticado
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/register"],
}

