import { Image as ImageIcon, Paperclip, Send, Smile, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import chatService from "../services/chatService";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface Message {
  id: number;
  sender: "user" | "trainer";
  text: string;
  time: string;
}

interface ChatWithPTModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainerName: string;
  trainerImage: string;
  trainerId: number;
}

export function ChatWithPTModal({ isOpen, onClose, trainerName, trainerImage, trainerId }: ChatWithPTModalProps) {
  const { token } = useAuth();
  const { showError } = useToast();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

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

  const userId = getUserIdFromToken(token);

  useEffect(() => {
    const loadConversation = async () => {
      if (!isOpen) return;
      if (!userId) {
        showError('Please sign in again to use chat.', 'Authentication');
        return;
      }

      setIsLoading(true);
      try {
        await chatService.startConversation(userId, trainerId);
        const history = await chatService.getConversation(userId, trainerId);
        const mapped: Message[] = (history || []).map((m) => ({
          id: m.id,
          sender: m.senderId === userId ? 'user' : 'trainer',
          text: m.content,
          time: new Date(m.sendAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        }));
        setMessages(mapped);
      } catch (e) {
        console.error('Chat load error:', e);
        showError('Unable to load chat messages.', 'Chat');
      } finally {
        setIsLoading(false);
      }
    };

    loadConversation();
  }, [isOpen, trainerId, userId, showError]);

  const handleSend = () => {
    const text = message.trim();
    if (!text) return;
    if (!userId) {
      showError('Please sign in again to send messages.', 'Authentication');
      return;
    }

    const optimistic: Message = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, optimistic]);
    setMessage('');

    chatService
      .sendMessage({
        senderId: userId,
        receiverId: trainerId,
        content: text,
      })
      .catch((e) => {
        console.error('Chat send error:', e);
        showError('Failed to send message.', 'Chat');
      });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl rounded-[20px] border-border bg-white relative h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary relative">
              <img src={trainerImage} alt={trainerName} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="text-foreground">{trainerName}</h3>
              <p className="text-xs text-green-500">Active now</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading && (
            <div className="text-sm text-muted-foreground">Loading messages...</div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] ${msg.sender === "user"
                    ? "bg-primary text-white"
                    : "bg-secondary text-foreground"
                  } rounded-[16px] p-3`}
              >
                <p className="text-sm">{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${msg.sender === "user" ? "text-white/70" : "text-muted-foreground"
                    }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Replies */}
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMessage("Can we reschedule?")}
              className="text-xs whitespace-nowrap rounded-full"
            >
              Can we reschedule?
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMessage("What equipment do I need?")}
              className="text-xs whitespace-nowrap rounded-full"
            >
              What equipment?
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMessage("Thanks!")}
              className="text-xs whitespace-nowrap rounded-full"
            >
              Thanks!
            </Button>
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
            </Button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Smile className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              size="icon"
              className="bg-primary text-white flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
