"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, Bot, User, Search, Plus, MoreVertical, Phone, Video } from "lucide-react"

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(1)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    { id: 1, sender: "user", content: "Hey! Are you interested in my NFT collection?", time: "10:30 AM" },
    { id: 2, sender: "other", content: "Yes! I saw your Cosmic Dreams piece. It's amazing!", time: "10:32 AM" },
    { id: 3, sender: "user", content: "Thank you! I'm open to offers if you're interested", time: "10:35 AM" },
    { id: 4, sender: "other", content: "What's your asking price?", time: "10:36 AM" },
    {
      id: 5,
      sender: "ai",
      content:
        "I can help facilitate this transaction! The current market value for similar pieces is around 3-5 ETH. Would you like me to set up an escrow?",
      time: "10:37 AM",
    },
  ])

  const chats = [
    {
      id: 1,
      name: "Alice Cooper",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "What's your asking price?",
      time: "10:36 AM",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "NFT Assistant",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I can help you find similar NFTs",
      time: "9:45 AM",
      unread: 0,
      online: true,
      isAI: true,
    },
    {
      id: 3,
      name: "Bob Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Thanks for the trade!",
      time: "Yesterday",
      unread: 0,
      online: false,
    },
    {
      id: 4,
      name: "Art Collective",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "New collection dropping soon",
      time: "2 days ago",
      unread: 5,
      online: true,
    },
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "user",
        content: message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, newMessage])
      setMessage("")
    }
  }

  const selectedChatData = chats.find((chat) => chat.id === selectedChat)

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-purple-400 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Chat & AI Assistant</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Connect with other users and get help from our AI assistant
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
          {/* Chat List */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Messages</CardTitle>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                      selectedChat === chat.id ? "bg-purple-600/20 border-r-2 border-purple-500" : "hover:bg-white/5"
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {chat.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {chat.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                      )}
                      {chat.isAI && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium truncate">{chat.name}</h3>
                        <span className="text-xs text-gray-400">{chat.time}</span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && <Badge className="bg-purple-600 text-white text-xs">{chat.unread}</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="pb-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedChatData?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {selectedChatData?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {selectedChatData?.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{selectedChatData?.name}</h3>
                      <p className="text-xs text-gray-400">
                        {selectedChatData?.online ? "Online" : "Last seen 2h ago"}
                      </p>
                    </div>
                    {selectedChatData?.isAI && (
                      <Badge className="bg-blue-600 text-white">
                        <Bot className="w-3 h-3 mr-1" />
                        AI Assistant
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`flex gap-2 max-w-[70%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          {msg.sender === "user" ? (
                            <AvatarFallback className="bg-purple-600 text-white">
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          ) : msg.sender === "ai" ? (
                            <AvatarFallback className="bg-blue-600 text-white">
                              <Bot className="w-4 h-4" />
                            </AvatarFallback>
                          ) : (
                            <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          )}
                        </Avatar>
                        <div
                          className={`rounded-lg p-3 ${
                            msg.sender === "user"
                              ? "bg-purple-600 text-white"
                              : msg.sender === "ai"
                                ? "bg-blue-600/20 border border-blue-500/30 text-white"
                                : "bg-white/10 text-white"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-purple-200" : "text-gray-400"}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                  <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
