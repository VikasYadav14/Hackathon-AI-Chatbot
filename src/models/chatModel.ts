import mongoose, { Document, Model, Schema } from 'mongoose';

// Define TypeScript interface for User document
interface IChat extends Document {
    chatName: string;
    userId: string;
    conversation: object;
}

// Define the User Schema
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
        type: Object,
        required: true,
    },
});

// Avoid model overwrite error
const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);

export default Chat;
