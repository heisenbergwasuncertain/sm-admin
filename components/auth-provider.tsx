"use client"

import { createContext, useContext, useState, useEffect } from 'react'

type User = {
  name: string
  email: string
} | null

type AuthContextType = {
  user: User
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  signInWithGoogle: () => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Simple authentication logic
    if (email === 'admin@admin.com' && password === 'admin') {
      const newUser = { name: 'Admin User', email }
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
      return true
    }
    if (email === 'singh.avinash7273@gmail.com' && password === 'avinash') {
      const newUser = { name: 'Avinash Singh', email }
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
      return true
    }
    return false
  }

  const signup = async (name: string, email: string, password: string) => {
    // Simple signup logic (in a real app, you'd want to send this to a server)
    const newUser = { name, email }
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
    return true
  }

  const signInWithGoogle = async () => {
    // Simulated Google sign-in (in a real app, you'd use the Google OAuth API)
    const newUser = { name: 'Google User', email: 'google@example.com' }
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
