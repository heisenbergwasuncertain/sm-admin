"use client"

import React, { createContext, useContext, useState } from 'react'

type Site = {
  label: string
  value: string
}

type SiteContextType = {
  sites: Site[]
  selectedSite: Site | null
  setSelectedSite: (site: Site) => void
  addSite: (site: Site) => void
  openSiteConfig: () => void
}

const SiteContext = createContext<SiteContextType | undefined>(undefined)

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [sites, setSites] = useState<Site[]>([
    { label: "Site 1", value: "site1" },
    { label: "Site 2", value: "site2" },
    { label: "Site 3", value: "site3" },
  ])
  const [selectedSite, setSelectedSite] = useState<Site | null>(sites[0])
  const [isSiteConfigOpen, setIsSiteConfigOpen] = useState(false)

  const addSite = (newSite: Site) => {
    setSites([...sites, newSite])
  }

  const openSiteConfig = () => {
    setIsSiteConfigOpen(true)
  }

  return (
    <SiteContext.Provider value={{ sites, selectedSite, setSelectedSite, addSite, openSiteConfig }}>
      {children}
      {isSiteConfigOpen && (
        <SiteConfigDialog onClose={() => setIsSiteConfigOpen(false)} onAddSite={addSite} />
      )}
    </SiteContext.Provider>
  )
}

export const useSiteContext = () => {
  const context = useContext(SiteContext)
  if (context === undefined) {
    throw new Error('useSiteContext must be used within a SiteProvider')
  }
  return context
}

function SiteConfigDialog({ onClose, onAddSite }: { onClose: () => void, onAddSite: (site: Site) => void }) {
  const [newSiteName, setNewSiteName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newSiteName) {
      onAddSite({ label: newSiteName, value: newSiteName.toLowerCase().replace(/\s+/g, '-') })
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Add New Site</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newSiteName}
            onChange={(e) => setNewSiteName(e.target.value)}
            placeholder="Enter site name"
            className="border p-2 mb-4 w-full"
          />
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Site</button>
          </div>
        </form>
      </div>
    </div>
  )
}

