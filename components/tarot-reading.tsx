import React, { useState, useEffect, use } from 'react';
import ReadingMat from './reading-mat';
import TarotReader from './tarot-reader';
import { ITarotCard } from "@/models/TarotCards";;


interface TarotReadingProps {
    onDealtCardsChange: (cards: ITarotCard[]) => void;
    onTopicChange: (topic: string) => void;
    onSpreadChange: (spread: string) => void;
}

const TarotReading: React.FC<TarotReadingProps> = ({ onDealtCardsChange, onTopicChange,
    onSpreadChange, }) => {
    const [selectedCards, setSelectedCards] = useState<ITarotCard[]>([]);
    const [tarotDeck, setTarotDeck] = useState<ITarotCard[]>([]);
    const [dealtCards, setDealtCards] = useState<ITarotCard[]>([]);
    const [selectedTopicValue, setSelectedTopicValue] = React.useState("");
    const [selectedSpreadValue, setSelectedSpreadValue] = React.useState("");
    const [positions, setPositions] =  React.useState<string[]>([]);

    const handleTopicSelect = (value: string) => {
        setSelectedTopicValue(value);
        onTopicChange(value);
      };
    
      const handleSpreadSelect = (value: string) => {
        setSelectedSpreadValue(value);
        onSpreadChange(value);
      };
      
      // Update useEffect to run when selectedSpreadValue changes
    useEffect(() => {
        if (selectedSpreadValue === "4-Card") {
            setPositions(["Past", "Challenge", "Advice", "Outcome"]);
        } else if (selectedSpreadValue === "1-Card") {
            // If it's a single card spread, you might not need a position, or you might want to label it differently like "Insight"
            setPositions(["Insight"]); // Changed "*" to "Insight" for clarity, adjust as needed
        }
        // Add any other else if conditions for different spreads here
    }, [selectedSpreadValue]); // Make sure to include selectedSpreadValue in the dependency array
     

    useEffect(() => {
        const fetchTarotDeck = async () => {
            try {
                const response = await fetch("/api/tarotdeck");
                const data = await response.json();
                setTarotDeck(data);
            } catch (error) {
                console.error("Error fetching tarot deck:", error);
            }
        };

        fetchTarotDeck();
    }, []);

    const handleCardSelect = (card: ITarotCard) => {
        setSelectedCards([...selectedCards, card]);
    };

    const handleCardRemove = (index: number) => {
        const updatedCards = [...selectedCards];
        updatedCards.splice(index, 1);
        setSelectedCards(updatedCards);
    };

    const handleShuffle = (shuffledDeck: ITarotCard[]) => {
        setTarotDeck(shuffledDeck);
    };

    const handleDeal = (dealtCards: ITarotCard[]) => {
        setDealtCards(dealtCards);
        onDealtCardsChange(dealtCards);
    };

    return (
        <div className=''>
            <div>
                <TarotReader
                    tarotDeck={tarotDeck}
                    onShuffle={handleShuffle}
                    onDeal={handleDeal}
                    onTopicChange={handleTopicSelect}
                    onSpreadChange={handleSpreadSelect}
                />
            </div>
            <ReadingMat
                cards={dealtCards}
                onCardRemove={handleCardRemove}
                positions={positions}
            />
        </div>
    );
};

export default TarotReading;
