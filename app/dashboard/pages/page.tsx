"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BlogEditor } from "@/components/blog-editor"
import { Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { PageEditor } from "@/components/page-editor"

const dummyPages = [
  { id: 1, title: "Home", url: "/", lastUpdated: "2023-06-01", content: "# Welcome to Our Website\n\nThis is the home page of our website...", isActive: true },
  { id: 2, title: "About Us", url: "/about", lastUpdated: "2023-05-15", content: "# About Us\n\nLearn more about our company and mission...", isActive: true },
  { id: 3, title: "Services", url: "/services", lastUpdated: "2023-05-20", content: "# Our Services\n\nExplore the range of services we offer...", isActive: false },
  { id: 4, title: "Contact", url: "/contact", lastUpdated: "2023-06-10", content: "# Contact Us\n\nGet in touch with our team...", isActive: true },
]

export default function PagesPage() {
  const [pages, setPages] = useState(dummyPages)
  const [selectedPage, setSelectedPage] = useState<typeof dummyPages[0] | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleSave = (updatedPage: typeof dummyPages[0]) => {
    if (selectedPage) {
      const updatedPages = pages.map(page => 
        page.id === selectedPage.id ? { ...updatedPage, id: page.id } : page
      )
      setPages(updatedPages)
    } else if (isCreating) {
      setPages([...pages, { ...updatedPage, id: pages.length + 1, isActive: true }])
    }
  }

  const handleCreateNew = () => {
    setIsCreating(true)
    setSelectedPage(null)
  }

  const handleEditPage = (page: typeof dummyPages[0]) => {
    setSelectedPage(page)
    setIsCreating(false)
  }

  const handleBack = () => {
    setSelectedPage(null)
    setIsCreating(false)
  }

  const handleDelete = (id: number) => {
    setPages(pages.filter(page => page.id !== id))
  }

  const handleToggleActive = (id: number) => {
    setPages(pages.map(page => 
      page.id === id ? { ...page, isActive: !page.isActive } : page
    ))
  }

  if (selectedPage || isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{isCreating ? "Create New Page" : "Edit Page"}</h1>
          <Button variant="outline" onClick={handleBack}>Back to Pages</Button>
        </div>
        <Card>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleSave({
                id: selectedPage?.id || 0,
                title: formData.get('title') as string,
                url: formData.get('url') as string,
                lastUpdated: new Date().toISOString().split('T')[0],
                content: formData.get('content') as string,
                isActive: selectedPage?.isActive ?? true,
              })
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={selectedPage?.title} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input id="url" name="url" defaultValue={selectedPage?.url} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <PageEditor 
                  initialContent={selectedPage?.content || ""} 
                  onSave={(page) => {
                    // Your save logic here
                  }} 
                />
                <Input id="content" name="content" type="hidden" defaultValue={selectedPage?.content} />
              </div>
              <Button type="submit">Save</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pages</h1>
        <Button onClick={handleCreateNew}>
          Create New Page
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Page Management</CardTitle>
          <CardDescription>Manage your website pages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {pages.map((page) => (
              <Card key={`page-${page.id}`} className={`${!page.isActive ? 'opacity-50' : ''}`}>
                <CardHeader>
                  <CardTitle className="text-lg">{page.title}</CardTitle>
                  <CardDescription>{page.url}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">Last updated: {page.lastUpdated}</Badge>
                    <div className="space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleToggleActive(page.id)}>
                        {page.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(page.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleEditPage(page)}>
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

