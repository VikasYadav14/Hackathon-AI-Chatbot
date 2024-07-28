"use client"
import { useChat } from '@/context/chatContext';
import axios from 'axios';
import { ObjectId } from 'mongodb';
import React, { useRef, useState, useEffect } from 'react';
import { FaRobot, FaTelegramPlane, FaUser } from 'react-icons/fa';
import { mutate } from 'swr';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const MainContent: React.FC = () => {
    const { chatId, setChatId, conversation, setConversation } = useChat();

    const [userInput, setUserInput] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }

    }, [conversation]);

    const handleSendMessage = async (userInput: string) => {
        if (!userInput.trim()) return;

        // Add user message to conversation
        setConversation((prevConversation) => [
            ...prevConversation,
            { role: 'user', content: userInput },
        ]);

        // Send message to backend
        const response = await axios.post('/api/analyze', { chatId, message: userInput }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status === 200 && !chatId) {
            mutate('/api/chat?userId=1');
        }

        // Add bot response to conversation
        setConversation((prevConversation) => [
            ...prevConversation,
            { role: 'assistant', content: response.data.message },
        ]);
        setChatId(response.data.chatId)

        // Scroll to bottom
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    return (
        <div className="mt-20 flex flex-col w-4/5 p-4 justify-between">
            <div ref={chatContainerRef} className="overflow-y-scroll p-4 rounded-md">
                {conversation.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex mb-2 items-center ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.role !== 'user' && (
                            <div className='w-6 h-6'>
                                <FaRobot className="text-blue-500 mr-2 " />
                            </div>
                        )}
                        <div className={`message p-2 rounded-md max-w-5xl ${msg.role === 'user' ? 'bg-green-200 text-right' : 'bg-blue-200 text-left'}`}>
                            {msg.content}
                        </div>
                        {msg.role === 'user' && (
                            <FaUser className="text-green-500 ml-2 w-4 h-4" /> // User icon on the right
                        )}
                    </div>
                ))}
            </div>
            <div className=''>
                <div className="flex mt-2 h">
                    <input
                        type="text"
                        id="userInput"
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md mr-2"
                        placeholder="Type your message..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && userInput.trim() !== '') {
                                handleSendMessage(userInput);
                                setUserInput('');
                            }
                        }}
                    />
                    <button
                        className="bg-blue-500 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
                        onClick={() => {
                            if (userInput.trim() !== '') {
                                handleSendMessage(userInput);
                                setUserInput('');
                            }
                        }}
                    >
                        <FaTelegramPlane />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MainContent;
