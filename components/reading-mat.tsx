"use client"

import React from 'react';
import  TarotCard, { ITarotCard } from "@/models/TarotCards";
import Image from 'next/image';

interface Props {
    cards: ITarotCard[];
    onCardRemove: (index: number) => void;
    positions: string[];
    onCardClick: (card: any) => void;
}


const ReadingMat: React.FC<Props> = ({ cards, onCardRemove, positions, onCardClick}) => {
    const handleCardClick = (cardId: string) => {
        // console.log(cardId);
        onCardClick(cardId); 
    };

    return (
        <div className="glassmorphism flex flex-row justify-center gap-4 mb-2">
            {cards.map((card, index) => (
                <div key={index} className="flex flex-col items-center">
                    {/* <TarotCard
                        key={card._id}
                        tarotCard={card}
                        handleTagClick={() => {}} // Pass empty handlers if not used
                        handleEdit={() => {}}
                        handleDelete={() => {}}
                        onCardClick={onCardClick} // Pass onCardClick handler
                    /> */}
                    <Image src={card.cardImage} alt={card.title} width={0} height={0} sizes="100vw" className="w-full max-w-sm h-auto bg-transparent object-cover cursor-pointer" onClick={() => handleCardClick(card._id)} />

                    <p className="text-center">{positions[index]}</p>
                    {/* <button onClick={() => onCardRemove(index)} className="mt-2 bg-red-500 text-white px-2 py-1 rounded">Remove</button> */}
                </div>
            ))}
        </div>
    );
};

export default ReadingMat;
