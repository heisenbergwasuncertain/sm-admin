"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardNav } from "@/components/dashboard-nav"
import { SiteHeader } from "@/components/site-header"
import { dashboardConfig } from "@/config/dashboard"
import { useAuth } from "@/components/auth-provider"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { SiteProvider } from "@/components/site-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) {
    return null // or a loading spinner
  }

  return (
    <SiteProvider>
      <div className="flex min-h-screen flex-col space-y-6">
        <SiteHeader />
        <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
          <aside className="hidden w-[200px] flex-col md:flex">
            <DashboardNav items={dashboardConfig.sidebarNav} />
          </aside>
          <main className="flex w-full flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </SiteProvider>
  )
}

