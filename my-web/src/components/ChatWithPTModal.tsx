import { X, Send, Paperclip, Image as ImageIcon, Smile } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useState } from "react";

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
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "trainer",
      text: "Hi! Thanks for booking a session with me. Looking forward to training with you! 💪",
      time: "10:30 AM"
    },
    {
      id: 2,
      sender: "user",
      text: "Hi! I'm excited too. What should I prepare for tomorrow's session?",
      time: "10:32 AM"
    },
    {
      id: 3,
      sender: "trainer",
      text: "Great! Please bring a water bottle, towel, and wear comfortable workout clothes. We'll focus on strength training basics.",
      time: "10:35 AM"
    },
    {
      id: 4,
      sender: "user",
      text: "Perfect! See you tomorrow at 10 AM!",
      time: "10:36 AM"
    }
  ]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: "user",
        text: message,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage("");

      // Simulate trainer response
      setTimeout(() => {
        const trainerResponse: Message = {
          id: messages.length + 2,
          sender: "trainer",
          text: "Got it! I'll see you then. Feel free to reach out if you have any questions.",
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, trainerResponse]);
      }, 2000);
    }
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
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] ${
                  msg.sender === "user"
                    ? "bg-primary text-white"
                    : "bg-secondary text-foreground"
                } rounded-[16px] p-3`}
              >
                <p className="text-sm">{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.sender === "user" ? "text-white/70" : "text-muted-foreground"
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
