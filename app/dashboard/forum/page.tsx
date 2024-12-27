"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ForumEditor } from "@/components/forum-editor"
import { Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { slugify } from "@/lib/utils"

const dummyForumTopics = [
  { id: 1, title: "How to optimize React performance?", author: "John Doe", replies: 15, category: "React", content: "# How to optimize React performance?\n\nI've been working on a large React application and I'm noticing some performance issues. What are some best practices for optimizing React performance?", isActive: true },
  { id: 2, title: "Best practices for CSS-in-JS", author: "Jane Smith", replies: 8, category: "CSS", content: "# Best practices for CSS-in-JS\n\nI'm considering using a CSS-in-JS solution for my next project. What are some best practices and things to watch out for?", isActive: true },
  { id: 3, title: "Debugging techniques in Next.js", author: "Bob Johnson", replies: 12, category: "Next.js", content: "# Debugging techniques in Next.js\n\nI'm new to Next.js and I'm struggling with debugging. What are some effective techniques for debugging Next.js applications?", isActive: false },
  { id: 4, title: "State management: Redux vs Context API", author: "Alice Brown", replies: 20, category: "React", content: "# State management: Redux vs Context API\n\nI'm trying to decide between using Redux and the Context API for state management in my React app. What are the pros and cons of each approach?", isActive: true },
]

export default function ForumPage() {
  const [topics, setTopics] = useState(dummyForumTopics)
  const [selectedTopic, setSelectedTopic] = useState<typeof dummyForumTopics[0] | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null)

  const handleSave = (topic: { 
    id?: number
    title: string
    content: string 
    category: string
    author: string
    replies: number
    isActive: boolean
  }) => {
    if (selectedTopic) {
      // Updating existing topic
      const updatedTopics = topics.map(t => 
        t.id === selectedTopic.id ? { ...topic, id: selectedTopic.id } : t
      )
      setTopics(updatedTopics)
    } else {
      // Creating new topic
      const newTopic = {
        ...topic,
        id: topics.length + 1,
        replies: 0,
        isActive: true
      }
      setTopics([...topics, newTopic])
    }
    setSelectedTopic(null)
    setIsCreating(false)
  }

  const handleCreateNew = () => {
    setIsCreating(true)
    setSelectedTopic(null)
  }

  const handleEditTopic = (topic: typeof dummyForumTopics[0]) => {
    setSelectedTopic(topic)
    setIsCreating(false)
  }

  const handleBack = () => {
    setSelectedTopic(null)
    setIsCreating(false)
  }

  const handleDelete = (id: number) => {
    setDeleteConfirmation(id)
  }

  const confirmDelete = () => {
    if (deleteConfirmation) {
      setTopics(topics.filter(topic => topic.id !== deleteConfirmation))
      setDeleteConfirmation(null)
    }
  }

  const handleToggleActive = (id: number) => {
    setTopics(topics.map(topic => 
      topic.id === id ? { ...topic, isActive: !topic.isActive } : topic
    ))
  }

  const extractMainTitle = (content: string) => {
    const match = content.match(/^#\s(.+)$/m)
    return match ? match[1] : ''
  }

  if (selectedTopic || isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{isCreating ? "Create New Topic" : "Edit Topic"}</h1>
          <Button variant="outline" onClick={handleBack}>Back to Forum</Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <ForumEditor 
              initialContent={selectedTopic?.content || ""} 
              initialTitle={selectedTopic?.title || ""}
              initialCategory={selectedTopic?.category || ""}
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
        <h1 className="text-3xl font-bold">Forum</h1>
        <Button onClick={handleCreateNew}>
          Create New Topic
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Forum Topics</CardTitle>
          <CardDescription>Manage your forum discussions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {topics.map((topic) => (
              <Card key={`topic-${topic.id}`} className={`${!topic.isActive ? 'opacity-50' : ''}`}>
                <CardHeader>
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                  <CardDescription>Started by {topic.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge>{topic.category}</Badge>
                    <p className="text-sm text-muted-foreground">{topic.replies} replies</p>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleToggleActive(topic.id)}>
                      {topic.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(topic.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={() => handleEditTopic(topic)}>
                      Edit
                    </Button>
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
            <AlertDialogTitle>Are you sure you want to delete this topic?</AlertDialogTitle>
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

