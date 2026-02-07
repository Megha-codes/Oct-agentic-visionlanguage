'use client'

'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import {
  Upload,
  Send,
  Bot,
  User,
  Eye,
  FileImage,
  Menu,
  MessageSquare,
  Paperclip,
} from 'lucide-react'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ChatSidebar from '@/components/chat-sidebar'

// ⛔ Disable SSR for animated / random components (hydration fix)
const HeroSection = dynamic(() => import('@/components/hero-section'), {
  ssr: false,})
const FeaturesSection = dynamic(() => import('@/components/features-section'), {
  ssr: false,})
const HowItWorksSection = dynamic(() => import('@/components/how-it-works-section'), {
  ssr: false,})

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  image?: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized) {
      setMessages([
        {
          id: '1',
          type: 'bot',
          content: 'Hello! I\'m OCTina, your advanced OCT scan analysis assistant. I\'m here to provide detailed retinal diagnostics and insights. Please upload an OCT scan image and I\'ll give you a comprehensive analysis.',
          timestamp: new Date(),
        },
      ])
      setInitialized(true)
    }
  }, [initialized])

  const [inputMessage, setInputMessage] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setSelectedImage(file)
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        // For PDF files, show a document icon instead of preview
        setImagePreview('pdf')
      }
    }
  }

  const handleNewChat = () => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: 'Hello! I\'m OCTina, your advanced OCT scan analysis assistant. I\'m here to provide detailed retinal diagnostics and insights. Please upload an OCT scan image and I\'ll give you a comprehensive analysis.',
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock response for demo purposes
      const mockAnalysis = `Based on the OCT scan analysis, I can observe the following:

**Retinal Structure Assessment:**
- The retinal layers appear to be well-preserved
- No significant macular edema detected
- Foveal contour appears normal
- RPE layer shows no abnormalities

**Clinical Assessment:**
- No signs of macular degeneration
- No evidence of diabetic retinopathy
- Optic nerve head appears healthy
- No retinal detachment observed

**Recommendations:**
- Regular follow-up examinations recommended
- Maintain current treatment plan
- Monitor for any changes in vision

*Note: This is a demo analysis. Please consult with a qualified ophthalmologist for proper diagnosis.*`

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: mockAnalysis,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
      setIsAnalyzing(false)
      setAnalysisProgress(100)
      
      setTimeout(() => setAnalysisProgress(0), 1000)
    } catch (error) {
      console.error('Analysis error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'I apologize, but I encountered an error while analyzing the OCT scan. Please check the image format and try again.',
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
    return date
      .toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    .toUpperCase()
  }

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10">
        <Navbar />
        
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* How It Works Section */}
        <HowItWorksSection />
      
        {/* Chatbot Demo Section */}
        <section className="py-20 bg-linear-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-pink-900">
          <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700">
              Try It Now
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Experience OCTina
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Try our OCT scan analysis demo below. Upload an image and see the power of AI-powered medical diagnostics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
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
              <Card className="h-175 flex flex-col shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardHeader className="pb-3 border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        The OCTina Chatbot
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        OCT Scan Analysis Assistant
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  <ScrollArea className="flex-1 px-4 pb-4">
                    <div className="space-y-4 pt-4">
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
                              className={`rounded-2xl p-4 ${
                                message.type === 'user'
                                  ? 'bg-linear-to-br from-purple-500 to-pink-500 text-white'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                              }`}
                            >
                              {message.image && (
                                <div className="mb-3">
                                  {message.image === 'pdf' ? (
                                    <div className="flex items-center justify-center w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                                      <div className="text-center">
                                        <FileImage className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">PDF Document</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <img
                                      src={message.image}
                                      alt="OCT Scan"
                                      className="max-w-full h-auto rounded-lg shadow-md"
                                    />
                                  )}
                                </div>
                              )}
                              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {message.content}
                              </div>
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
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isAnalyzing}
                          variant="outline"
                          size="icon"
                          className={`self-end bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 relative ${
                            selectedImage ? 'ring-2 ring-purple-500 ring-offset-2' : ''
                          }`}
                        >
                          <Paperclip className="h-4 w-4" />
                          {selectedImage && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"></div>
                          )}
                        </Button>
                        <Button
                          onClick={handleSendMessage}
                          disabled={isAnalyzing || (!inputMessage.trim() && !selectedImage)}
                          className="self-end bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
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
                      Click to upload OCT scan or document
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports: JPG, PNG, DICOM, PDF
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {imagePreview && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview:</h4>
                      {imagePreview === 'pdf' ? (
                        <div className="flex items-center justify-center w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                          <div className="text-center">
                            <FileImage className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">PDF Document</p>
                            <p className="text-xs text-gray-500">{selectedImage?.name}</p>
                          </div>
                        </div>
                      ) : (
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
                      )}
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
                      Secure Processing
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  )
}