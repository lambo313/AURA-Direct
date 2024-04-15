import { connectToDB } from '@/lib/mongodb';
import  TarotCard, { ITarotCard } from "@/models/TarotCards";
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest, response: NextResponse) => {
    try {
        // Connect to the database
        await connectToDB();

        const data = await request.json()
        const cardId = data.id
        // console.log("FETCHING CARD ID: ", cardId)
        
        // Fetch tarot card data from the database
        const tarotCardData = await TarotCard.findById( cardId );
        // console.log('card data: ', tarotCardData)

        // Return the fetched data as a response
        return new Response(JSON.stringify(tarotCardData), { status: 200 });
    } catch (error) {
        // Handle errors
        console.error("Failed to fetch tarot cards:", error);
        return new Response("Failed to fetch tarot cards", { status: 500 });
    }
};
