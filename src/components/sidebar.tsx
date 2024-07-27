"use client";
import { conversationState } from '@/commonstore';
import React, { useEffect, useState, useRef } from 'react';
import { ChatCompletionRequestMessage } from '@/commonstore'; // Adjust import if necessary
import { FaPlus } from 'react-icons/fa';

interface Conversation {
  date: string;
  messages: ChatCompletionRequestMessage[];
}

const Sidebar = () => {
  const [history, setHistory] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const userId = useRef<string | undefined>(process.env.NEXT_PUBLIC_USER_ID); // Replace with actual user ID

  useEffect(() => {
    const extractHistory = () => {
      // Convert conversationState into an array of Conversations
      const extractedHistory = Object.keys(conversationState).map(key => ({
        date: new Date(key).toLocaleDateString(), // Format date
        messages: conversationState[key].history
      }));
      setHistory(extractedHistory);
    };

    extractHistory();

    // Uncomment this section if fetching from an API:
    // const fetchHistory = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await fetch(`/api/history?userId=${userId.current}`);
    //     const data = await response.json();
    //     if (response.ok) {
    //       setHistory(data.history);
    //     } else {
    //       setError(data.error);
    //     }
    //   } catch (error) {
    //     setError('Error fetching history.');
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchHistory();
  }, []);

  const createNewChat = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/chat`);
      const data = await response.json();
      if (response.ok) {
        setHistory(data.history);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Error fetching history.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-800 text-white w-64 h-screen p-4">
      <div className="flex justify-between items-center text-base font-medium">
        <img
          src={'https://speed.wattmonk.com/assets/images/logo/wattmonklogo.png'}
          alt="wattmonk logo"
          className="w-8 h-8 rounded-full"
        />
        <p>Wattmonk Technologies</p>
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center text-base font-normal cursor-pointer"
          onClick={createNewChat}>
          <p>New Chat</p>
          <FaPlus className="text-gray-300 ml-2 w-4 h-4" />
        </div>
        <div className="mb-2">Conversation History</div>
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : history.length > 0 ? (
          history.map((conversation, index) => {
            // Get the first message for the heading
            const firstMessage = conversation.messages[0]?.content || 'No messages';

            return (
              <div key={index} className="mt-4">
                <div className="text-lg font-bold mb-2">{firstMessage}</div> {/* Heading with the first message */}
                <div className="text-gray-400 mb-2">{conversation.date}</div>
                <ul className="space-y-2">
                  {conversation.messages.map((message, idx) => (
                    <li key={idx} className="text-gray-400">
                      {message.role === 'user' ? 'You' : message.role === 'assistant' ? 'Assistant' : 'System'}: {message.content}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
        ) : (
          <div className="text-gray-400">No conversation history found.</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
