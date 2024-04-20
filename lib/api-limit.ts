import { auth, currentUser } from "@clerk/nextjs";
import { MAX_FREE_COUNTS } from "@/constants";
import UserApiLimit from "@/models/userApiLimit"; // Import the UserApiLimit model
import { connectToDB } from "@/lib/mongodb"; // Import the connectToDB function

export const increaseApiLimit = async () => {
    
    const { userId } = await auth();
    const user = await currentUser();
    const email = user?.primaryEmailAddressId
    const id = email
    
    if (!userId) {
        return;
    }
    
    try {
        // Connect to MongoDB
        await connectToDB();

        let userApiLimit = await UserApiLimit.findOne({ userId });

        if (userApiLimit) {
            userApiLimit.count += 1;
            userApiLimit.createdAt = userApiLimit.createdAt
            await userApiLimit.save();
        } else {
            await UserApiLimit.create({ userId, count: 1 });
        }
    } catch (error) {
        console.error("Error increasing API limit:", error);
    }
};

export const checkApiLimit = async () => {
    
    const { userId } = auth();
    
    if (!userId) {
        return false;
    }
    
    try {
        // Connect to MongoDB
        await connectToDB();

        const userApiLimit = await UserApiLimit.findOne({ userId });

        return !userApiLimit || userApiLimit.count < MAX_FREE_COUNTS;
    } catch (error) {
        console.error("Error checking API limit:", error);
        return false;
    }
};

export const getApiLimitCount = async () => {
    
    const { userId } = auth();
    
    if (!userId) {
        return 0;
    }
    
    try {
        // Connect to MongoDB
        await connectToDB();
        
        const userApiLimit = await UserApiLimit.findOne({ userId });

        return userApiLimit ? userApiLimit.count : 0;
    } catch (error) {
        console.error("Error getting API limit count:", error);
        return 0;
    }
};