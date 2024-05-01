"use client"

import React, { useState, useRef, useEffect } from "react";
import TarotCard, { ITarotCard } from "@/models/TarotCards";
import Image from 'next/image';
import { LayoutGrid } from './ui/layout-grid';
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


interface Props {
    cards: ITarotCard[];
    onCardRemove: (index: number) => void;
    positions: string[];
    onCardClick: (card: any) => void;
}


const ReadingMat2: React.FC<Props> = ({ cards, onCardRemove, positions, onCardClick }) => {
    const [selected, setSelected] = useState<ITarotCard | null>(null);
    const [lastSelected, setLastSelected] = useState<ITarotCard | null>(null);

    const [loaded, setLoaded] = useState(false);
    const handleClick = (card: ITarotCard) => {
        setLastSelected(selected);
        setSelected(card);
    };

    const handleCardClick = (cardId: string) => {
        // console.log(cardId);
        onCardClick(cardId);
    };

    const firstSixCards = cards.slice(0, 6);
    const lastFourCards = cards.slice(6, 10);

    const cardPositions = [
        { row: 4, col: 2 },
        { row: 2, col: 2 }, // For the rotated card
        { row: 3, col: 2 },
        { row: 2, col: 1 },
        { row: 1, col: 2 },
        { row: 2, col: 3 },
    ];

    const SelectedCard = ({ selected, onCollapse }: { selected: ITarotCard | null, onCollapse: () => void }) => {
        const [isCollapsed, setIsCollapsed] = useState(false);
        const controls = useAnimation();

        const collapseCard = async () => {
            setIsCollapsed(true);
            await controls.start({
                opacity: 0,
                scale: 0.8, // Scale down the card
                transition: { duration: 0.3 }
            });
            onCollapse(); // Callback to notify parent component
        };

        function CardDetailsTooltip() {
            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            // variant="outline"
                            className="shadow-custom-golden text-black"
                        // onClick={() => handleCardClick(selected?._id)}
                        >
                            ?
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-3/4 max-w-[512px] m-auto">
                        <div className="">
                            <div className="flex flex-row justify-between cursor-pointer"
                                onClick={() => handleCardClick(selected?._id)}
                            >
                                <p
                                ><strong>

                                        {selected?.title.toLocaleUpperCase()}
                                    </strong>
                                </p>
                                <p>
                                    <strong>
                                        {"->"}

                                    </strong>
                                </p>
                            </div>
                            <Separator className="my-1" />
                            <p
                            ><strong>Upright Effect: </strong>
                                {selected?.uprightEffect}
                            </p>
                            <p
                            ><strong>Reverse Effect: </strong>
                                {selected?.reversedEffect}
                            </p>
                        </div>
                    </PopoverContent>
                </Popover>
            )
        }

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
                    onClick={collapseCard} // Collapse selected card on background click
                />
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.8, // Starting scale
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1, // Enlarged scale
                    }}
                    transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.8, // Scale down the card
                        transition: { duration: 0.3 }
                    }}
                    className="relative px-8 pb-4 z-[70] w-1/2 m-auto"
                    style={{
                        backgroundImage: `url(${selected?.cardImage})`,
                        backgroundSize: 'contain', // Fit image to container without stretching
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        height: '80%',
                        maxHeight: '480px'
                    }}
                >

                    {/* <p>{selected?.cardDescription}</p> */}

                    <div className="flex justify-center items-end relative top-[102%]">
                        <CardDetailsTooltip />
                    </div>

                </motion.div>
            </div>
        );
    };

    return (
        <div className="glassmorphism flex flex-row gap-6 mb-2">
            <div className="grid grid-cols-3 justify-center relative place-items-center" style={{ flexBasis: '75%' }}>
                {firstSixCards.map((card, index) => (
                    <React.Fragment key={index}>
                        <div
                            className={`items-center mx-auto max-w-max w-full px-[10%] ${cardPositions[index].row === 1 ? 'top-row' : (cardPositions[index].row === 3 ? 'bottom-row' : '')} ${cardPositions[index].row === 2 && cardPositions[index].col === 2
                                ? 'relative' // For the rotated card
                                : ''
                                }`}
                            style={{
                                gridColumn: cardPositions[index].col,
                                gridRow: cardPositions[index].row === 4 ? 2 : cardPositions[index].row,
                            }}
                        >
                            <motion.div
                                onClick={() => handleClick(card)}
                                className={cn(
                                    card.title,
                                    "",
                                    selected?.id === card.id
                                        ? ""
                                        : lastSelected?.id === card.id
                                            ? "z-40 bg-white rounded-xl h-full w-full"
                                            : "bg-white rounded-xl h-full w-full"
                                )}
                                layout
                            >


                                <Image
                                    src={card.cardImage}
                                    alt={card.title}
                                    onLoad={() => setLoaded(true)}
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
                                    className={cn("w-full max-w-sm h-auto bg-transparent object-cover cursor-pointer",
                                        loaded ? "blur-none" : "blur-md"
                                    )}
                                />
                            </motion.div>
                            <p className="text-center">{positions[index]}</p>
                        </div>
                    </React.Fragment>
                ))}
            </div>
            {selected && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.8 }} // Initial animation properties
                    animate={{ opacity: 1, scale: 1 }} // Animation when card is selected
                    exit={{ opacity: 0, scale: 0.8 }} // Animation when collapsing the selected card
                >
                    <div className="w-full mx-auto h-3/4">
                        <SelectedCard selected={selected} onCollapse={() => setSelected(null)} />
                    </div>
                </motion.div>
            )}

            {lastFourCards.length >= 1 ? (
                <div className="grid grid-cols-1 justify-center" style={{ flexBasis: '25%' }}>
                    {lastFourCards.slice().reverse().map((card, index) => (
                        <div key={index} className="items-center mx-auto max-w-max w-full px-[10%]">
                            <motion.div
                                onClick={() => handleClick(card)}
                                className={cn(
                                    card.title,
                                    "",
                                    selected?.id === card.id
                                        ? ""
                                        : lastSelected?.id === card.id
                                            ? "z-40 bg-white rounded-xl h-full w-full"
                                            : "bg-white rounded-xl h-full w-full"
                                )}
                                layout
                            >
                                <Image src={card.cardImage} alt={card.title} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} className="w-full max-w-sm h-auto bg-transparent object-cover cursor-pointer" />
                            </motion.div>
                            <p className="text-center">{positions[positions.length - index - 1]}</p>
                        </div>
                    ))}
                </div>
            ) : null}


        </div>
    );
};

export default ReadingMat2;


