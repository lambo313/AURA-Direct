"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image"
import { ITarotCard } from "@/models/TarotCards";


export const LayoutGrid = ({ cards }: { cards: ITarotCard[] }) => {
    const [selected, setSelected] = useState<ITarotCard | null>(null);
    const [lastSelected, setLastSelected] = useState<ITarotCard | null>(null);

    const handleClick = (card: ITarotCard) => {
        setLastSelected(selected);
        setSelected(card);
    };

    const handleOutsideClick = () => {
        setLastSelected(selected);
        setSelected(null);
    };

    const cardPositions = [
        { row: 4, col: 2 },
        { row: 2, col: 2 }, // For the rotated card
        { row: 3, col: 2 },
        { row: 2, col: 1 },
        { row: 1, col: 2 },
        { row: 2, col: 3 },
    ];

    return (
        <div className="w-full h-full p-10 grid grid-cols-3  mx-auto gap-8 justify-center relative place-items-center">
            {cards.map((card, i) => (
                <React.Fragment key={i}>
                <div key={i} className={`items-center mx-auto max-w-max w-[full]  px-[10%] ${cardPositions[i].row === 1 ? 'top-row' : (cardPositions[i].row === 3 ? 'bottom-row' : '')} ${
                    cardPositions[i].row === 2 && cardPositions[i].col === 2
                                    ? 'relative' // For the rotated card
                                    : ''
                                }`}
                            style={{
                                gridColumn: cardPositions[i].col,
                                gridRow: cardPositions[i].row === 4 ? 2 : cardPositions[i].row,
                            }}
                            >
                    <motion.div
                        onClick={() => handleClick(card)}
                        className={cn(
                            card.title,
                            "relative overflow-hidden ",
                            selected?.id === card.id
                            ? "w-full h-auto inset-0 cover"
                            : lastSelected?.id === card.id
                            ? "z-40 bg-white rounded-xl h-full w-full"
                            : "bg-white rounded-xl h-full w-full"
                        )}
                        layout
                        >
                        {selected?.id === card.id && <SelectedCard selected={selected} />}
                        <BlurImage 
                        card={card} 
                        index={i}
                        />
                    </motion.div>
                </div>
            </React.Fragment>
     
            ))}
            <motion.div
                onClick={handleOutsideClick}
                className={cn(
                    "absolute h-full w-full left-0 top-0 bg-black opacity-0 z-10",
                    selected?.id ? "pointer-events-auto" : "pointer-events-none"
                )}
                animate={{ opacity: selected?.id ? 0.3 : 0 }}
                />
        </div>
    );
};

const BlurImage = ({ card, index }: { card: ITarotCard; index: number }) => {
    const [loaded, setLoaded] = useState(false);

    const cardPositions = [
        { row: 4, col: 2 },
        { row: 2, col: 2 }, // For the rotated card
        { row: 3, col: 2 },
        { row: 2, col: 1 },
        { row: 1, col: 2 },
        { row: 2, col: 3 },
    ];

    return (
        <Image
      src={card.cardImage}
      width={0}
      height={0}
      sizes="100vw"
      onLoad={() => setLoaded(true)}
      className={cn(
        " object-top absolute inset-0 h-auto w-full transition duration-200",
        loaded ? "blur-none" : "blur-md"
      )}
      style={{
        width: '100%',
        height: 'auto',
        position:
            cardPositions[index].row === 2 && cardPositions[index].col === 2
                ? 'static' // For the rotated card
                : 'absolute',
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
      alt="thumbnail"
    />
    );
};

const SelectedCard = ({ selected }: { selected: ITarotCard | null }) => {
    return (
        <div className="bg-transparent h-full w-full flex flex-col justify-end rounded-lg shadow-2xl relative z-[60]">
            <motion.div
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 0.6,
                }}
                className="absolute inset-0 h-full w-full bg-black opacity-60 z-10"
            />
            <motion.div
                initial={{
                    opacity: 0,
                    y: 100,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                }}
                className="relative px-8 pb-4 z-[70]"
            >
                {/* {selected?.cardDescription} */}
            </motion.div>
        </div>
    );
};
