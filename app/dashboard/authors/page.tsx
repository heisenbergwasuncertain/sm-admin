"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AIChat } from "@/components/ai-chat"
import { Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

const dummyAuthors = [
  { id: 1, name: "John Doe", email: "john@example.com", website: "https://johndoe.com", image: "https://avatar.vercel.sh/john@example.com.png", posts: 15, bio: "Web developer and tech enthusiast", isActive: true },
  { id: 2, name: "Jane Smith", email: "jane@example.com", website: "https://janesmith.com", image: "https://avatar.vercel.sh/jane@example.com.png", posts: 22, bio: "UX designer with a passion for user-centric design", isActive: true },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", website: "https://bobjohnson.com", image: "https://avatar.vercel.sh/bob@example.com.png", posts: 8, bio: "Full-stack developer specializing in React and Node.js", isActive: false },
  { id: 4, name: "Alice Brown", email: "alice@example.com", website: "https://alicebrown.com", image: "https://avatar.vercel.sh/alice@example.com.png", posts: 19, bio: "Tech writer and open-source contributor", isActive: true },
]

export default function AuthorsPage() {
  const [authors, setAuthors] = useState(dummyAuthors)
  const [selectedAuthor, setSelectedAuthor] = useState<typeof dummyAuthors[0] | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleSave = (updatedAuthor: typeof dummyAuthors[0]) => {
    if (selectedAuthor) {
      const updatedAuthors = authors.map(author => 
        author.id === selectedAuthor.id ? { ...updatedAuthor, id: author.id } : author
      )
      setAuthors(updatedAuthors)
    } else if (isCreating) {
      setAuthors([...authors, { ...updatedAuthor, id: authors.length + 1, posts: 0, isActive: true }])
    }
    // Note: We're not setting isCreating to false or clearing selectedAuthor here
  }

  const handleAIUpdate = (content: string) => {
    if (selectedAuthor) {
      handleSave({ ...selectedAuthor, bio: selectedAuthor.bio + "\n\n" + content })
    }
  }

  const handleCreateNew = () => {
    setIsCreating(true)
    setSelectedAuthor(null)
  }

  const handleEditAuthor = (author: typeof dummyAuthors[0]) => {
    setSelectedAuthor(author)
    setIsCreating(false)
  }

  const handleBack = () => {
    setSelectedAuthor(null)
    setIsCreating(false)
  }

  const handleDelete = (id: number) => {
    setAuthors(authors.filter(author => author.id !== id))
  }

  const handleToggleActive = (id: number) => {
    setAuthors(authors.map(author => 
      author.id === id ? { ...author, isActive: !author.isActive } : author
    ))
  }

  if (selectedAuthor || isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{isCreating ? "Add New Author" : "Edit Author"}</h1>
          <Button variant="outline" onClick={handleBack}>Back to Authors</Button>
        </div>
        <Card>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleSave({
                id: selectedAuthor?.id || 0,
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                website: formData.get('website') as string,
                image: formData.get('image') as string,
                posts: selectedAuthor?.posts || 0,
                bio: formData.get('bio') as string,
                isActive: selectedAuthor?.isActive ?? true,
              })
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={selectedAuthor?.name || ''} 
                  onChange={(e) => setSelectedAuthor(prev => 
                    prev ? { ...prev, name: e.target.value } : null
                  )} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={selectedAuthor?.email || ''} 
                  onChange={(e) => setSelectedAuthor(prev => 
                    prev ? { ...prev, email: e.target.value } : null
                  )} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  name="website" 
                  type="url" 
                  value={selectedAuthor?.website || ''} 
                  onChange={(e) => setSelectedAuthor(prev => 
                    prev ? { ...prev, website: e.target.value } : null
                  )} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input 
                  id="image" 
                  name="image" 
                  type="url" 
                  value={selectedAuthor?.image || ''} 
                  onChange={(e) => setSelectedAuthor(prev => 
                    prev ? { ...prev, image: e.target.value } : null
                  )} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input 
                  id="bio" 
                  name="bio" 
                  value={selectedAuthor?.bio || ''} 
                  onChange={(e) => setSelectedAuthor(prev => 
                    prev ? { ...prev, bio: e.target.value } : null
                  )} 
                />
              </div>
              <Button type="submit">Save</Button>
            </form>
            <AIChat 
              onUpdateContent={handleAIUpdate} 
              currentContent={selectedAuthor?.bio || ''}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Authors</h1>
        <Button onClick={handleCreateNew}>
          Add New Author
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Author Management</CardTitle>
          <CardDescription>Manage your blog authors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {authors.map((author) => (
              <Card key={`author-${author.id}`} className={`cursor-pointer hover:bg-accent ${!author.isActive ? 'opacity-50' : ''}`}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={author.image} alt={author.name} />
                      <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{author.name}</CardTitle>
                      <CardDescription>{author.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{author.bio}</p>
                  <p className="text-sm text-muted-foreground mb-2">{author.website}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">{author.posts} posts</Badge>
                    <div className="space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleToggleActive(author.id)}>
                        {author.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(author.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleEditAuthor(author)}>
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

