import { ArrowLeft, MoreVertical, Phone, Search, Send, Video } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import chatService, { type ConversationDTO, type MessageDTO } from "../services/chatService";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

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
  partnerId: number;
}

interface DesktopPTMessagesProps {
  onBack: () => void;
  initialClientName?: string;
}

const getUserIdFromToken = (jwt: string | null): number | null => {
  if (!jwt) return null;
  try {
    const base64Url = jwt.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.userId || null;
  } catch {
    return null;
  }
};

const getAvatarUrl = (name: string) => {
  const safe = encodeURIComponent(name || 'User');
  return `https://ui-avatars.com/api/?name=${safe}&background=random`;
};

const formatRelativeTime = (iso?: string) => {
  if (!iso) return '';
  try {
    const date = new Date(iso);
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay === 1) return 'Yesterday';
    return `${diffDay}d ago`;
  } catch {
    return '';
  }
};

export function DesktopPTMessages({ onBack, initialClientName }: DesktopPTMessagesProps) {
  const { token } = useAuth();
  const { showError } = useToast();
  const userId = getUserIdFromToken(token);

  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  // Ref để auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadConversationList = async () => {
      if (!userId) {
        showError('Please sign in again to view messages.', 'Authentication');
        return;
      }
      setIsLoadingConversations(true);
      try {
        const data: ConversationDTO[] = await chatService.getConversationList(userId);
        const mapped: Conversation[] = (data || []).map((c) => ({
          id: c.id,
          partnerId: c.partnerId,
          client: {
            name: c.partnerName,
            image: getAvatarUrl(c.partnerName),
          },
          lastMessage: c.lastMessageContent || '',
          lastMessageTime: formatRelativeTime(c.lastMessageAt),
          unread: c.unreadCount || 0,
          online: false,
        }));

        setConversations(mapped);

        if (mapped.length > 0) {
          const initial = initialClientName
            ? mapped.find((x) => x.client.name.toLowerCase() === initialClientName.toLowerCase())
            : null;
          setSelectedConversationId((initial || mapped[0]).id);
        } else {
          setSelectedConversationId(null);
        }
      } catch (e) {
        console.error('Failed to load conversation list:', e);
        showError('Unable to load conversations.', 'Messages');
      } finally {
        setIsLoadingConversations(false);
      }
    };

    loadConversationList();
  }, [initialClientName, showError, userId]);

  // Lọc danh sách conversation dựa trên Search Query
  const filteredConversations = conversations.filter((c) =>
    c.client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConversation = conversations.find((c) => c.id === selectedConversationId);

  useEffect(() => {
    const loadMessages = async () => {
      if (!userId) return;
      if (!selectedConversationId) {
        setCurrentMessages([]);
        return;
      }

      setIsLoadingMessages(true);
      try {
        await chatService.markConversationAsRead(selectedConversationId, userId);
        setConversations((prev) =>
          prev.map((c) => (c.id === selectedConversationId ? { ...c, unread: 0 } : c))
        );

        const data: MessageDTO[] = await chatService.getMessages(selectedConversationId);
        const mapped: Message[] = (data || []).map((m) => ({
          id: m.id,
          sender: m.senderId === userId ? 'pt' : 'client',
          text: m.content,
          time: new Date(m.sendAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        }));
        setCurrentMessages(mapped);
      } catch (e) {
        console.error('Failed to load messages:', e);
        showError('Unable to load messages.', 'Messages');
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [selectedConversationId, showError, userId]);

  // Auto scroll xuống dưới cùng mỗi khi tin nhắn thay đổi hoặc đổi user
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, selectedConversationId]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    if (!userId) {
      showError('Please sign in again to send messages.', 'Authentication');
      return;
    }

    if (!activeConversation) {
      showError('Please select a conversation first.', 'Messages');
      return;
    }

    const newMessage: Message = {
      id: Date.now(), // ID tạm
      sender: "pt",
      text: messageText,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setCurrentMessages((prev) => [...prev, newMessage]);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
            ...c,
            lastMessage: messageText,
            lastMessageTime: 'Just now',
          }
          : c
      )
    );

    chatService
      .sendMessage({
        senderId: userId,
        receiverId: activeConversation.partnerId,
        content: messageText,
      })
      .catch((e) => {
        console.error('Failed to send message:', e);
        showError('Failed to send message.', 'Messages');
      });

    setMessageText("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
              {isLoadingConversations ? (
                <div className="p-4 text-center text-muted-foreground text-sm">Loading conversations...</div>
              ) : filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversationId(conversation.id)}
                    className={`p-4 border-b border-border cursor-pointer transition-colors ${selectedConversationId === conversation.id
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
                  No conversations yet.
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
                  {isLoadingMessages && (
                    <div className="text-muted-foreground text-sm">Loading messages...</div>
                  )}
                  {currentMessages.length > 0 ? (
                    currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "pt" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] ${message.sender === "pt"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                            } rounded-2xl px-4 py-3 shadow-sm`}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <p
                            className={`text-[10px] mt-1 text-right ${message.sender === "pt" ? "text-primary-foreground/70" : "text-muted-foreground"
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