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
import { useTranslations } from "next-intl";

export function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const t = useTranslations();

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
        <CardTitle className="text-2xl">{t("filter.filters")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="property-type">{t("property.property_type")}</Label>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger id="property-type">
              <SelectValue placeholder={t("filter.all")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filter.all")}</SelectItem>
              <SelectItem value="house">{t("property.house")}</SelectItem>
              <SelectItem value="apartment">
                {t("property.apartment")}
              </SelectItem>
              <SelectItem value="land">{t("property.land")}</SelectItem>
              <SelectItem value="office">{t("property.office")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("filter.price_range")}</Label>
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
          <Label>{t("filter.city")}</Label>
          <CityCombobox
            cities={cities}
            value={currentCity}
            onSelect={setCurrentCity}
          />
        </div>

        <div className="space-y-2">
          <Label>{t("filter.neighborhood")}</Label>
          <NeighborhoodCombobox
            key={currentCity}
            neighborhoods={currentNeighborhoods}
            value={currentNeighborhood}
            onSelect={setCurrentNeighborhood}
            disabled={!currentCity}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={applyFilters}>{t("filter.apply")}</Button>
          <Button variant="outline" onClick={resetFilters}>
            {t("filter.reset")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
