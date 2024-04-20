import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function TarotDeckCombobox2({ tarotDeck, onSelect }: { tarotDeck: { value: string; label: string; }[]; onSelect: (value: string) => void }) {
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
            ? tarotDeck.find((deck) => deck.value === value)?.label
            : "Select a card..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search deck..." />
          <CommandEmpty>No deck found.</CommandEmpty>
          <CommandGroup>
            {tarotDeck.map((deck) => (
              <CommandItem
                key={deck.value}
                value={deck.value}
                onSelect={() => {
                  setValue(value === deck.value ? "" : deck.value);
                  setOpen(false);
                  onSelect(deck.value);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === deck.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {deck.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}



export function TarotDeckCombobox({ tarotDeck, onSelect }: { tarotDeck: { value: string; label: string; }[]; onSelect: (value: string) => void }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("");
 
  return (
    <div className="flex items-center space-x-4">
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
        <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? tarotDeck.find((deck) => deck.value === value)?.label
              : "Select a card..."}
            <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="bottom" align="start">
          <Command>
            <CommandInput placeholder="Search deck..." />
            <CommandList>
              <CommandEmpty>No deck found</CommandEmpty>
              <CommandGroup>
                {tarotDeck.map((deck) => (
                  <CommandItem
                    key={deck.value}
                    value={deck.value}
                    onSelect={() => {
                      setValue(value === deck.value ? "" : deck.value);
                      setOpen(false);
                      onSelect(deck.value);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === deck.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {deck.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
