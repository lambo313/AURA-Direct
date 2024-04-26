import React, { useState, useEffect, use } from 'react';
import ReadingMat from './reading-mat';
import TarotReader from './tarot-reader';
import { ITarotCard } from "@/models/TarotCards";;
import { useRouter } from "next/navigation"
import ReadingMat2 from './reading-mat2';


interface TarotReadingProps {
    onDealtCardsChange: (cards: ITarotCard[]) => void;
    onTopicChange: (topic: string) => void;
    onSpreadChange: (spread: string) => void;
}

const TarotReading: React.FC<TarotReadingProps> = ({ onDealtCardsChange, onTopicChange,
    onSpreadChange, }) => {
    const router = useRouter();
    const [selectedCards, setSelectedCards] = useState<ITarotCard[]>([]);
    const [tarotDeck, setTarotDeck] = useState<ITarotCard[]>([]);
    const [dealtCards, setDealtCards] = useState<ITarotCard[]>([]);
    const [selectedTopicValue, setSelectedTopicValue] = React.useState("");
    const [selectedSpreadValue, setSelectedSpreadValue] = React.useState("");
    const [positions, setPositions] =  React.useState<string[]>([]);

    const [isMounted, setIsMounted] = useState(false);

    // useEffect to set isMounted to true when component mounts
    useEffect(() => {
        setIsMounted(true);
        return () => {
        // Cleanup function to set isMounted to false when component unmounts
        setIsMounted(false);
        };
    }, []);
    
    console.log('is mounted?: ', isMounted)
    
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
        } else if (selectedSpreadValue === "Celtic-Cross") {
            // If it's a single card spread, you might not need a position, or you might want to label it differently like "Insight"
            setPositions(["Insight1","Insight2","Insight3","Insight4","Insight5","Insight6","Insight7","Insight8","Insight9","Insight10"]); // Changed "*" to "Insight" for clarity, adjust as needed
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

    const handleTarotCardClick = (card: ITarotCard) => {
        if (card) {
          router.push(`/tarotdeck/tarotcard/?id=${card}`);
        }
      };

    return (
        <>
        {isMounted && (
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
            {(selectedSpreadValue === '1-Card' || selectedSpreadValue === '4-Card') &&  (
            <ReadingMat
                cards={dealtCards}
                onCardRemove={handleCardRemove}
                positions={positions}
                onCardClick={handleTarotCardClick}
            />
            )}
            {selectedSpreadValue === 'Celtic-Cross' && (
            <ReadingMat2
                cards={dealtCards}
                onCardRemove={handleCardRemove}
                positions={[]}
                onCardClick={handleTarotCardClick}
            />
            )}
        </div>
        )}
    </>
    );
};

export default TarotReading;
