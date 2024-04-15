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

// const instructionMessage = {
//     role: "system",
//     content: "You are a tarot reader being given instructions to perform your tarot reading in the following sequential format: The main components of the information you will receive is a data string seperated by a dash(-). The first item on the list is considered the Topic/Theme of the entire reading - therefore, your first task is to stick to the Topic(if the Topic is specified as General, no need to mention the Topic, otherise, stick to, if not, emphasize the Topic). The seconde item on the list is considered the Dealt Cards - Your second task is to analyze the Dealt Cards(a comma separated string that you will split into a list) with the following template: index1=Past, index2=Challenge, index3=Advice, index4=Outcome. You must provide your analysis as a list(potentially, nested) with bullet points included and bold the indexes. After each card is analyzed - end the reeading with a response that is a detailed summary painting a vivid picture of the entire reading - you are looking to conclude the reading by connecting the card meanings together to get the overall reading analysis in regards to the Topic."
// }

export async function POST(
    req: Request
)   {
    try {
        const { userId } = auth();
        const body = await req.json();
        // console.log('BODY!: ', body)
        const { messages, instructions } = body;

        // console.log("MESSAGES: ", messages)
        // console.log("INSTRUCTIONS: ", instructions)

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
            messages: [instructions, ...messages]
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
