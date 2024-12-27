"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BlogEditor } from "@/components/blog-editor"
import { Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { slugify } from "@/lib/utils"

const dummyBlogs = [
  { id: 1, title: "Getting Started with Next.js", author: "John Doe", date: "2023-06-01", time: "14:30", category: "Web Development", tags: ["nextjs", "react", "javascript"], content: "# Getting Started with Next.js\n\nNext.js is a powerful React framework...", isActive: true },
  { id: 2, title: "The Power of React Hooks", author: "Jane Smith", date: "2023-06-05", time: "10:15", category: "React", tags: ["react", "hooks", "javascript"], content: "# The Power of React Hooks\n\nReact Hooks have revolutionized the way we write React components...", isActive: true },
  { id: 3, title: "CSS Grid Layout Mastery", author: "Bob Johnson", date: "2023-06-10", time: "09:45", category: "CSS", tags: ["css", "layout", "web-design"], content: "# CSS Grid Layout Mastery\n\nCSS Grid Layout provides a powerful system for creating complex web layouts...", isActive: false },
  { id: 4, title: "TypeScript Best Practices", author: "Alice Brown", date: "2023-06-15", time: "16:20", category: "TypeScript", tags: ["typescript", "javascript", "best-practices"], content: "# TypeScript Best Practices\n\nTypeScript adds static typing to JavaScript, improving developer productivity...", isActive: true },
]

const dummyAuthors = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Bob Johnson" },
  { id: 4, name: "Alice Brown" },
]

export default function BlogsPage() {
  const [blogs, setBlogs] = useState(dummyBlogs)
  const [selectedBlog, setSelectedBlog] = useState<typeof dummyBlogs[0] | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null)

  const handleSave = (blog: { 
    title: string
    content: string 
    category: string
    tags: string[]
    author: string
    id?: number
    date?: string
    time?: string
    isActive?: boolean
  }) => {
    if (selectedBlog) {
      // Updating existing blog
      const updatedBlogs = blogs.map(b => 
        b.id === selectedBlog.id ? {
          ...selectedBlog,
          ...blog,
          id: selectedBlog.id,  // Ensure we keep the existing ID
          date: selectedBlog.date,
          time: selectedBlog.time,
          isActive: selectedBlog.isActive
        } : b
      )
      setBlogs(updatedBlogs)
    } else {
      // Creating new blog
      const newBlog = {
        ...blog,
        id: blogs.length + 1,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        isActive: true
      }
      setBlogs([...blogs, newBlog])
    }
    setSelectedBlog(null)
  }

  const handleCreateNew = () => {
    setIsCreating(true)
    setSelectedBlog(null)
  }

  const handleEditBlog = (blog: typeof dummyBlogs[0]) => {
    setSelectedBlog(blog)
    setIsCreating(false)
  }

  const handleBack = () => {
    setSelectedBlog(null)
    setIsCreating(false)
  }

  const handleDelete = (id: number) => {
    setDeleteConfirmation(id)
  }

  const confirmDelete = () => {
    if (deleteConfirmation) {
      setBlogs(blogs.filter(blog => blog.id !== deleteConfirmation))
      setDeleteConfirmation(null)
    }
  }

  const handleToggleActive = (id: number) => {
    setBlogs(blogs.map(blog => 
      blog.id === id ? { ...blog, isActive: !blog.isActive } : blog
    ))
  }

  if (selectedBlog || isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{isCreating ? "Create New Blog" : "Edit Blog"}</h1>
          <Button variant="outline" onClick={handleBack}>Back to Blogs</Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <BlogEditor 
              initialContent={selectedBlog?.content || ""}
              initialTitle={selectedBlog?.title || ""}
              initialCategory={selectedBlog?.category || ""}
              initialTags={selectedBlog?.tags || []}
              initialAuthor={selectedBlog?.author || ""}
              authors={dummyAuthors}
              onSave={handleSave}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blogs</h1>
        <Button onClick={handleCreateNew}>
          Create New Blog
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Blog Posts</CardTitle>
          <CardDescription>Manage your blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {blogs.map((blog) => (
              <Card key={`blog-${blog.id}`} className={`${!blog.isActive ? 'opacity-50' : ''}`}>
                <CardHeader>
                  <CardTitle>{blog.title}</CardTitle>
                  <CardDescription>{blog.author} - {blog.date} {blog.time}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {blog.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge>{blog.category}</Badge>
                    <div className="space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleToggleActive(blog.id)}>
                        {blog.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(blog.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" onClick={() => handleEditBlog(blog)}>
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
      <AlertDialog open={deleteConfirmation !== null} onOpenChange={() => setDeleteConfirmation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this blog?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Please type "delete" to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

