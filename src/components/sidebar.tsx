"use client";
import React, { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import { Message, useChat } from '@/context/chatContext'; // Ensure correct path
import { ObjectId } from 'mongoose';


const fetcher = (url: string) => axios.get(url).then(res => res.data);

const Sidebar = () => {
  const { setChatId, setConversation } = useChat();
  const [hovered, setHovered] = useState(false)
  const [id, setId] = useState<ObjectId>()
  const { data, error, isLoading } = useSWR('/api/chat?userId=1', fetcher);

  const createNewChat = async () => {
    setChatId(undefined),
      setConversation([{
        role: "assistant",
        content: "Hello, Siddharth. I'm here to assist you with any HR-related inquiries. How can I help you today?"
      }]);
  };
  const deleteChat = async () => {
    try {
      const response = await axios.delete(`/api/chat/${id}`);

      if (response.status === 200) {
        mutate('/api/chat?userId=1');
        setChatId(undefined),
          setConversation([{
            role: "assistant",
            content: "Hello, Siddharth. I'm here to assist you with any HR-related inquiries. How can I help you today?"
          }]);
      }
    } catch (err) {
      console.error('Error fetching chat:', err);
    }
  };

  const setOldChat = async (id: ObjectId) => {
    try {
      const response = await axios.get(`/api/chat/${id}`);
      const chat = response.data.data;

      if (response.status === 200 && chat) {
        setChatId(chat._id);
        console.log(chat.conversation);

        setConversation(chat.conversation);
      }
    } catch (err) {
      console.error('Error fetching chat:', err);
    }
  };

  return (
    <div className="bg-gray-700 text-white w-1/5 h-screen p-4">
      <div className="mt-20">
        <div className="flex justify-between items-center text-base font-normal cursor-pointer rounded-md px-4 py-2 hover:bg-gray-800" onClick={createNewChat}>
          <p>New Chat</p>
          <FaPlus className="text-gray-300 ml-2 w-4 h-4" />
        </div>
        <div className="my-4 px-4 py-2">Conversation History</div>
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
              <div className="flex justify-between items-center text-sm mb-2 cursor-pointer rounded-md px-4 py-2 hover:bg-gray-800"
                onClick={() => setOldChat(d._id)}
                onMouseEnter={() => {
                  setHovered(true);
                  setId(d._id);
                }}
                onMouseLeave={() => setHovered(false)}>
                <p>{d.chatName}</p>
                {(hovered && id == d._id) && <FaTrash className="ml-2 w-3 h-3 hover:text-red-400"
                  onClick={deleteChat} />}
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
