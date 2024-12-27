"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ReactMarkdown from 'react-markdown'
import { AIChat } from "@/components/ai-chat"
import { slugify } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from 'lucide-react'

interface BlogEditorProps {
  initialContent: string
  initialTitle: string
  initialCategory: string
  initialTags: string[]
  initialAuthor: string
  authors: { id: number; name: string }[]
  onSave: (blog: { 
    id?: number
    title: string
    content: string 
    category: string
    tags: string[]
    author: string
    date?: string
    time?: string
    isActive?: boolean
  }) => void
}

export function BlogEditor({ initialContent, initialTitle, initialCategory, initialTags, initialAuthor, authors, onSave }: BlogEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [title, setTitle] = useState(initialTitle)
  const [category, setCategory] = useState(initialCategory)
  const [tags, setTags] = useState(initialTags)
  const [author, setAuthor] = useState(initialAuthor)
  const [newTag, setNewTag] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!title && content) {
      const extractedTitle = extractMainTitle(content)
      setTitle(extractedTitle)
    }
  }, [content, title])

  const handleSave = () => {
    onSave({ title, content, category, tags, author })
    setIsEditing(false)
  }

  const handleAIUpdate = (updatedContent: string) => {
    setContent(updatedContent)
    const extractedTitle = extractMainTitle(updatedContent)
    if (extractedTitle) {
      setTitle(extractedTitle)
    }
  }

  const extractMainTitle = (content: string) => {
    const match = content.match(/^#\s(.+)$/m)
    return match ? match[1] : ''
  }

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter blog title"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="author">Author</Label>
        <Select value={author} onValueChange={setAuthor}>
          <SelectTrigger>
            <SelectValue placeholder="Select author" />
          </SelectTrigger>
          <SelectContent>
            {authors && Array.isArray(authors) && authors.map((author) => (
              <SelectItem key={author.id} value={author.name}>
                {author.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter blog category"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            id="newTag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a new tag"
          />
          <Button onClick={handleAddTag}>Add Tag</Button>
        </div>
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
      <AIChat onUpdateContent={handleAIUpdate} currentContent={content} />
    </div>
  )
}

