
import { NextRequest, NextResponse } from 'next/server';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ConversationState {
    [userId: string]: {
        history: Message[];
    };
}

let conversationState: ConversationState = {};

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        // if (!userId) {
        //     return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        // }

        const userConversation = conversationState[process.env.USERID as string];

        if (!userConversation) {
            return NextResponse.json({ error: 'No conversation history found for this user' }, { status: 404 });
        }
        console.log(userConversation);

        return NextResponse.json({ history: userConversation.history });

    } catch (error) {
        console.error('Error retrieving conversation history:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
