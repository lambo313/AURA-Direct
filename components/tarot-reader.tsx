import React, { useState, useEffect, useRef } from 'react';
import { shuffleDeck, dealCards } from '@/lib/utils'; // Import functions for shuffling and dealing cards
import  { ITarotCard } from "@/models/TarotCards";
import { toast } from "react-hot-toast";
import { TopicsCombobox } from './topic-combo-box';
import { SpreadCombobox } from './spread-combo-box';

interface Props {
    tarotDeck: ITarotCard[];
    onDeal: (selectedCards: ITarotCard[]) => void;
    onShuffle: (shuffledDeck: ITarotCard[]) => void;
    onTopicChange: (topic: string) => void;
    onSpreadChange: (spread: string) => void;
}

const TarotReader: React.FC<Props> = ({ tarotDeck, onDeal, onTopicChange, onSpreadChange }) => {
    const [deck, setDeck] = useState<ITarotCard[]>([...tarotDeck]); // State to hold the current deck of tarot cards
    const [selectedCards, setSelectedCards] = useState<ITarotCard[]>([]); // State to hold the selected cards

    /*Shuffle click counter*/    
    const [clickCount, setClickCount] = useState(0);
    const clickCountRef = useRef(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [startTimerFlag, setStartTimerFlag] = useState(false);
    const [selectedTopicValue, setSelectedTopicValue] = React.useState("");
    const [selectedSpreadValue, setSelectedSpreadValue] = React.useState("");

    const [deckMoumnted, setDeckMoumnted] = useState(false); 


    const handleTopicSelect = (value: string) => {
        setSelectedTopicValue(value);
        onTopicChange(value);
      };
    
      const handleSpreadSelect = (value: string) => {
        setSelectedSpreadValue(value);
        onSpreadChange(value);
      };

      function setMount() {
        setDeckMoumnted(true)
        console.log("Mount SET!!!")
    }

    useEffect(() => {
        setDeck([...tarotDeck]); // Update the deck state with tarotDeck when it changes
    }, [tarotDeck]);



    useEffect(() => {
        if (selectedSpreadValue !== '') {
            handleShuffle()
        }
    }, [selectedSpreadValue]);


    const handleShuffle = () => {
        // console.log("Preshuffled Cards: ", deck);
        // console.log("shuffling!!!");

        clickCountRef.current += 1;
        setClickCount(clickCountRef.current);

        const shuffledDeck = shuffleDeck([...deck]); // Shuffle the current deck state
        setDeck(shuffledDeck); // Update the deck state
        // console.log("Shuffled Cards!!!: ", shuffledDeck);
        toast.success("Deck Shuffled!");
    };


    // Start the timer when the component mounts
    // useEffect(() => {
    //     if (deck) { // Only run if deck is not null or undefined
    //         const interval = setInterval(() => {
    //             setClickCount(prevCount => {
    //                 console.log("Shuffles per second:", prevCount);
    //                 if (prevCount >= 5 && deck.length > 0) {
    //                     handleDeal();
    //                     console.log("Card fell while shuffling!");
    //                     toast.success("Looks like a Card fell while Shuffling - Let's use it!");
    //                     clickCountRef.current = 0;
    //                     return 0;
    //                 } else {
    //                     clickCountRef.current = 0;
    //                     return 0;
    //                 }
    //             });
    //         }, 1000); // 1000 milliseconds = 1 second
    //         return () => clearInterval(interval); // Cleanup function to clear interval
    //     }
    // }, [deck]);


    const handleDeal = () => {
        if (selectedSpreadValue === "" || selectedTopicValue === "") {
            toast.error("Please select a topic and choose a spread!");
        } else {
            const dealCard = () => {
            console.log("Card Dealt"); // Replace this with the actual logic for dealing a card
            console.log("Deck length:", deck.length);
            console.log("Selected cards length:", selectedCards.length);
            if (deck.length > 0 && selectedCards.length < 4) {
                // console.log("Dealt Cards Pile: ", deck);
                // console.log("dealing!!!");
    
                // Deal one card from the deck using dealCards function
                const { dealtCard, remainingDeck } = dealCards(deck, 1);
                
                setDeck(remainingDeck); // Update the deck state with the remaining cards
                setSelectedCards([...selectedCards, ...dealtCard]); // Add the dealt card to the selected cards
                onDeal([...selectedCards, ...dealtCard]); // Call the onDeal callback function with the dealt card
                // console.log("Dealt Card: ", dealtCard);
                // console.log("Previous Cards Dealt: ", selectedCards);
            } else if (deck.length === 0) {
                // console.log("No Cards Left in the Deck!");
                toast.error("No Cards Left in the Deck!");
            }else {
                // console.log("Max Cards Dealt!");
                toast.error("Max Cards Dealt!");
            }
        }
        dealCard();
        // for (let i = 0; i < 4; i++) {
        //     setTimeout(() => {
              
        //     }, 1000 * i);
        //   }
        };
    };

    
    // const handleDeal = () => {
    //     console.log("dealing!!!");
    //     const { dealtCards, remainingDeck } = dealCards(deck, 4); // Correctly destructure the return value
    //     setDeck(remainingDeck); // Update the deck state with the remaining cards
    //     onDeal(dealtCards); // Call the onDeal callback function with the dealt cards
    //     console.log("Dealt Cards Pile: ", deck);
    //     console.log("Dealt Cards: ", dealtCards);
    // };


    return (
        <div>
        <div 
            className='glassmorphism w-max mx-auto flex flex-col gap-4' 
            >
                <TopicsCombobox
                    onSelect={handleTopicSelect}
                />
                <SpreadCombobox
                    onSelect={handleSpreadSelect}
                />
            </div>
        <div className="glassmorphism grid grid-cols-2 gap-8">
            <button 
            onClick={handleShuffle} 
            className="bg-blue-500 text-white px-4 py-2 rounded flex justify-center"
            >Shuffle Deck
            </button>
            <button 
            onClick={handleDeal} 
            className="bg-green-500 text-white px-4 py-2 rounded flex justify-center"
            >Deal Cards
            </button>
        </div>
        </div>

    );
};

export default TarotReader;
