"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface SearchableComboboxProps {
  options: string[];
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}

export function SearchableCombobox({
  options,
  value,
  onSelect,
  placeholder = "Select an option...",
  emptyMessage = "No results found.",
  searchPlaceholder = "Search...",
  disabled = false,
  className,
}: SearchableComboboxProps) {
  const [open, setOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);

  const handleSearch = (search: string) => {
    if (search === "") {
      setFilteredOptions(options);
    } else {
      setFilteredOptions(
        options.filter((option) =>
          option.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {value ? options.find((option) => option === value) : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={handleSearch}
          />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup>
            {filteredOptions.map((option) => (
              <CommandItem
                key={option}
                value={option}
                onSelect={() => {
                  onSelect(option);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option ? "opacity-100" : "opacity-0"
                  )}
                />
                {option}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}