"use client";
import { signOut } from "next-auth/react";

export default function LogOut() {
  signOut({
    callbackUrl: "/",
  });
}
