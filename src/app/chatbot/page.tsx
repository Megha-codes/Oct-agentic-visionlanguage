'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Upload, Send, Bot, User, Eye, FileImage, Menu, MessageSquare, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ChatSidebar from '@/components/chat-sidebar'

import { useRouter } from 'next/navigation'

interface Finding {
  task: string
  prediction: string
  confidence: number
  uncertain: boolean
  caveat?: string | null
  all_probs?: Record<string, number>
  task_label?: string
}

// Display labels for each task key from the inference service.
const TASK_LABELS: Record<string, string> = {
  vri: 'Vitreoretinal Interface',
  foveal: 'Foveal Contour',
  architecture: 'Retinal Architecture',
  rpe: 'RPE / Choriocapillaris',
}

const taskLabel = (f: Finding) => TASK_LABELS[f.task] || f.task_label || f.task

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  image?: string
  findings?: Finding[]
  disclaimer?: string
}

const NORMAL_PREDICTIONS = new Set(['Normal', 'Not_disrupted'])

function FindingCards({ findings }: { findings: Finding[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
      {findings.map((f) => {
        const pct = Math.round(f.confidence * 100)
        const isNormal = NORMAL_PREDICTIONS.has(f.prediction)
        return (
          <div
            key={f.task}
            className="rounded-xl border border-gray-200 bg-white p-3 text-left"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-gray-500">{taskLabel(f)}</span>
              {f.uncertain && (
                <Badge className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] px-1.5 py-0">
                  Uncertain
                </Badge>
              )}
            </div>
            <div
              className={`font-display text-base font-bold ${
                isNormal ? 'text-emerald-600' : 'text-purple-700'
              }`}
            >
              {f.prediction.replace(/_/g, ' ')}
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <Progress value={pct} className="h-1.5 flex-1" />
              <span className="text-xs font-semibold text-gray-600 tabular-nums">{pct}%</span>
            </div>
            {f.caveat && (
              <p className="mt-1.5 text-[11px] leading-snug text-gray-500">{f.caveat}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function ChatbotPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  // null = still checking, true = online, false = offline
  const [modelOnline, setModelOnline] = useState<boolean | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Poll the inference service health via the Next.js proxy.
  useEffect(() => {
    let active = true
    const check = () =>
      fetch('/api/analyze-oct')
        .then((r) => r.json())
        .then((d) => { if (active) setModelOnline(!!d.online) })
        .catch(() => { if (active) setModelOnline(false) })
    check()
    const id = setInterval(check, 30000)
    return () => { active = false; clearInterval(id) }
  }, [])

  // Initialize welcome message on client side only to prevent hydration issues
  useEffect(() => {
    if (!isInitialized) {
      setMessages([
        {
          id: '1',
          type: 'bot',
          content: 'Hello! I\'m OCTina, your advanced OCT scan analysis assistant. I\'m here to provide detailed retinal diagnostics and insights. Please upload an OCT scan image and I\'ll give you a comprehensive analysis.\n\nDo you have an OCT scan ready to upload? Or would you like to learn more about what I can analyze?',
          timestamp: new Date()
        }
      ])
      setIsInitialized(true)
    }
  }, [isInitialized])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Hello! I\'m OCTina, your advanced OCT scan analysis assistant. I\'m here to provide detailed retinal diagnostics and insights. Please upload an OCT scan image and I\'ll give you a comprehensive analysis.\n\nDo you have an OCT scan ready to upload? Or would you like to learn more about what I can analyze?',
        timestamp: new Date()
      }
    ])
    setCurrentChatId(null)
    setSelectedImage(null)
    setImagePreview(null)
    setInputMessage('')
    setIsSidebarOpen(false)
  }

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId)
    setIsSidebarOpen(false)
    // Here you would typically load the chat history from the selected chat
  }

  const handleDeleteChat = (chatId: string) => {
    // Here you would typically delete the chat from your backend
    console.log('Deleting chat:', chatId)
  }

  const handleToggleStar = (chatId: string) => {
    // Here you would typically toggle the star status in your backend
    console.log('Toggling star for chat:', chatId)
  }

  // Function to generate follow-up questions based on context
  const generateFollowUpQuestions = (content: string): string => {
    // If content contains analysis results, add relevant follow-up questions
    if (content.includes('retinal') || content.includes('OCT scan') || content.includes('findings')) {
      return `\n\nWould you like me to explain more about these findings? Or do you have any specific questions about your scan?`;
    }
    
    // If asking for an image
    if (content.includes('upload an image') || content.includes('check the image format')) {
      return `\n\nDo you need help with uploading your OCT scan? Or would you like to see a sample analysis first?`;
    }
    
    // Default follow-up
    return `\n\nIs there anything specific you'd like to know about OCT scans?`;
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage || 'Please analyze this OCT scan',
      timestamp: new Date(),
      image: imagePreview || undefined
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    const currentImage = selectedImage
    const currentImagePreview = imagePreview
    setSelectedImage(null)
    setImagePreview(null)
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      // Create form data for API request
      const formData = new FormData()
      if (currentImage) {
        formData.append('image', currentImage)
      }
      formData.append('message', inputMessage || 'Please analyze this OCT scan')

      // Send to API for analysis
      const response = await fetch('/api/analyze-oct', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        // 502 from our route means the inference service is unreachable/down.
        if (response.status === 502) setModelOnline(false)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed')
      }

      setModelOnline(true)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.report || 'Analysis complete.',
        timestamp: new Date(),
        findings: data.findings,
        disclaimer: data.disclaimer,
      }

      setMessages(prev => [...prev, botMessage])
      setIsAnalyzing(false)
      setAnalysisProgress(100)
      
      setTimeout(() => setAnalysisProgress(0), 1000)
    } catch (error) {
      console.error('Analysis error:', error)
      const errorContent = 'I apologize, but I encountered an error while analyzing the OCT scan. Please check the image format and try again.';
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: errorContent + generateFollowUpQuestions(errorContent),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      setIsAnalyzing(false)
      setAnalysisProgress(0)
      
      // Restore the image if analysis failed
      if (currentImage && currentImagePreview) {
        setSelectedImage(currentImage)
        setImagePreview(currentImagePreview)
      }
    }
  }

  const formatTime = (date: Date) => {
    // Use consistent formatting to prevent hydration issues
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
    .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-pink-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Button 
            onClick={() => router.push('/')}
            variant="outline" 
            size="sm"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Model service offline banner */}
        {modelOnline === false && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
            <span>
              <strong>Model service offline.</strong> Scan analysis is unavailable —
              start the inference service (port 8001) and it will reconnect automatically.
            </span>
          </div>
        )}

        {/* Mobile Header with Sidebar Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="w-4 h-4 mr-2" />
                Chat History
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] p-0">
              <ChatSidebar
                currentChatId={currentChatId}
                onChatSelect={handleChatSelect}
                onNewChat={handleNewChat}
                onDeleteChat={handleDeleteChat}
                onToggleStar={handleToggleStar}
              />
            </SheetContent>
          </Sheet>
          
          <Button onClick={handleNewChat} variant="outline" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <ChatSidebar
              currentChatId={currentChatId}
              onChatSelect={handleChatSelect}
              onNewChat={handleNewChat}
              onDeleteChat={handleDeleteChat}
              onToggleStar={handleToggleStar}
            />
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-6">
            <Card className="h-[75vh] flex flex-col shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="pb-3 border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      OCTina
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      OCT Scan Analysis Assistant
                      <span className="inline-flex items-center gap-1">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            modelOnline === null
                              ? 'bg-gray-400'
                              : modelOnline
                              ? 'bg-emerald-500'
                              : 'bg-red-500'
                          }`}
                        />
                        <span className="text-[10px]">
                          {modelOnline === null ? 'checking' : modelOnline ? 'online' : 'offline'}
                        </span>
                      </span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                <ScrollArea className="flex-1 px-4 pb-4 h-full">
                  <div className="space-y-4 pt-4 max-w-full min-h-0">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.type === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`flex gap-2 max-w-[80%] ${
                            message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              message.type === 'user'
                                ? 'bg-linear-to-br from-purple-500 to-pink-500 text-white'
                                : 'bg-linear-to-br from-green-500 to-teal-500 text-white'
                            }`}
                          >
                            {message.type === 'user' ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                          </div>
                          <div
                            className={`rounded-2xl p-4 max-w-full overflow-hidden ${
                              message.type === 'user'
                                ? 'bg-linear-to-br from-purple-500 to-pink-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                            }`}
                          >
                            {message.image && (
                              <div className="mb-3 max-w-full overflow-hidden">
                                <img
                                  src={message.image}
                                  alt="OCT Scan"
                                  className="max-w-full w-full h-auto rounded-lg shadow-md object-contain"
                                />
                              </div>
                            )}
                            {message.findings && message.findings.length > 0 && (
                              <FindingCards findings={message.findings} />
                            )}
                            <div className="whitespace-pre-wrap text-sm leading-relaxed max-h-80 overflow-y-auto pr-2">
                              {message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').split('\n').map((line, i) => (
                                <div key={i} dangerouslySetInnerHTML={{ __html: line }} className="mb-2" />
                              ))}
                            </div>
                            {message.disclaimer && (
                              <p className="mt-2 pt-2 border-t border-gray-200 text-[11px] leading-snug text-gray-500">
                                {message.disclaimer}
                              </p>
                            )}
                            <div
                              className={`text-xs mt-2 opacity-70 ${
                                message.type === 'user' ? 'text-purple-100' : 'text-gray-500'
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isAnalyzing && (
                      <div className="flex gap-3 justify-start">
                        <div className="flex gap-2 max-w-[80%]">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-linear-to-br from-green-500 to-teal-500 text-white">
                            <Bot className="h-4 w-4" />
                          </div>
                          <div className="rounded-2xl p-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                              <span className="text-sm font-medium">OCTina is analyzing your OCT scan...</span>
                            </div>
                            <Progress value={analysisProgress} className="w-full" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <Separator />
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Ask OCTina about your OCT scan..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="flex-1 resize-none border-0 bg-white dark:bg-gray-800 shadow-sm"
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isAnalyzing || modelOnline === false || (!inputMessage.trim() && !selectedImage)}
                      className="self-end bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

       
          </div>

          {/* Upload Area */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileImage className="h-5 w-5 text-purple-600" />
                  Upload OCT Scan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-purple-400 transition-all duration-200 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 font-medium">
                    Click to upload OCT scan
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports: JPG, PNG
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {imagePreview && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview:</h4>
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="OCT Scan Preview"
                        className="w-full h-auto rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-md"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Click to analyze</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                        {selectedImage?.name}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedImage(null)
                          setImagePreview(null)
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ''
                          }
                        }}
                        className="text-xs"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Actions:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isAnalyzing}
                      onClick={() => {
                        setInputMessage('Analyze this OCT scan for retinal abnormalities')
                        setTimeout(() => handleSendMessage(), 100)
                      }}
                      className="text-xs"
                    >
                      Quick Analysis
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isAnalyzing}
                      onClick={() => {
                        setInputMessage('Compare with previous scans if available')
                        setTimeout(() => handleSendMessage(), 100)
                      }}
                      className="text-xs"
                    >
                      Compare
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  About OCTina
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p>• Advanced AI-powered OCT analysis</p>
                <p>• Medical-grade diagnostic insights</p>
                <p>• Secure and private processing</p>
                <p>• Professional ophthalmologist-level assessment</p>
                <div className="pt-2">
                  <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700">
                    HIPAA Compliant
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}