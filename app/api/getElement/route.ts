import { connectToDB } from '@/lib/mongodb';
import  Element from "@/models/element";
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest, response: NextResponse) => {
    try {
        await connectToDB();

        const data = await request.json()
        const elementId = data.id

        const elementData = await Element.findById( elementId );

        return new Response(JSON.stringify(elementData), { status: 200 });
    } catch (error) {
        console.error("Failed to fetch element:", error);
        return new Response("Failed to fetch element", { status: 500 });
    }
};