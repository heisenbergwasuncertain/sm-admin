"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ReactMarkdown from 'react-markdown'
import { AIChat } from "@/components/ai-chat"

interface ForumEditorProps {
  initialContent: string
  initialTitle?: string
  initialCategory?: string
  onSave: (topic: { 
    id?: number
    title: string
    content: string 
    category: string
    author: string
    replies: number
    isActive: boolean
  }) => void
}

export function ForumEditor({ initialContent, initialTitle = '', initialCategory = '', onSave }: ForumEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [title, setTitle] = useState(initialTitle)
  const [category, setCategory] = useState(initialCategory)
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    onSave({ 
      title, 
      content, 
      category,
      author: "Current User", // You might want to get this from your auth context
      replies: 0,
      isActive: true
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter topic title"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter topic category"
        />
      </div>
      {isEditing ? (
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[300px]"
        />
      ) : (
        <div className="prose max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
      <Button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Preview' : 'Edit'}
      </Button>
      {isEditing && <Button onClick={handleSave}>Save</Button>}
      <AIChat onUpdateContent={setContent} currentContent={content} />
    </div>
  )
} 