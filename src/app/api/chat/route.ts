import Chat from "@/models/chatModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const { userId, conversation } = await req.json();
        console.log(userId);

        // const data = await Chat.create({

        // });
        return NextResponse.json(conversation);
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' });
    }
}