"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader } from "lucide-react"
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
import { fetchAirports, Airport } from "@/services/flight"

interface AirportSearchProps {
  onSelect: (airport: Airport | null) => void;
}

export default function AirportSearch({ onSelect }: AirportSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<Airport | null>(null)
  const [search, setSearch] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [airports, setAirports] = React.useState<Airport[]>([])

  React.useEffect(() => {
    if (search.length > 3) {
      setLoading(true)
      fetchAirports(search)
        .then((data) => setAirports(data))
        .finally(() => setLoading(false))
    } else {
      setAirports([])
    }
  }, [search])

  const handleSelect = (airport: Airport) => {
    setValue(airport)
    setOpen(false)
    onSelect(airport)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? value.detailedName
            : "Select airport..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Search airport..."
            value={search}
            onValueChange={setSearch}
          />
          {loading && <Loader className="m-2 h-4 w-4 animate-spin" />}
          <CommandEmpty>No airport found.</CommandEmpty>
          <CommandGroup>
            {airports.map((airport) => (
              <CommandItem
                key={airport.id}
                value={airport.detailedName}
                onSelect={() => handleSelect(airport)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value?.id === airport.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {airport.detailedName}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
