"use client"

import * as React from "react"
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSiteContext } from "@/components/site-provider"

type Site = {
  label: string
  value: string
}

type SiteSwitcherProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

export function SiteSwitcher({ className }: SiteSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const { sites, selectedSite, setSelectedSite, openSiteConfig } = useSiteContext()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a site"
          className={cn("w-[200px] justify-between", className)}
        >
          <Avatar className="mr-2 h-5 w-5">
            <AvatarImage
              src={`https://avatar.vercel.sh/${selectedSite?.value}.png`}
              alt={selectedSite?.label}
            />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          {selectedSite?.label}
          <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search site..." />
            <CommandEmpty>No site found.</CommandEmpty>
            <CommandGroup heading="Sites">
              {sites.map((site) => (
                <CommandItem
                  key={site.value}
                  onSelect={() => {
                    setSelectedSite(site)
                    setOpen(false)
                  }}
                  className="text-sm"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${site.value}.png`}
                      alt={site.label}
                      className="grayscale"
                    />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  {site.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedSite?.value === site.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  openSiteConfig()
                  setOpen(false)
                }}
              >
                <PlusCircledIcon className="mr-2 h-5 w-5" />
                Add New Site
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

