import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

import { connectToDB } from '@/lib/mongodb';
import TarotReading from '@/models/tarotReading'; // Import your TarotReading model


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const instructionMessage = {
    role: "system",
    content: "You are a tarot reader. You will be given a series of cards to analyze with the following template(comma separated string): Card1=Past, Card2=Challenge, Card3=Advice, Card4=Outcome. You must provide your analysis answering only in markdown-like snippets - Use code comments for explanations. After the makrdown-like snippets, end your response with a detailed summary that paints a vivid picture of the entire reading."
}

export async function POST(
    req: Request
)   {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        if (!openai.apiKey) {
            return new NextResponse("OpenAI API Key not configured", { status: 500})
        }

        if (!messages) {
            return new NextResponse("Messages are required", { status: 400})
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();

        if (!freeTrial && !isPro ) {
            return new NextResponse("Free trial has expired.", {status: 403});
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [instructionMessage, ...messages]
        });

        if (!isPro) {
            await increaseApiLimit();
            }

        return NextResponse.json(response.choices[0].message);

    } catch (error) {
        console.log("[CODE_ERROR]", error);
        return new NextResponse("Internal error", { status: 500})
    }
};


// export const GET = async (request: any) => {
//     try {
//         // Connect to the database
//         await connectToDB();
        
//         // Fetch tarot reading data from the database
//         const tarotReadingData = await TarotReading.find().exec();

//         // Return the fetched data as a response
//         return new Response(JSON.stringify(tarotReadingData), { status: 200 });
//     } catch (error) {
//         // Handle errors
//         console.error("Failed to fetch tarot readings:", error);
//         return new Response("Failed to fetch tarot readings", { status: 500 });
//     }
// };
