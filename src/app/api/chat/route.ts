import Chat from "@/models/chatModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const { userId, conversation } = await req.json();

        return NextResponse.json(conversation);
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' });
    }
}

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const userId = searchParams.get('userId')

        const data = await Chat.find({ userId }).select({ chatName: 1 }).sort({ _id: -1 });
        return NextResponse.json({ data });
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500, });
    }
}