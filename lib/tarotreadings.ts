"use server"

// import { auth } from "@clerk/nextjs";
import TarotReading, { ITarotReadingDocument } from "@/models/tarotReading"; // Assuming this is your tarot reading model
import { connectToDB } from "@/lib/mongodb"; // Your MongoDB connection utility

// Function to save a tarot reading to the database
export const saveReading = async (readingData: ITarotReadingDocument) => {
    const userId = "";
  
    try {
      // Construct the request body
      const requestBody = {
        userId: userId,
        cards: readingData.cards,
        question: readingData.question,
        response: readingData.response,
        // readingDate: new Date().toISOString(), 
      };

      console.log("Request Body: ", requestBody)
  
      // Send a POST request to the server endpoint
      const response = await fetch("http://localhost:3000/api/saveReading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save reading"); // Throw an error if request fails
      }
  
      // Return the saved reading object
      // return response.json();
    } catch (error) {
      console.error("Error saving tarot reading:", error);
      throw error; // Rethrow or handle as needed
    }
  };
  


// Function to retrieve saved tarot readings for a specific user
export const getSavedReadings = async (userId: string) => {
    try {
        await connectToDB(); // Ensure you're connected to the database

        const readings = await TarotReading.find({ userId }).sort({ readingDate: -1 }); // Get readings sorted by newest first
        return readings; // Return the array of readings
    } catch (error) {
        console.error("Error retrieving saved tarot readings:", error);
        throw error; // Rethrow or handle as needed
    }
};


// Function to delete a tarot reading from the database
export const deleteReading = async (userId: string, readingId: string) => {
    try {
        await connectToDB(); // Ensure you're connected to the database

        // Attempt to find and delete the reading, ensuring it belongs to the requesting user
        const deletionResult = await TarotReading.deleteOne({ _id: readingId, userId });

        if (deletionResult.deletedCount === 0) {
            // No document was deleted; this could mean either the reading didn't exist or it didn't belong to the user
            throw new Error("Reading not found or user unauthorized to delete this reading.");
        }

        return { success: true, message: "Reading successfully deleted." };
    } catch (error) {
        console.error("Error deleting tarot reading:", error);
        throw error; // Rethrow or handle as needed
    }
};

// Additional suggestions:
// - Consider implementing pagination in `getSavedReadings` to handle large numbers of readings.
// - Ensure proper authentication and authorization checks are in place before allowing a user to save or retrieve readings.
// - Depending on your application's requirements, you may also want to implement update and delete functionality for readings.
