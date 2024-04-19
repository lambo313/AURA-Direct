// import { auth } from "@clerk/nextjs";
// import { NextResponse } from "next/server";
// import { OpenAI } from "openai";

// import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
// import { checkSubscription } from "@/lib/subscription";
import { connectToDB } from '@/lib/mongodb';
import  TarotCard, { ITarotCard } from "@/models/TarotCards";

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });


// export async function POST(
//     req: Request
// )   {
//     try {
//         const { userId } = await auth();
//         const body = await req.json();
//         const { messages } = body;

//         if (!userId) {
//             return new NextResponse("Unauthorized", {status: 401})
//         }

//         if (!openai.apiKey) {
//             return new NextResponse("OpenAI API Key not configured", { status: 500})
//         }

//         if (!messages) {
//             return new NextResponse("Messages are required", { status: 400})
//         }

//         const freeTrial = await checkApiLimit();
//         const isPro = await checkSubscription();

//         if (!freeTrial && !isPro ) {
//             return new NextResponse("Free trial has expired.", {status: 403});
//         }

//         const response = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages
//         });

//         if (!isPro) {
//         await increaseApiLimit();
//         }

//         return NextResponse.json(response.choices[0].message);

//     } catch (error) {
//         console.log("[CONVERSATION_ERROR]", error);
//         return new NextResponse("Internal error", { status: 500})
//     }
// };



export const GET = async (request: any) => {
    try {
        // Connect to the database
        await connectToDB();
        
        // Fetch tarot card data from the database
        const tarotDeckData = await TarotCard.find().sort({_id: 1 });

        // Return the fetched data as a response
        return new Response(JSON.stringify(tarotDeckData), { status: 200 });
    } catch (error) {
        // Handle errors
        console.error("Failed to fetch tarot cards:", error);
        return new Response("Failed to fetch tarot cards", { status: 500 });
    }
};