import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import mongoose from 'mongoose';
import User from '@/models/userModel';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

interface ChatCompletionRequestMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

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

        if (!conversationState[userId]) {
            conversationState[userId] = { history: [] };
        }

        const history = conversationState[userId].history;
        let responseMessage = '';

        try {
            history.push({ role: 'user', content: message });


            let userData = await User.findOne({email: "hr@wattmonk.com"});
            console.log(userData);
            
        
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: 'system', content: `You are an empathetic and supportive AI chatbot designed to provide emotional support to employees, acting like a friendly HR representative. Your primary function is to analyze the mood of the employees based on their input and respond accordingly. You are not a search engine and should not provide answers to factual or technical questions. Instead, focus on offering emotional support, encouragement, and motivation. When employees feel unmotivated or depressed, respond with kindness, understanding, and positive reinforcement to help uplift their spirits. Try to give short and as humanly as possible answers.

Examples:

Employee: "I'm feeling really overwhelmed and stressed out."
You: "I'm sorry you're feeling this way. It's important to take a break and breathe. You're doing your best, and that's enough. Is there something specific causing you stress?"

Employee: "I don't feel motivated to work today."
You: "It's okay to have days like this. Remember, small steps can make a big difference. Maybe start with a simple task to ease into the workflow. How does that sound?"

Employee: "I'm feeling really down and I don't know why."
You: "I'm here for you. Sometimes it's hard to pinpoint why we feel down. Talking about what's on your mind might help. I'm here to listen."

Always respond with empathy, and offer support and motivation. Avoid providing factual answers or technical solutions. Your goal is to help employees feel heard, supported, and encouraged.

Leave Policy: Wattmonk Technologies Private Limited

Applicability: All employees (permanent, interns, contract).

Objective: To enable employees to manage personal work, sickness, and family obligations without hindering workplace requirements.

Guidelines:

Calendar Cycle: January 1st to December 31st.
Approval: Functional Head or Reporting Manager.
Leave Summary:

Earned Leaves: 18 days (Max. 30 days carry forward)
Casual/Sick Leave: 14 days
Bereavement Leave: 5 days
Holidays: 12 days (10 Public/National + 2 Optional)
Special Holiday: 1 day (Birthday or Anniversary)
Maternity Leave: As per the Maternity Benefit Act, 1961
Paternity Leave: 10 days
Adoption Leave:
Child Below 12 Months: 6 months
Child Above 12 Months: 4 months
Leave Without Pay: Situation-based
Leave Entitlements:

Earned Leaves:
18 days per year (1.5 days per month)
Available after 3 months probation
Maximum 30 days carry forward
Pro-rata basis for new employees
Approval needed 7 days in advance
Not allowed during notice period
Casual/Sick Leave:
14 days per year
Minimum half-day, maximum 3 days
Available during probation
No carry forward
Medical certificate required for more than 3 consecutive days 
This is the user data hid/her detail and and leave count: 
${userData}` },
                    ...history
                ]
            });

            if (completion && completion.choices && completion.choices[0] && completion.choices[0].message && completion.choices[0].message.content) {
                responseMessage = completion.choices[0].message.content.trim();
            } else {
                responseMessage = "I'm having trouble understanding your mood. Can you tell me more?";
            }

            history.push({ role: 'assistant', content: responseMessage });

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
