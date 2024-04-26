"use client"

import React from 'react';
import  TarotCard, { ITarotCard } from "@/models/TarotCards";
import Image from 'next/image';
// import { LayoutGrid } from './ui/layout-grid';

interface Props {
    cards: ITarotCard[];
    onCardRemove: (index: number) => void;
    positions: string[];
    onCardClick: (card: any) => void;
}


const ReadingMat2: React.FC<Props> = ({ cards, onCardRemove, positions, onCardClick}) => {
    const handleCardClick = (cardId: string) => {
        // console.log(cardId);
        onCardClick(cardId); 
    };
    const firstSixCards = cards.slice(0, 6);
    const lastFourCards = cards.slice(6,10);

    const cardPositions = [
        { row: 4, col: 2 },
        { row: 2, col: 2 }, // For the rotated card
        { row: 3, col: 2 },
        { row: 2, col: 1 },
        { row: 1, col: 2 },
        { row: 2, col: 3 },
    ];

    return (
        <div className="glassmorphism flex flex-row gap-6 mb-2">
            {/* <div className='w-full min-w-[654px]' style={{ flexBasis: '100%' }}>
                <LayoutGrid
                    cards={firstSixCards}
                />
            </div> */}
            <div className="grid grid-cols-3 justify-center relative place-items-center" style={{ flexBasis: '75%' }}>
                {firstSixCards.map((card, index) => (
                    <React.Fragment key={index}>
                        <div
                            className={`items-center mx-auto max-w-max w-full px-[10%] ${cardPositions[index].row === 1 ? 'top-row' : (cardPositions[index].row === 3 ? 'bottom-row' : '')} ${
                                cardPositions[index].row === 2 && cardPositions[index].col === 2
                                    ? 'relative' // For the rotated card
                                    : ''
                            }`}
                            style={{
                                gridColumn: cardPositions[index].col,
                                gridRow: cardPositions[index].row === 4 ? 2 : cardPositions[index].row,
                            }}
                        >
                            <Image
                                src={card.cardImage}
                                alt={card.title}
                                width={0}
                                height={0}
                                sizes="100vw"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    position:
                                        cardPositions[index].row === 2 && cardPositions[index].col === 2
                                            ? 'static' // For the rotated card
                                            : 'static',
                                    transform:
                                        cardPositions[index].row === 2 && cardPositions[index].col === 2
                                            ? 'rotate(90deg)' // For the rotated card/
                                            : 'none',
                                    zIndex:
                                        cardPositions[index].row === 2 && cardPositions[index].col === 2
                                            ? 1 // For the rotated card
                                            : 'auto',
                                    top: 0,
                                    left: 0,
                                }}
                                className="w-full max-w-sm h-auto bg-transparent object-cover cursor-pointer"
                                onClick={() => handleCardClick(card._id)}
                            />
                            <p className="text-center">{positions[index]}</p>
                        </div>
                    </React.Fragment>
                ))}
            </div>
            {lastFourCards.length >= 1 ? (
                <div className="grid grid-cols-1 justify-center" style={{ flexBasis: '25%' }}>
                    {lastFourCards.slice().reverse().map((card, index) => (
                        <div key={index} className="items-center mx-auto max-w-max w-full px-[10%]">
                            <Image src={card.cardImage} alt={card.title} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} className="w-full max-w-sm h-auto bg-transparent object-cover cursor-pointer" onClick={() => handleCardClick(card._id)} />
                            <p className="text-center">{positions[positions.length - index - 1]}</p>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default ReadingMat2;
