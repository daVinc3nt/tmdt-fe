import axiosClient from './axiosClient';

export interface MessageDTO {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  content: string;
  messageType: string;
  sendAt: string;
  isRead: boolean;
  mediaUrl?: string;
}

export interface ChatMessageRequest {
  senderId: number;
  receiverId: number;
  content: string;
  messageType?: string;
  mediaUrl?: string;
}

export interface ConversationDTO {
  id: number;
  partnerId: number;
  partnerName: string;
  partnerRole: string;
  lastMessageContent?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

export interface ConversationResponseDTO {
  id: number;
  traineeId: number;
  traineeName: string;
  trainerId: number;
  trainerName: string;
  lastMessageContent?: string;
  lastMessageAt?: string;
}

export interface ChatPartnerDTO {
  userId: number;
  fullName: string;
  role: string;
  conversationId: number;
  lastMessageContent?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

const chatService = {
  startConversation: async (userId1: number, userId2: number): Promise<ConversationResponseDTO> => {
    const response = await axiosClient.post('/chat/start', null, {
      params: { userId1, userId2 },
    });
    return response.data;
  },

  getConversation: async (userId1: number, userId2: number): Promise<MessageDTO[]> => {
    const response = await axiosClient.get<MessageDTO[]>('/chat/conversation', {
      params: { userId1, userId2 },
    });
    return response.data ?? [];
  },

  sendMessage: async (data: ChatMessageRequest) => {
    const response = await axiosClient.post('/chat/send', {
      ...data,
      messageType: data.messageType ?? 'TEXT',
    });
    return response.data;
  },

  getConversationList: async (userId: number): Promise<ConversationDTO[]> => {
    const response = await axiosClient.get<ConversationDTO[]>(`/chat/conversations/${userId}`);
    return response.data ?? [];
  },

  getChatPartners: async (userId: number): Promise<ChatPartnerDTO[]> => {
    const response = await axiosClient.get<ChatPartnerDTO[]>(`/chat/partners/${userId}`);
    return response.data ?? [];
  },

  getMessages: async (conversationId: number): Promise<MessageDTO[]> => {
    const response = await axiosClient.get<MessageDTO[]>(`/chat/messages/${conversationId}`);
    return response.data ?? [];
  },

  markConversationAsRead: async (conversationId: number, userId: number): Promise<void> => {
    await axiosClient.post(`/chat/mark-read/${conversationId}`, null, {
      params: { userId },
    });
  },
};

export default chatService;
