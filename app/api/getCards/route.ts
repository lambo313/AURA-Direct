import { connectToDB } from '@/lib/mongodb';
import  TarotCard, { ITarotCard } from "@/models/TarotCards";
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest, response: NextResponse) => {
    try {
        // Connect to the database
        await connectToDB();

        // const data = await request.json()
        // const cardIds = data.cardIds
        // console.log("CARD IDS: ", cardIds)
        
        // Fetch tarot card data from the database
        const tarotDeckData = await TarotCard.find();


        // Return the fetched data as a response
        return new Response(JSON.stringify(tarotDeckData), { status: 200 });
    } catch (error) {
        // Handle errors
        console.error("Failed to fetch tarot cards:", error);
        return new Response("Failed to fetch tarot cards", { status: 500 });
    }
};