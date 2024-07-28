import Chat from "@/models/chatModel";
import { ObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: ObjectId } }) {
    try {
        // const {id} = req.params;
        const { id } = params;

        const data = await Chat.findById(id);
        return NextResponse.json({ data });
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' });
    }
}