"use client";

import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("combobox");

  return (
    <SearchableCombobox
      options={neighborhoods}
      value={value}
      onSelect={onSelect}
      placeholder={t("neighborhood")}
      emptyMessage={t("no_neighborhood")}
      searchPlaceholder={t("search_neighborhood")}
      disabled={disabled}
    />
  );
});
