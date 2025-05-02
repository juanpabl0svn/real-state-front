import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth, handlers } from "./auth"

export const protectedRoutes = ["/settings", "/properties"]

export const authRoutes = ["/login", "/register"]

export const adminRoutes = ["/admin/*"]

const sessionRoutes = [
  ...protectedRoutes,
  ...adminRoutes,
]


function validatePath(paths: string[], pathname: string) {
  for (const path of paths) {
    const regex = new RegExp(`^${path.replace(/\*/g, ".*")}$`)
    if (regex.test(pathname)) {
      return true
    }
  }
  return false
}



export async function middleware(req: NextRequest) {
  const session = await auth()
  const pathname = req.nextUrl.pathname


  const isProtectedRoute = validatePath(sessionRoutes, pathname)
  if (isProtectedRoute && !session) {
    const url = new URL("/login", req.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  const isAdminRoute = validatePath(adminRoutes, pathname)
  if (isAdminRoute && session?.user.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url))
  } 

  const isAuthRoute = validatePath(authRoutes, pathname)
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}