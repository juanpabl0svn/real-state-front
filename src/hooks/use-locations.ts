
import { useMemo } from "react";

interface LocationData {
  [city: string]: string[];
}

export function useLocations(locationData: LocationData) {
  const cities = useMemo(() => Object.keys(locationData), [locationData]);

  const getNeighborhoods = useMemo(() => {
    return (city: string) => city ? locationData[city] || [] : [];
  }, [locationData]);

  return {
    cities,
    getNeighborhoods,
  };
}