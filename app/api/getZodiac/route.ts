import { connectToDB } from '@/lib/mongodb';
import  Zodiac from "@/models/zodiac";
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest, response: NextResponse) => {
    try {
        await connectToDB();

        const data = await request.json()
        const zodiacId = data.id

        const zodiacData = await Zodiac.findById( zodiacId );

        return new Response(JSON.stringify(zodiacData), { status: 200 });
    } catch (error) {
        console.error("Failed to fetch zodiac:", error);
        return new Response("Failed to fetch zodiac", { status: 500 });
    }
};
