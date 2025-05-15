"use client";

import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("combobox");

  return (
    <SearchableCombobox
      options={cities}
      value={value}
      onSelect={onSelect}
      placeholder={t("city")}
      emptyMessage={t("no_city")}
      searchPlaceholder={t("search_city")}
      disabled={disabled}
    />
  );
}
