export interface ChatCompletionRequestMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface ConversationState {
    [key: string]: {
        history: ChatCompletionRequestMessage[];
    };
}

export const conversationState: ConversationState = {};