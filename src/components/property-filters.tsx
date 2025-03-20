"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PropertyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state from URL params
  const [propertyType, setPropertyType] = useState(searchParams.get("type") || "")
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")
  const [minBedrooms, setMinBedrooms] = useState(searchParams.get("minBedrooms") || "")
  const [status, setStatus] = useState(searchParams.get("status") || "available")

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams()

    if (propertyType && propertyType !== "all") params.set("type", propertyType)
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    if (minBedrooms && minBedrooms !== "any") params.set("minBedrooms", minBedrooms)
    if (status && status !== "all") params.set("status", status)

    router.push(`/?${params.toString()}`)
  }

  // Reset filters
  const resetFilters = () => {
    setPropertyType("")
    setMinPrice("")
    setMaxPrice("")
    setMinBedrooms("")
    setStatus("available")
    router.push("/")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="property-type">Property Type</Label>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger id="property-type">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="land">Land</SelectItem>
              <SelectItem value="office">Office</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Price Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            </div>
            <div>
              <Input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bedrooms">Minimum Bedrooms</Label>
          <Select value={minBedrooms} onValueChange={setMinBedrooms}>
            <SelectTrigger id="bedrooms">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <RadioGroup value={status} onValueChange={setStatus}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="available" id="available" />
              <Label htmlFor="available">Available</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="reserved" id="reserved" />
              <Label htmlFor="reserved">Reserved</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sold" id="sold" />
              <Label htmlFor="sold">Sold</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={applyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

