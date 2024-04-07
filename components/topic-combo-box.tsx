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

export function TopicsCombobox({ onSelect }: { onSelect: (value: string) => void }) {
  const topics = [
    {
      value: "General",
      label: "General",
    },
    {
      value: "Relationship",
      label: "Relationship",
    },
    {
      value: "Finances",
      label: "Finances",
    },
    {
      value: "Career",
      label: "Career",
    },
    {
      value: "Daily",
      label: "Daily",
    },
    {
      value: "Weekly",
      label: "Weekly",
    },
    {
      value: "Monthly",
      label: "Monthly",
    },
    {
      value: "Yearly",
      label: "Yearly",
    }
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
            ? topics.find((topic) => topic.value === value)?.label
            : "Select topic..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search topic..." />
          <CommandEmpty>No topic found.</CommandEmpty>
          <CommandGroup>
            {topics.map((topic) => (
              <CommandItem
              key={topic.value}
              value={topic.value}
              onSelect={() => {
                // Directly use topic.value instead of relying on a passed argument
                setValue(value === topic.value ? "" : topic.value);
                setOpen(false);
                onSelect(topic.value);
              }}
            >
            
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === topic.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {topic.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
