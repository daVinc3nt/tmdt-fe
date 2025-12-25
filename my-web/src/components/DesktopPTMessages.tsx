import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Search, Phone, Video, MoreVertical } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Message {
  id: number;
  sender: "pt" | "client";
  text: string;
  time: string;
}

interface Conversation {
  id: number;
  client: {
    name: string;
    image: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  online: boolean;
}

interface DesktopPTMessagesProps {
  onBack: () => void;
  initialClientName?: string;
}

const initialConversations: Conversation[] = [
  {
    id: 1,
    client: {
      name: "John Davis",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400"
    },
    lastMessage: "See you tomorrow at 6 AM!",
    lastMessageTime: "2m ago",
    unread: 2,
    online: true
  },
  {
    id: 2,
    client: {
      name: "Sarah Martinez",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
    },
    lastMessage: "Can we reschedule Friday's session?",
    lastMessageTime: "1h ago",
    unread: 1,
    online: true
  },
  {
    id: 3,
    client: {
      name: "Mike Roberts",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
    },
    lastMessage: "Thanks for the nutrition plan!",
    lastMessageTime: "3h ago",
    unread: 0,
    online: false
  },
  {
    id: 4,
    client: {
      name: "Emma Wilson",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"
    },
    lastMessage: "Great session today, feeling pumped!",
    lastMessageTime: "Yesterday",
    unread: 0,
    online: false
  }
];

// Mock data ban đầu cho user ID 1
const initialMessages: Message[] = [
  { id: 1, sender: "client", text: "Hi Marcus! Looking forward to our session tomorrow.", time: "10:23 AM" },
  { id: 2, sender: "pt", text: "Hey John! Yes, me too. We'll focus on upper body tomorrow. Make sure you're well rested!", time: "10:25 AM" },
  { id: 3, sender: "client", text: "Perfect! Should I bring anything specific?", time: "10:27 AM" },
  { id: 4, sender: "pt", text: "Just your water bottle and gloves. I'll have everything else ready.", time: "10:28 AM" },
  { id: 5, sender: "client", text: "See you tomorrow at 6 AM!", time: "10:30 AM" }
];

export function DesktopPTMessages({ onBack, initialClientName }: DesktopPTMessagesProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<number>(1);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // State lưu tin nhắn cho từng cuộc hội thoại (key là conversationId)
const [messagesByConversationId, setMessagesByConversationId] = useState<Record<number, Message[]>>({
    1: initialMessages,
    2: [], // Các user khác chưa có tin nhắn mẫu
    3: [],
    4: []
  });
  // Ref để auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lọc danh sách conversation dựa trên Search Query
  const filteredConversations = initialConversations.filter(c => 
    c.client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConversation = initialConversations.find(c => c.id === selectedConversationId);
  const currentMessages = messagesByConversationId[selectedConversationId] || [];

  // Auto scroll xuống dưới cùng mỗi khi tin nhắn thay đổi hoặc đổi user
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, selectedConversationId]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now(), // ID tạm
      sender: "pt",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Cập nhật state tin nhắn
    setMessagesByConversationId(prev => ({
      ...prev,
      [selectedConversationId]: [...(prev[selectedConversationId] || []), newMessage]
    }));

    setMessageText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Button variant="ghost" onClick={onBack} className="mb-4 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <h1 className="text-foreground mb-2 text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Connect with your clients</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-[350px_1fr] gap-6 h-[700px]">
          {/* Conversations List */}
          <Card className="border-border bg-card flex flex-col overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>
            </div>

            {/* Conversations List Items */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversationId(conversation.id)}
                    className={`p-4 border-b border-border cursor-pointer transition-colors ${
                      selectedConversationId === conversation.id
                        ? "bg-primary/5 border-l-4 border-l-primary" // Thêm border trái để highlight rõ hơn
                        : "hover:bg-muted/50 border-l-4 border-l-transparent"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <ImageWithFallback
                            src={conversation.client.image}
                            alt={conversation.client.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {conversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-foreground text-sm font-medium truncate">
                            {conversation.client.name}
                          </h4>
                          <span className="text-muted-foreground text-xs flex-shrink-0">
                            {conversation.lastMessageTime}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-muted-foreground text-sm truncate pr-2">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unread > 0 && (
                            <div className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                              {conversation.unread}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No conversations found.
                </div>
              )}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="border-border bg-card flex flex-col overflow-hidden">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center justify-between bg-card z-10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <ImageWithFallback
                          src={activeConversation.client.image}
                          alt={activeConversation.client.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {activeConversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-foreground font-semibold">{activeConversation.client.name}</h3>
                      <p className="text-muted-foreground text-xs">
                        {activeConversation.online ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="w-5 h-5 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/10">
                  {currentMessages.length > 0 ? (
                    currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "pt" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] ${
                            message.sender === "pt"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          } rounded-2xl px-4 py-3 shadow-sm`}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <p
                            className={`text-[10px] mt-1 text-right ${
                              message.sender === "pt" ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                      Start a new conversation with {activeConversation.client.name}
                    </div>
                  )}
                  {/* Invisible div to scroll to */}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border bg-card">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 bg-background border-border"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-primary text-white gap-2 px-6"
                      disabled={!messageText.trim()}
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation to start chatting
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}