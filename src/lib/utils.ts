import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Crypto from "crypto"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}


export function hashPassword(password: string) {
  const hash = Crypto.createHash("sha256")
  hash.update(password)
  return hash.digest("hex")
}