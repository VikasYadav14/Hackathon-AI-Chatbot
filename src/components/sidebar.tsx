"use client";
import React from 'react';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import useSWR from 'swr';
import { Message, useChat } from '@/context/chatContext'; // Ensure correct path
import { ObjectId } from 'mongoose';


const fetcher = (url: string) => axios.get(url).then(res => res.data);

const Sidebar = () => {
  const { setChatId, setConversation } = useChat();

  const { data, error, isLoading } = useSWR('/api/chat?userId=1', fetcher);

  const createNewChat = async () => {
    setChatId(undefined),
      setConversation([]);
  };

  const setOldChat = async (id: ObjectId) => {
    try {
      const response = await axios.get(`/api/chat/${id}`);
      const chat = response.data.data;

      if (response.status === 200 && chat) {
        setChatId(chat._id);
        setConversation(chat.conversation);
      }
    } catch (err) {
      console.error('Error fetching chat:', err);
    }
  };

  return (
    <div className="bg-gray-700 text-white w-1/5 h-screen p-4">
      <div className="mt-20">
        <div className="flex justify-between items-center text-base font-normal cursor-pointer" onClick={createNewChat}>
          <p>New Chat</p>
          <FaPlus className="text-gray-300 ml-2 w-4 h-4" />
        </div>
        <div className="my-4">Conversation History</div>
        {isLoading ? (
          <div className="text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-red-500">Error: {error.message}</div>
        ) : data?.data.length > 0 ? (
          data.data.map((d: { _id: ObjectId; chatName: string }, index: number) => (
            <div key={index} className="mt-2">
              {index > 0 && (
                <div className="border-t border-white my-2" />
              )}
              <div className="text-sm mb-2 cursor-pointer" onClick={() => setOldChat(d._id)}>
                {d.chatName}
              </div>
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
