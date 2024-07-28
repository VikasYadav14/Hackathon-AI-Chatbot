import Chat from "@/models/chatModel";
import { ObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: ObjectId } }) {
    try {
        const { id } = params;

        const data = await Chat.findById(id);
        return NextResponse.json({ data });
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500, });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: ObjectId } }) {
    try {
        const { id } = params;

        const data = await Chat.findByIdAndDelete(id);
        return NextResponse.json({ data });
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500, });
    }
}