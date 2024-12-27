"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

const dummyUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", website: "https://alicejohnson.com", image: "https://avatar.vercel.sh/alice@example.com.png", role: "Admin", lastActive: "2023-06-20", isActive: true },
  { id: 2, name: "Bob Smith", email: "bob@example.com", website: "https://bobsmith.com", image: "https://avatar.vercel.sh/bob@example.com.png", role: "Moderator", lastActive: "2023-06-19", isActive: true },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", website: "https://charliebrown.com", image: "https://avatar.vercel.sh/charlie@example.com.png", role: "User", lastActive: "2023-06-18", isActive: false },
  { id: 4, name: "Diana Ross", email: "diana@example.com", website: "https://dianaross.com", image: "https://avatar.vercel.sh/diana@example.com.png", role: "User", lastActive: "2023-06-17", isActive: true },
]

export default function UsersPage() {
  const [users, setUsers] = useState(dummyUsers)
  const [selectedUser, setSelectedUser] = useState<typeof dummyUsers[0] | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null)

  const handleSave = (updatedUser: typeof dummyUsers[0]) => {
    if (!updatedUser.name || !updatedUser.email) {
      toast({
        title: "Error",
        description: "Name and email are required fields.",
        variant: "destructive",
      })
      return
    }

    if (selectedUser) {
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? { ...updatedUser, id: user.id } : user
      )
      setUsers(updatedUsers)
    } else if (isCreating) {
      setUsers([...users, { ...updatedUser, id: users.length + 1, lastActive: new Date().toISOString().split('T')[0], isActive: true }])
    }
    setSelectedUser(null)
    setIsCreating(false)
  }

  const handleCreateNew = () => {
    setIsCreating(true)
    setSelectedUser(null)
  }

  const handleEditUser = (user: typeof dummyUsers[0]) => {
    setSelectedUser(user)
    setIsCreating(false)
  }

  const handleBack = () => {
    setSelectedUser(null)
    setIsCreating(false)
  }

  const handleDelete = (id: number) => {
    setDeleteConfirmation(id)
  }

  const confirmDelete = () => {
    if (deleteConfirmation) {
      setUsers(users.filter(user => user.id !== deleteConfirmation))
      setDeleteConfirmation(null)
    }
  }

  const handleToggleActive = (id: number) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, isActive: !user.isActive } : user
    ))
  }

  if (selectedUser || isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{isCreating ? "Add New User" : "Edit User"}</h1>
          <Button variant="outline" onClick={handleBack}>Back to Users</Button>
        </div>
        <Card>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleSave({
                id: selectedUser?.id || 0,
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                website: formData.get('website') as string,
                image: formData.get('image') as string,
                role: formData.get('role') as string,
                lastActive: selectedUser?.lastActive || new Date().toISOString().split('T')[0],
                isActive: selectedUser?.isActive ?? true,
              })
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={selectedUser?.name || ''} onChange={(e) => setSelectedUser(prev => prev ? { ...prev, name: e.target.value } : null)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={selectedUser?.email || ''} onChange={(e) => setSelectedUser(prev => prev ? { ...prev, email: e.target.value } : null)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" type="url" value={selectedUser?.website || ''} onChange={(e) => setSelectedUser(prev => prev ? { ...prev, website: e.target.value } : null)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" name="image" type="url" value={selectedUser?.image || ''} onChange={(e) => setSelectedUser(prev => prev ? { ...prev, image: e.target.value } : null)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" name="role" value={selectedUser?.role || ''} onChange={(e) => setSelectedUser(prev => prev ? { ...prev, role: e.target.value } : null)} />
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
        <h1 className="text-3xl font-bold">Users</h1>
        <Button onClick={handleCreateNew}>
          Add New User
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage registered forum users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {users.map((user) => (
              <Card key={`user-${user.id}`} className={`${!user.isActive ? 'opacity-50' : ''}`}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{user.website}</p>
                  <div className="flex justify-between items-center">
                    <Badge>{user.role}</Badge>
                    <p className="text-sm text-muted-foreground">Last active: {user.lastActive}</p>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleToggleActive(user.id)}>
                      {user.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={() => handleEditUser(user)}>
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
            <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
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

