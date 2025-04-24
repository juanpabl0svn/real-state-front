"use client";

import { SearchableCombobox } from "@/components/ui/searchable-combobox";

interface CityComboboxProps {
  value: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
  cities: string[];
}

export function CityCombobox({
  value,
  onSelect,
  disabled = false,
  cities,
}: CityComboboxProps) {
  return (
    <SearchableCombobox
      options={cities}
      value={value}
      onSelect={onSelect}
      placeholder="Select a city..."
      emptyMessage="No cities found."
      searchPlaceholder="Search city..."
      disabled={disabled}
    />
  );
}