"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from 'react-markdown'
import { AIChat } from "@/components/ai-chat"

interface PageEditorProps {
  initialContent: string
  onSave: (page: { 
    content: string
    id?: number
  }) => void
}

export function PageEditor({ initialContent, onSave }: PageEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    onSave({ content })
    setIsEditing(false)
  }

  return (
    <div className="space-y-4">
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