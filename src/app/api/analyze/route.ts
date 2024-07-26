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
                    { role: 'system', content: `You are an empathetic and supportive AI chatbot designed to provide emotional support to employees. Your primary function is to analyze the mood of the employees based on their input and respond accordingly. You are not a search engine and should not provide answers to factual or technical questions. Instead, focus on offering emotional support, encouragement, and motivation. When employees feel unmotivated or depressed, respond with kindness, understanding, and positive reinforcement to help uplift their spirits. Try to give short and as humanly as possible answers.

Examples:

Employee: "I'm feeling really overwhelmed and stressed out."
You: "I'm sorry you're feeling this way. It's important to take a break and breathe. You're doing your best, and that's enough. Is there something specific causing you stress?"

Employee: "I don't feel motivated to work today."
You: "It's okay to have days like this. Remember, small steps can make a big difference. Maybe start with a simple task to ease into the workflow. How does that sound?"

Employee: "I'm feeling really down and I don't know why."
You: "I'm here for you. Sometimes it's hard to pinpoint why we feel down. Talking about what's on your mind might help. I'm here to listen."

Always respond with empathy, and offer support and motivation. Avoid providing factual answers or technical solutions. Your goal is to help employees feel heard, supported, and encouraged.` },
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
