"use client"
import React, { useRef, useState, useEffect } from 'react';
import { FaRobot, FaTelegramPlane, FaUser } from 'react-icons/fa';

interface Message {
    sender: string;
    message: string;
}

const MainContent: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [conversation, setConversation] = useState<Message[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [conversation]);

    const userId = useRef(process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY); // Simple user ID for session management

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSendMessage = async (userInput: string) => {
        if (!userInput.trim()) return;

        // Add user message to conversation
        setConversation((prevConversation) => [
            ...prevConversation,
            { sender: 'You', message: userInput },
        ]);

        // Send message to backend
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId.current, message: userInput }),
        });
        const result = await response.json();

        // Add bot response to conversation
        setConversation((prevConversation) => [
            ...prevConversation,
            { sender: 'Bot', message: result.message },
        ]);

        // Scroll to bottom
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    return (
        <div className="flex flex-col h-[100vh] p-4">
            <div ref={chatContainerRef} className="flex-grow space-y-4 overflow-y-scroll bg-gray-100 p-4 rounded-md">
                {conversation.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex items-start ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.sender !== 'You' && (
                            <FaRobot className="text-blue-500 mr-2" /> // Bot icon on the left
                        )}
                        <div className={`message p-2 rounded-md ${msg.sender === 'You' ? 'bg-green-200 text-right' : 'bg-blue-200 text-left'}`}>
                            {msg.message}
                        </div>
                        {msg.sender === 'You' && (
                            <FaUser className="text-green-500 ml-2" /> // User icon on the right
                        )}
                    </div>
                ))}
            </div>
            <div className="flex mt-2">
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
    );
};

export default MainContent;
