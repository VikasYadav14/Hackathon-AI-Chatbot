import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai'; // Replace with the actual OpenAI client library you use

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Define the type for the messages expected by the OpenAI API
interface ChatCompletionRequestMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

// Define the type for conversation state
interface ConversationState {
    [key: string]: {
        history: ChatCompletionRequestMessage[];
    };
}

let conversationState: ConversationState = {};

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const { userId, message } = await req.json();
        console.log(userId);

        // Initialize state if not already present
        if (!conversationState[userId]) {
            conversationState[userId] = { history: [] };
        }

        const history = conversationState[userId].history;
        let responseMessage = '';

        try {
            // Append user message to history
            history.push({ role: 'user', content: message });

            // Get response from OpenAI based on the conversation history
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: 'system', content: 'You are a helpful assistant who engages in conversation and provides relevant responses.' },
                    ...history
                ]
            });

            if (completion && completion.choices && completion.choices[0] && completion.choices[0].message && completion.choices[0].message.content) {
                responseMessage = completion.choices[0].message.content.trim();
            } else {
                responseMessage = "I'm having trouble understanding your mood. Can you tell me more?";
            }

            // Append assistant's response to history
            history.push({ role: 'assistant', content: responseMessage });

            // Update the conversation history
            conversationState[userId].history = history;
        } catch (error) {
            console.error('Error with OpenAI API:', error);
            responseMessage = "I'm having trouble understanding your mood. Can you tell me more?";
        }

        return NextResponse.json({ message: responseMessage });

    } catch (error) {
        console.error('Error parsing request body:', error);
        return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }
}
