"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PropertyForm } from "@/components/property-form"
import { createProperty } from "@/lib/data"
import type { Property } from "@/lib/types"

export default function CreatePropertyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: Partial<Property>) => {
    setIsSubmitting(true)
    try {
      // In a real app, this would be an API call
      await createProperty(data)
      router.push("/admin/properties")
    } catch (error) {
      console.error("Failed to create property:", error)
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/admin/properties" className="flex items-center text-primary mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to properties
      </Link>

      <h1 className="text-3xl font-bold mb-8">Create New Property</h1>

      <PropertyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  )
}

