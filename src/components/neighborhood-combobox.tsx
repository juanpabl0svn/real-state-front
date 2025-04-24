"use client";

import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { memo } from "react";

interface NeighborhoodComboboxProps {
  value: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
  neighborhoods: string[];
}

export const NeighborhoodCombobox = memo(function NeighborhoodCombobox({
  value,
  onSelect,
  disabled = false,
  neighborhoods,
}: NeighborhoodComboboxProps) {
  return (
    <SearchableCombobox
      options={neighborhoods}
      value={value}
      onSelect={onSelect}
      placeholder="Select a neighborhood..."
      emptyMessage="No neighborhoods found."
      searchPlaceholder="Search neighborhood..."
      disabled={disabled}
    />
  );
});