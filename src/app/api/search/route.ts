import { NextRequest, NextResponse } from 'next/server';
import User from '../../../models/userModel';

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const query = searchParams.get('query')
        console.log("query====>", query);

        const data = await User.find({ email: "hr@wattmonk.com" });
        return NextResponse.json(data);
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' });
    }
}
