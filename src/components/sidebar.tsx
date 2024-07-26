"use client"
import React, { useEffect, useState, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Conversation {
  date: string;
  messages: Message[];
}

const Sidebar = () => {
  const [history, setHistory] = useState<Conversation[]>([]);
  const userId = useRef(process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY); // Simple user ID for session management

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/history?userId=${userId.current}`);
        const data = await response.json();
        if (response.ok) {
          setHistory(data.history);
        } else {
          console.error('Error retrieving history:', data.error);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="bg-gray-800 text-white w-64 h-screen p-4">
      <div className="flex justify-between items-center text-base font-medium">
        <img src={'https://speed.wattmonk.com/assets/images/logo/wattmonklogo.png'} alt="wattmonk logo" className="w-8 h-8 rounded-full" />
        <p>Wattmonk Technologies</p>
      </div>
      <div className="mt-4">
        <div className="mb-2">Conversation History</div>
        {history.length > 0 ? (
          history.map((conversation, index) => (
            <div key={index} className="mt-4">
              <div className="mb-2">{conversation.date}</div>
              <ul className="space-y-2">
                {conversation.messages.map((message, idx) => (
                  <li key={idx} className="text-gray-400">
                    {message.role === 'user' ? 'You' : 'Assistant'}: {message.content}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <div className="text-gray-400">No conversation history found.</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
