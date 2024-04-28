import TarotReading, { ITarotReadingDocument } from "@/models/tarotReading";
import { connectToDB } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest, response: NextResponse) => {
    try {
        // Connect to the database
        await connectToDB();

        const data = await request.json(); // This destructures 'id' from the query parameters and renames it to 'savedReadingId'
        const savedReadingId = data.id
        
        // Fetch tarot card data from the database
        const deletedReadingsData = await TarotReading.findByIdAndDelete(savedReadingId)
  
        // Return the fetched data as a response
        return new Response(JSON.stringify(deletedReadingsData), { status: 200 });
    } catch (error) {
        // Handle errors
        console.error("Failed to delete tarot reading:", error);
        return new Response("Failed to delete tarot reading", { status: 500 });
    }
  };