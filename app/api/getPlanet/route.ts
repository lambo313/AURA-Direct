import { connectToDB } from '@/lib/mongodb';
import  Planet from "@/models/planet";
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest, response: NextResponse) => {
    try {
        await connectToDB();

        const data = await request.json()
        const planetId = data.id

        const planetData = await Planet.findById( planetId );

        return new Response(JSON.stringify(planetData), { status: 200 });
    } catch (error) {
        console.error("Failed to fetch planet:", error);
        return new Response("Failed to fetch planet", { status: 500 });
    }
};