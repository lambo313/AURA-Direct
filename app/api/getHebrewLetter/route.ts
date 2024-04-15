import { connectToDB } from '@/lib/mongodb';
import  HebrewLetter from "@/models/hebrewLetter";
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest, response: NextResponse) => {
    try {
        await connectToDB();

        const data = await request.json()
        const hebrewLetterId = data.id

        const hebrewLetterData = await HebrewLetter.findById( hebrewLetterId );

        return new Response(JSON.stringify(hebrewLetterData), { status: 200 });
    } catch (error) {
        console.error("Failed to fetch hebrew letter:", error);
        return new Response("Failed to fetch hebrew letter", { status: 500 });
    }
};
