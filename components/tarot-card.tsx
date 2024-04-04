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
}

const TarotCard = ({ tarotCard, handleTagClick, handleEdit, handleDelete}: TarotCardProps) => {
  // const router: NextRouter = useRouter();

  // const [copied, setCopied] = useState("");

  // const handleCopy = () => {
  //   setCopied(tarotCard._id);
  //   navigator.clipboard.writeText(tarotCard._id);
  //   setTimeout(() => setCopied(""), 3000);
  // };

  const handleTarotCardClick = () => {
    console.log(tarotCard);
    // router.push(`/tarotdeck/tarotcard/${tarotCard._id}?name=${tarotCard.title}`);

    // Handle the tarot card click action
    // Replace the logic as per your requirements
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
                // style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Image
                    src={tarotCard.cardImage}
                    alt={tarotCard.title}
                    // layout="fill"
                    // objectFit="cover"
                    width="345"
                    height={100}
                  />
                </div>
                <div className="glassmorphism">
                  {tarotCard.divinatoryMeaning && tarotCard.divinatoryMeaning.map((meaning, index) => (
                    <p 
                      key={index} 
                      className="text-sm text-white cursor-pointer text-center" 
                      onClick={() => handleTagClick && handleTagClick(meaning)}
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
