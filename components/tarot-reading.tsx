import React, { useState, useEffect, use } from 'react';
import ReadingMat from './reading-mat';
import TarotReader from './tarot-reader';
import { ITarotCard } from "@/models/TarotCards";
import { TopicsCombobox } from './topic-combo-box';
import { SpreadCombobox } from './spread-combo-box';


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

    const handleTopicSelect = (value: string) => {
        setSelectedTopicValue(value);
        onTopicChange(value);
      };
    
      const handleSpreadSelect = (value: string) => {
        setSelectedSpreadValue(value);
        onSpreadChange(value);
      };


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
            <div 
            className='glassmorphism w-max mx-auto flex flex-col gap-4' 
            // style={{ display: 'flex', justifyContent: 'center' }}
            >
                <TopicsCombobox
                    onSelect={handleTopicSelect}
                />
                <SpreadCombobox
                    onSelect={handleSpreadSelect}
                />
            </div>
            <div>
                <TarotReader
                    tarotDeck={tarotDeck}
                    onShuffle={handleShuffle}
                    onDeal={handleDeal}
                />
            </div>
            <ReadingMat
                cards={dealtCards}
                onCardRemove={handleCardRemove}
            />
        </div>
    );
};

export default TarotReading;
