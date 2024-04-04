import { auth } from "@clerk/nextjs";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ITarotCard } from "@/models/TarotCards";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

// tarotUtils.js

// Function to shuffle the tarot deck
export const shuffleDeck = (deck: ITarotCard[]): ITarotCard[] => {
  const shuffledDeck = [...deck]; // Create a copy of the deck
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
      [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]]; // Swap elements
  }
  return shuffledDeck; // Return the shuffled deck
};


interface DealResult {
  dealtCard: ITarotCard[];
  remainingDeck: ITarotCard[];
}

export const dealCards = (deck: ITarotCard[], numberOfCards: number): DealResult => {
  if (numberOfCards > deck.length) {
    throw new Error('Cannot deal more cards than available in the deck');
  }
  
  const dealtCard = deck.slice(0, numberOfCards); // Extract the specified number of cards
  const remainingDeck = deck.slice(numberOfCards); // Remove the dealt cards from the deck
  
  return { dealtCard, remainingDeck }; // Return the dealt cards and the remaining deck
};

export async function getUserId() {
  const { userId } = await auth();
  return {
    userId: userId
  }
}

