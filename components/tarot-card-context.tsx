"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for the context value
interface TarotCardContextType {
  selectedCard: any; // Change 'any' to the appropriate type of selectedCard
  setSelectedCard: React.Dispatch<React.SetStateAction<any>>; // Change 'any' to the appropriate type of selectedCard
}

// Create the context
const TarotCardContext = createContext<TarotCardContextType | undefined>(undefined);

// Define the props type for the provider component
interface TarotCardProviderProps {
  children: ReactNode;
}

// Define the provider component
export const TarotCardProvider: React.FC<TarotCardProviderProps> = ({ children }) => {
  // Specify the type for selectedCard state
  const [selectedCard, setSelectedCard] = useState<any>(null); // Change 'any' to the appropriate type of selectedCard

  // Provide the context value
  const value: TarotCardContextType = { selectedCard, setSelectedCard };

  return (
    <TarotCardContext.Provider value={value}>
      {children}
    </TarotCardContext.Provider>
  );
};

// Define the custom hook to consume the context
export const useTarotCard = () => {
  const context = useContext(TarotCardContext);
  if (!context) {
    throw new Error('useTarotCard must be used within a TarotCardProvider');
  }
  return context;
};
