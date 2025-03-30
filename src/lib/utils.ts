import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64'

const secret = process.env.AUTH_SECRET as string

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function hashPassword(password: string): string {
  const hashDigest = sha256(password);
  const hmacDigest = Base64.stringify(hmacSHA512(hashDigest, secret));
  return hmacDigest;
}