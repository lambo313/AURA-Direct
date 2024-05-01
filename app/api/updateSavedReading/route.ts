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
        const readingToUpdate = await TarotReading.findOneAndUpdate({_id: savedReadingId}, {title: data.title, notes: data.notes})
        // if (readingToUpdate) {
        //     readingToUpdate.title = data.title;
        //     readingToUpdate.notes = data.notes
        //     await readingToUpdate.save();
        // } 
  
        // Return the updated reading as a response
        return new Response(JSON.stringify(readingToUpdate), { status: 200 });
    } catch (error) {
        // Handle errors
        console.error("Failed to update tarot reading:", error);
        return new Response("Failed to update tarot reading", { status: 500 });
    }
  };