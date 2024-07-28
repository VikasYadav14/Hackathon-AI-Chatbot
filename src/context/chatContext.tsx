"use client"
import React, { createContext, useState, ReactNode, useContext } from 'react';
import { ObjectId } from 'mongodb';

// Define the types for the context value
export type Message = {
    role: string;
    content: string;
};

type ChatContextType = {
    chatId: ObjectId | undefined;
    setChatId: React.Dispatch<React.SetStateAction<ObjectId | undefined>>;
    conversation: Message[];
    setConversation: React.Dispatch<React.SetStateAction<Message[]>>;
};

// Create the context with default values
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Create a provider component
export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [chatId, setChatId] = useState<ObjectId>();
    const [conversation, setConversation] = useState<Message[]>([{
        role: "assistant",
        content: "Hello, Siddharth. I'm here to assist you with any HR-related inquiries. How can I help you today?"
    }]);

    return (
        <ChatContext.Provider value={{ chatId, setChatId, conversation, setConversation }}>
            {children}
        </ChatContext.Provider>
    );
};

// Custom hook to use the chat context
export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
