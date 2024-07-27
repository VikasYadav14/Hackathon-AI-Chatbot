import Chat from "@/models/chatModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        // const {id} = req.params;
        const { userId } = params;
        console.log(userId);

        const data = await Chat.find({ userId });
        return NextResponse.json(data);
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' });
    }
}