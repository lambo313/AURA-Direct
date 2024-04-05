import React from 'react';
import  { ITarotCard } from "@/models/TarotCards";
import Image from 'next/image';

interface Props {
    cards: ITarotCard[];
    onCardRemove: (index: number) => void;
}


const ReadingMat: React.FC<Props> = ({ cards, onCardRemove }) => {
    const positions = ["Past", "Challenge", "Advice", "Outcome"];

    return (
        <div className="glassmorphism flex flex-row justify-center gap-4 mb-2">
            {cards.map((card, index) => (
                <div key={index} className="flex flex-col items-center">
                    <Image src={card.cardImage} alt={card.title} width={100} height={100} layout="responsive" className="w-full max-w-sm h-auto bg-transparent object-cover" />
                    <p className="text-center">{positions[index]}</p>
                    {/* <button onClick={() => onCardRemove(index)} className="mt-2 bg-red-500 text-white px-2 py-1 rounded">Remove</button> */}
                </div>
            ))}
        </div>
    );
};

export default ReadingMat;
