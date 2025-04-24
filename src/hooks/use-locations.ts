
import { useMemo } from "react";
import {locationData} from "@/lib/locations-data"

export function useLocations() {
  const cities = useMemo(() => Object.keys(locationData), [locationData]);

  const getNeighborhoods = useMemo(() => {
    return (city: string) => city ? locationData[city] || [] : [];
  }, [locationData]);

  return {
    cities,
    getNeighborhoods,
  };
}