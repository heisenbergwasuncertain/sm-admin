"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react'
import { DashboardNav } from "@/components/dashboard-nav"
import { dashboardConfig } from "@/config/dashboard"
import { SiteSwitcher } from "@/components/site-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">Navigation</h2>
              <DashboardNav items={dashboardConfig.sidebarNav} />
            </div>
          </div>
          <div className="border-t">
            <div className="px-3 py-4">
              <div className="flex items-center justify-between gap-2">
                <SiteSwitcher className="flex-1" />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

