"use client"

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation'
import { Heading } from "@/components/heading";
import { File } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import ReactMarkdown from "react-markdown";
import { ITarotCard } from "@/models/TarotCards";
import { ITarotReadingDocument } from "@/models/tarotReading";
import ReadingMat from "@/components/reading-mat";
import { ObjectId } from "mongoose";
import { string } from "zod";


const TarotReadingPage = () => {
  const [cards, setCards] = useState<ITarotCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<ITarotCard[]>([]);
  const [reading, setReading] = useState<ITarotReadingDocument>();
  const [readingTopic, setReadingTopic] = useState<string>();
  const searchParams = useSearchParams();
  const id = searchParams.get('id')
  
  const handleCardRemove = (index: number) => {
    const updatedCards = [...selectedCards];
    updatedCards.splice(index, 1);
    setSelectedCards(updatedCards);
  };

  useEffect(() => {
    if (id) {
      // Fetch saved reading when ID is available in the URL query
      const fetchSavedReading = async () => {
        try {
          const response = await fetch(`/api/getSavedReadings`, {
            method: "POST",
            headers: {
          "Content-Type": "application/json",
            },
            body: JSON.stringify({id: id}),
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch saved reading: ${response.status}`);
          }

          const fetchedReading = await response.json(); 

          // console.log("Fetched Reading!!!: ", fetchedReading)
          setReading(fetchedReading); // Update state with fetched reading
        } catch (error) {
          console.error("Error fetching saved reading:", error);
        }
      };

      fetchSavedReading();
      
    }
  }, [id]);

  useEffect(() =>{
    if (reading && reading.cards.length > 0) {
      const fetchCardsDetails = async (cardIds: ITarotCard[]) => {
        try {
          const response = await fetch('/api/getCards', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cardIds: cardIds }),
          });
          const readingCardsIds = reading.cards.map(card => card._id);
          
          const responseString = reading.response[0]?.content || '';
          const splitResponse = (responseString || '').split('-').map((part: string) => part.trim());;
          const titlesArray = (splitResponse[1] || '').split(',');
          const readingTopic = splitResponse[0];
          console.log("Titles Array: ", titlesArray)
          console.log("Topic: ", readingTopic)
          setReadingTopic(readingTopic)

          const cardDeck = await response.json();

          // Reorder dealtCards based on the order of titles in the reading.question string
          const reorderedCards = [];
          for (const title of titlesArray) {
            const foundCard = cardDeck.find((card: ITarotCard) => card.title === title.trim());
            if (foundCard) {
              reorderedCards.push(foundCard);
            }
          }
        
        console.log("Reordered Dealt Cards: ", reorderedCards);
        setCards(reorderedCards);
        } catch (error) {
          console.error("Failed to fetch card details:", error);
        }
      };  
  
      fetchCardsDetails(reading.cards);
    }
  }, [reading]);
  

  if (!reading) {
    return <div>Loading...</div>; // Show loading indicator while fetching the reading
  }

  return (
    <div className="pb-4">
      <Heading
        title="Tarot Reading"
        description="Your AI generated reading."
        icon={File}
        iconColor="text-amber-700"
        bgColor="bg-amber-700/10"
      />
      <div className="px-4 lg:px-8">
        <div key={reading.id}>
          <div className="font-semibold text-center">{readingTopic}</div>
          <div className="font-light text-center">
            {new Date(reading.readingDate).toLocaleString()}
          </div>

          {/* Dealt Cards Section */}
          <div className="h-full">
            <ReadingMat
              cards={cards} // Assuming dealtCards is a property of the reading object
              onCardRemove={handleCardRemove}
            />
          </div>

          {/* Message Content Section */}
          <div className="space-y-4 mt-4">
            <div className="flex flex-col-reverse gap-y-4">
              {reading.response.map((message: any, index: any) => {
                // Check if message role is not equal to "user"
                if (message.role !== "user") {
                  return (
                    <div
                      key={index}
                      className={cn(
                        "p-8 w-full flex items-start gap-x-8 rounded-lg",
                        message.role === "user"
                          ? "bg-white border border-black/10"
                          : "bg-muted"
                      )}
                    >
                      {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                      <ReactMarkdown
                        components={{
                          pre: ({ node, ...props }) => (
                            <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                              <pre {...props} />
                            </div>
                          ),
                          code: ({ node, ...props }) => (
                            <code className="bg-black/10 rounded-lg p-1" {...props} />
                          ),
                        }}
                        className="text-sm overflow-hidden leading-7"
                      >
                        {message.content?.toString() || ""}
                      </ReactMarkdown>
                    </div>
                  );
                }
                // If message role is "user", return null
                return null;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarotReadingPage;
