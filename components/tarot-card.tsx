"use-client"

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useRouter, NextRouter  } from "next/router";
import  { ITarotCard } from "@/models/TarotCards";

interface TarotCardProps {
  tarotCard: ITarotCard;
  handleTagClick: (tag: string) => void;
  handleEdit: () => void;
  handleDelete: () => void;
  onCardClick: (tarotCardId: object) => void; 
}

const TarotCard = ({ tarotCard, handleTagClick, handleEdit, handleDelete, onCardClick }: TarotCardProps) => {
  const handleTarotCardClick = () => {
    const getCard = tarotCard
    onCardClick(getCard)
  };

  return (
      <div className="max-w-[325px]">
      {/* {tarotCards.map((item: any) => ())} */}
          <Card
            key={tarotCard._id}
            className="glassmorphism text-black"
            onClick={handleTarotCardClick}
          >
            <CardHeader>
              {/* <CardTitle className="">
                <div>
                  <p className="text-lg text-center">{tarotCard.title}</p>
                  <p className="text-zinc-400 text-sm text-center">
                    {tarotCard.divinatoryMeaning}
                  </p>
                </div>
              </CardTitle> */}
              <CardContent 
              className="px-0" 
              // style={{ paddingBottom: "100%" }}
              >
                <div 
                className="mb-4 tanish-gold-shadow-drop"
                style={{ cursor: 'pointer' }}
                >
                  <Image
                    src={tarotCard.cardImage}
                    alt={tarotCard.title}
                    width={345}
                    height={0}
                    // sizes="100vw"
                    // className="w-full max-w-sm h-auto"
                    // style={{ width: '100%', height: 'auto' }}
                    priority
                  />
                </div>
                <div className="glassmorphism">
                  {tarotCard.divinatoryMeaning && tarotCard.divinatoryMeaning.map((meaning, index) => (
                    <p 
                      key={index} 
                      className="text-sm text-white cursor-pointer text-center" 
                      onClick={(e) => {
                        e.stopPropagation();  // Prevent click from propagating to the card's onClick
                        handleTagClick(meaning);
                      }}
                    >
                      #{meaning}
                    </p>
                  ))}
                </div>
                {/* {session?.user.id === post.creator._id && pathName === "/profile" && ( */}
                  {/* <div className='mt-5 flex-center gap-4 border-t border-gray-100 pt-3'>
                    <p
                      className='text-sm green_gradient cursor-pointer'
                      onClick={handleEdit}
                    >
                      Edit
                    </p>
                    <p
                      className='text-sm orange_gradient cursor-pointer'
                      onClick={handleDelete}
                    >
                      Delete
                    </p>
                  </div> */}
                {/* )} */}
              </CardContent>
            </CardHeader>
          </Card>
            
      </div>

  )
}

export default TarotCard;
