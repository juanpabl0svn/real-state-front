"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocations } from "@/hooks/use-locations";
import { NeighborhoodCombobox } from "../neighborhood-combobox";
import { CityCombobox } from "../city-combobox";

export function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [propertyType, setPropertyType] = useState(
    searchParams.get("type") || ""
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [currentCity, setCurrentCity] = useState(
    searchParams.get("currentCity") || ""
  );

  const [currentNeighborhood, setCurrentNeighborhood] = useState(
    searchParams.get("currentNeighborhood") || ""
  );


  const { cities, getNeighborhoods } = useLocations();

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams();

    if (propertyType && propertyType !== "all")
      params.set("propertyType", propertyType);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (currentCity && currentCity !== "any")
      params.set("currentCity", currentCity);
    if (currentNeighborhood && currentNeighborhood !== "any")
      params.set("currentNeighborhood", currentNeighborhood);

    router.push(`/?${params.toString()}`);
  };

  // Reset filters
  const resetFilters = () => {
    setPropertyType("");
    setMinPrice("");
    setMaxPrice("");
    setCurrentCity("");
    router.push("/");
  };

  const currentNeighborhoods = useMemo(
    () => getNeighborhoods(currentCity),
    [currentCity, getNeighborhoods]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Filters</CardTitle>
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
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>City</Label>
          <CityCombobox
            cities={cities}
            value={currentCity}
            onSelect={setCurrentCity}
          />
        </div>

        <div className="space-y-2">
          <Label>Neighborhood</Label>
          <NeighborhoodCombobox
            key={currentCity}
            neighborhoods={currentNeighborhoods}
            value={currentNeighborhood}
            onSelect={setCurrentNeighborhood}
            disabled={!currentCity}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={applyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
