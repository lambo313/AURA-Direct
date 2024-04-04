import {auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb"; // Import the connectToDB function

import UserSubscription from "@/models/userSubscription"; // Import the UserSubscription model
import { stripe } from "@/lib/stripe";

import { absoluteUrl } from "@/lib/utils";

const settingsUrl = absoluteUrl("/settings");

export async function GET() {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", {status: 401})
        }
        
        await connectToDB();
        
        const userSubscription = await UserSubscription.findOne({ userId });

        if (userSubscription && userSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsUrl,
            });

            return new NextResponse(JSON.stringify({ url: stripeSession.url }))
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data: {
                        currency: "USD",
                        product_data: {
                            name: "AURA Direct Pro",
                            description: "Unlimited AI Generations",
                        },
                        unit_amount: 2000,
                        recurring: {
                            interval: "month"
                        }
                    },
                    quantity: 1,
                }
            ],
            metadata: {
                userId
            },
        });

        return new NextResponse(JSON.stringify({ url: stripeSession.url }));


    } catch (error) {
        console.log("STRIPE_ERROR", error);
        return new NextResponse("Internal error", {status: 500 })
    }
}