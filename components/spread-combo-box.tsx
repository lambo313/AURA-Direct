"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function SpreadCombobox({ onSelect }: { onSelect: (value: string) => void }) {
  const spreads = [
    {
      value: "4-Card",
      label: "4-Card",
    },
      {
      value: "1-Card",
      label: "1-Card",
    },
    // {
    //   value: "Celtic",
    //   label: "Celtic",
    // },
    // {
    //   value: "1-Card(w/clarifier)",
    //   label: "1-Card(w/clarifier)",
    // },
    // {
    //   value: "4-Card(w/clarifiers)",
    //   label: "4-Card(w/clarifiers)",
    // },
    // {
    //   value: "Celtic(w/clarifiers)",
    //   label: "Celtic(w/clarifiers)",
    // }
  ];

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? spreads.find((spread) => spread.value === value)?.label
            : "Choose spread..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search spread..." />
          <CommandEmpty>No spread found.</CommandEmpty>
          <CommandGroup>
            {spreads.map((spread) => (
              <CommandItem
              key={spread.value}
              value={spread.value}
              onSelect={() => {
                // Directly use topic.value instead of relying on a passed argument
                setValue(value === spread.value ? "" : spread.value);
                setOpen(false);
                onSelect(spread.value);
              }}
            >
            
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === spread.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {spread.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
