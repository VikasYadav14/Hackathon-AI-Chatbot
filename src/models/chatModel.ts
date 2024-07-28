import mongoose, { Document, Model, Schema } from 'mongoose';

// Define TypeScript interface for Chat document
interface IChat extends Document {
    chatName: string;
    userId: string;
    conversation: {
        role: string;
        content: string;
    }[];
}

// Define the Chat Schema
const ChatSchema: Schema<IChat> = new Schema({
    chatName: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    conversation: {
        type: [
            {
                role: { type: String, required: true },
                content: { type: String, required: true },
            },
        ],
        required: true,
    },
});

// Avoid model overwrite error in development
const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);

export default Chat;
