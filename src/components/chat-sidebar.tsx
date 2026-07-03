'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Plus, MessageSquare, Trash2, Clock, Star } from 'lucide-react'
import type { ChatSession } from '@/lib/chat-store'

interface ChatSidebarProps {
  sessions: ChatSession[]
  currentChatId: string | null
  onChatSelect: (chatId: string) => void
  onNewChat: () => void
  onDeleteChat: (chatId: string) => void
  onToggleStar: (chatId: string) => void
}

const ChatSidebar = ({
  sessions,
  currentChatId,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  onToggleStar,
}: ChatSidebarProps) => {
  const chatSessions = sessions

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onDeleteChat(chatId)
  }

  const handleToggleStar = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleStar(chatId)
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  const starredChats = chatSessions.filter(chat => chat.isStarred)
  const recentChats = chatSessions.filter(chat => !chat.isStarred)

  return (
    <Card className="h-full rounded-none border-r border-gray-200 dark:border-gray-700">
      <CardContent className="p-4 h-full flex flex-col">
        {/* New Chat Button */}
        <Button 
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium mb-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>

        <ScrollArea className="flex-1">
          {/* Starred Chats */}
          {starredChats.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Starred
                </span>
              </div>
              <div className="space-y-2">
                {starredChats.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isSelected={currentChatId === chat.id}
                    onSelect={() => onChatSelect(chat.id)}
                    onDelete={handleDeleteChat}
                    onToggleStar={handleToggleStar}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {chatSessions.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-8 px-2">
              No chats yet. Upload an OCT scan to start your first analysis — it
              will be saved here automatically.
            </div>
          )}

          {/* Recent Chats */}
          {recentChats.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Recent
              </span>
            </div>
            <div className="space-y-2">
              {recentChats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isSelected={currentChatId === chat.id}
                  onSelect={() => onChatSelect(chat.id)}
                  onDelete={handleDeleteChat}
                  onToggleStar={handleToggleStar}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>
          )}
        </ScrollArea>

        <Separator className="my-4" />

        {/* Stats */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <div className="flex justify-between items-center">
            <span>Total Chats</span>
            <Badge variant="secondary" className="text-xs">
              {chatSessions.length}
            </Badge>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span>Starred</span>
            <Badge variant="secondary" className="text-xs">
              {starredChats.length}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ChatItemProps {
  chat: ChatSession
  isSelected: boolean
  onSelect: () => void
  onDelete: (chatId: string, e: React.MouseEvent) => void
  onToggleStar: (chatId: string, e: React.MouseEvent) => void
  formatDate: (date: Date) => string
}

const ChatItem = ({ 
  chat, 
  isSelected, 
  onSelect, 
  onDelete, 
  onToggleStar, 
  formatDate 
}: ChatItemProps) => {
  return (
    <div
      className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-gray-500" />
            <h4 className={`text-sm font-medium truncate ${
              isSelected 
                ? 'text-purple-700 dark:text-purple-300' 
                : 'text-gray-900 dark:text-gray-100'
            }`}>
              {chat.title}
            </h4>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-xs ${
              isSelected
                ? 'text-purple-600 dark:text-purple-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {formatDate(new Date(chat.updatedAt))}
            </span>
            <Badge
              variant="secondary"
              className={`text-xs ${
                isSelected ? 'bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300' : ''
              }`}
            >
              {chat.messages.length}
            </Badge>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={(e) => onToggleStar(chat.id, e)}
          >
            <Star 
              className={`w-3 h-3 ${
                chat.isStarred 
                  ? 'text-yellow-500 fill-yellow-500' 
                  : 'text-gray-400'
              }`} 
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
            onClick={(e) => onDelete(chat.id, e)}
          >
            <Trash2 className="w-3 h-3 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatSidebar