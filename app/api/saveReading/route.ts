// Assuming this file is located at /pages/api/saveReading.ts in your Next.js project
import { auth } from "@clerk/nextjs";
import TarotReading, { ITarotReadingDocument } from "@/models/tarotReading";
import { connectToDB } from '@/lib/mongodb';
import { NextRequest } from "next/server";

import { headers } from 'next/headers'

// Define a handler function that adheres to Next.js API routes patterns
export const POST = async (  req: Request, res: Response) => {
  if (req.method !== 'POST') {
    // Method Not Allowed
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    // Connect to the database
    await connectToDB();

    // Assuming req.body is already parsed as JSON by Next.js
    const readingData: ITarotReadingDocument = await req.json();
    // console.log('Reading data received:', readingData);
    
    // Create a new Tarot reading document
    const savedReading = await TarotReading.create(readingData);

    // Respond with the created document
    return new Response(JSON.stringify(savedReading), { status: 201 });
  } catch (error) {
    console.error('Error saving tarot reading:', error);
    // Return a server error response
    return new Response('Failed to save reading', { status: 500 })
  }
}


export const GET = async (request: NextRequest) => {
  try {
      // Connect to the database
      await connectToDB();

      const { userId } = await auth();
      
      // Fetch tarot card data from the database
      const savedReadingsData = await TarotReading.find({ userId: userId }).exec();

      // Return the fetched data as a response
      return new Response(JSON.stringify(savedReadingsData), { status: 200 });
  } catch (error) {
      // Handle errors
      console.error("Failed to fetch tarot cards:", error);
      return new Response("Failed to fetch tarot cards", { status: 500 });
  }
};