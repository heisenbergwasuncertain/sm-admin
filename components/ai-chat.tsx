"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Mic, Send, StopCircle } from 'lucide-react'
import { useChat } from 'ai/react'
import { generateText } from 'ai'
import { google, createGoogleGenerativeAI } from '@ai-sdk/google'

interface AIChatProps {
  onUpdateContent: (content: string) => void
  currentContent: string
}

export function AIChat({ onUpdateContent, currentContent }: AIChatProps) {
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const { messages, append, setMessages } = useChat()
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const googleAI = createGoogleGenerativeAI({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY || ''
  })

  const handleSend = async () => {
    if (!input.trim() && !audioBlob) return

    await append({
      role: 'user',
      content: input,
    })

    setInput('')

    let aiInput = input
    if (audioBlob) {
      // Convert audio blob to base64
      const reader = new FileReader()
      reader.readAsDataURL(audioBlob)
      const base64Audio = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string)
      })
      aiInput = `[Audio Input: ${base64Audio}]`
    }

    try {
      const { text } = await generateText({
        model: googleAI('gemini-2.0-flash-exp'),
        prompt: `Current content: ${currentContent}\n\nUser input: ${aiInput}\n\nPlease provide an updated version of the content based on the user's input.`,
      })

      append({
        role: 'assistant',
        content: text,
      })

      onUpdateContent(text)
    } catch (error) {
      console.error('Error generating AI response:', error)
      append({
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again.',
      })
    }

    setAudioBlob(null)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      const audioChunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        setAudioBlob(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
      }
    }
  }, [isRecording])

  return (
    <div className="border-t pt-4 mt-4">
      <div className="mb-4 space-y-4">
        {messages.map((m, index) => (
          <div key={index} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg p-2 ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI to help with your content..."
          className="flex-grow"
        />
        <Button onClick={handleSend} className="px-3">
          <Send className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="px-3"
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? <StopCircle className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
      </div>
      {audioBlob && (
        <div className="mt-2 flex justify-end space-x-2">
          <audio src={URL.createObjectURL(audioBlob)} controls />
          <Button onClick={() => setAudioBlob(null)}>Retake</Button>
          <Button onClick={handleSend}>Send Audio</Button>
        </div>
      )}
    </div>
  )
}
