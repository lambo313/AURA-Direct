import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb"; // Import the connectToDB function

import UserSubscription from "@/models/userSubscription"; // Import the UserSubscription model

import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {

    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, {status: 400})   
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        if (!session?.metadata?.userId) {
            return new NextResponse("User id is required", {status: 400})
        }

        try {
            // Connect to MongoDB
            await connectToDB();
            
            await UserSubscription.create({
                id: session?.metadata?.userId,
                userId: session?.metadata?.userId,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                ),
            });
        } catch (error) {
            console.error("Error creating user subscription:", error);
            return new NextResponse("Error creating user subscription", { status: 500 });
        }
    }

    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        try {
            // Connect to MongoDB
            await connectToDB();

            console.log("Updating Subscription Now!")

            await UserSubscription.updateOne({
                stripeSubscriptionId: subscription.id,
            }, {
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                ),
            });
        } catch (error) {
            console.error("Error updating user subscription:", error);
            return new NextResponse("Error updating user subscription", { status: 500 });
        }
    }
    
    return new NextResponse(null, { status: 200 });
}
