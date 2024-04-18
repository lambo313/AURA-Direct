'use client'

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';
import { ITarotCard } from '@/models/TarotCards';
import { IHebrewLetter } from '@/models/hebrewLetter';
import { IElement } from '@/models/element';
import { IPlanet } from '@/models/planet';
import { IZodiac } from '@/models/zodiac';
import { Heading } from "@/components/heading"
import { Table2  } from "lucide-react"
import Image from "next/image";

interface TarotCardPageProps {
  tarotCard: ITarotCard;
}

const TarotCardPage = () => {
    const searchParams = useSearchParams();
    const cardId = searchParams.get('id');
    const [card, setCard] = useState<ITarotCard>();
    const [hebrewLetterData, sethebrewLetterData] = useState<IHebrewLetter>();
    const [elementData, setElementData] = useState<IElement>();
    const [mainElement, setMainElement] = useState<IElement>();
    const [minorElement, setMinorElement] = useState<IElement>();
    const [planetData, setPlanetData] = useState<IPlanet>();
    const [zodiacData, setZodiacData] = useState<IZodiac>();
    // console.log('CARD ID!!!: ',cardId)

    useEffect(() => {
        const fetchCard = async () => {
            if (cardId) {
                const response = await fetch(`/api/getTarotCard`, {
                  method: "POST",
                  headers: {
                "Content-Type": "application/json",
                  },
                  body: JSON.stringify({id: cardId}),
                });
                const data = await response.json();

                // console.log("Fetched Card Data!!!: ", data)
                setCard(data);
            }
        };
        fetchCard();
    }, [cardId]);

    const isHebrewLetterPresent = card && card.kabalism['hebrewLetter'];

    useEffect(() => {
      if (isHebrewLetterPresent) {
        const fetchHebrewLetter = async () => {
          try {
            const response = await fetch(`/api/getHebrewLetter`, {
              method: "POST",
              headers: {
            "Content-Type": "application/json",
              },
              body: JSON.stringify({id: card.kabalism['hebrewLetter']}),
            });
            if (!response.ok) {
              throw new Error(`Failed to fetch hebrew letter: ${response.status}`);
            }
  
            const fetchedHebrewLetter= await response.json(); 

            sethebrewLetterData(fetchedHebrewLetter);
          } catch (error) {
            console.error("Error fetching hebrew letter:", error);
          }
        };
        fetchHebrewLetter(); 
      }
    }, [isHebrewLetterPresent]);

    const isElementalPresent = card && card.astroPower['elemental'];

    useEffect(() => {
      if (isElementalPresent) {
        const fetchElement = async () => {
          try {
            const response = await fetch(`/api/getElement`, {
              method: "POST",
              headers: {
            "Content-Type": "application/json",
              },
              body: JSON.stringify({id: card.astroPower['elemental']}),
            });
            if (!response.ok) {
              throw new Error(`Failed to fetch element: ${response.status}`);
            }
  
            const fetchedElement = await response.json(); 
  
            // console.log("Fetched Element!!!: ", fetchedElement)
            setElementData(fetchedElement);
          } catch (error) {
            console.error("Error fetching element:", error);
          }
        };
        fetchElement(); 
      }
    }, [isElementalPresent]);


    const isMainElementPresent = card && card.astroPower['mainElement'];

    useEffect(() => {
      if (isMainElementPresent) {
        const fetchElement = async () => {
          try {
            const response = await fetch(`/api/getElement`, {
              method: "POST",
              headers: {
            "Content-Type": "application/json",
              },
              body: JSON.stringify({id: card.astroPower['mainElement']}),
            });
            if (!response.ok) {
              throw new Error(`Failed to fetch element: ${response.status}`);
            }
  
            const fetchedElement = await response.json(); 
  
            // console.log("Fetched Element!!!: ", fetchedElement)
            setMainElement(fetchedElement);
          } catch (error) {
            console.error("Error fetching element:", error);
          }
        };
        fetchElement(); 
      }
    }, [isMainElementPresent]);


    const isMinorElementPresent = card && card.astroPower['minorElement'];

    useEffect(() => {
      if (isMinorElementPresent) {
        const fetchElement = async () => {
          try {
            const response = await fetch(`/api/getElement`, {
              method: "POST",
              headers: {
            "Content-Type": "application/json",
              },
              body: JSON.stringify({id: card.astroPower['minorElement']}),
            });
            if (!response.ok) {
              throw new Error(`Failed to fetch element: ${response.status}`);
            }
  
            const fetchedElement = await response.json(); 
  
            // console.log("Fetched Element!!!: ", fetchedElement)
            setMinorElement(fetchedElement);
          } catch (error) {
            console.error("Error fetching element:", error);
          }
        };
        fetchElement(); 
      }
    }, [isMinorElementPresent]);


    const isPlanetPresent = card && card.astroPower['planetary'];

    useEffect(() => {
      if (isPlanetPresent) {
        const fetchPlanet = async () => {
          try {
            const response = await fetch(`/api/getPlanet`, {
              method: "POST",
              headers: {
            "Content-Type": "application/json",
              },
              body: JSON.stringify({id: card.astroPower['planetary']}),
            });
            if (!response.ok) {
              throw new Error(`Failed to fetch planet: ${response.status}`);
            }
  
            const fetchedPlanet = await response.json(); 
  
            // console.log("Fetched Planet!!!: ", fetchedPlanet)
            setPlanetData(fetchedPlanet);
          } catch (error) {
            console.error("Error fetching planet:", error);
          }
        };
        fetchPlanet(); 
      }
    }, [isPlanetPresent]);


    const isZodiacPresent = card && card.astroPower['zodiacal'];

    useEffect(() => {
      if (isZodiacPresent) {
        const fetchZodiac = async () => {
          try {
            const response = await fetch(`/api/getZodiac`, {
              method: "POST",
              headers: {
            "Content-Type": "application/json",
              },
              body: JSON.stringify({id: card.astroPower['zodiacal']}),
            });
            if (!response.ok) {
              throw new Error(`Failed to fetch zodiac: ${response.status}`);
            }
  
            const fetchedZodiac = await response.json(); 
  
            // console.log("Fetched Zodiac!!!: ", fetchedZodiac)
            setZodiacData(fetchedZodiac);
          } catch (error) {
            console.error("Error fetching zodiac:", error);
          }
        };
        fetchZodiac(); 
      }
    }, [isZodiacPresent]);


    if (!card) return <div>Loading...</div>;

    return (
      <div className="pb-1">
          <Heading
            title="Tarot Deck"
            description="Our most advanced tarot model."
            icon={Table2}
            iconColor="text-violet-500"
            bgColor="bg-violet-500/10"
          />
        <div className="glassmorphism m-5">
            <h1 className="text-3xl font-bold text-center">{card.title}</h1>
            <div 
                className="flex justify-center my-6 tanish-gold-shadow-drop"
                >
                  <Image
                    src={card.cardImage}
                    alt={card.title}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full max-w-xs h-auto"
                    // style={{ width: '100%', height: 'auto' }}
                    priority
                  />
                </div>
            <div className="glassmorphism">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <h2 className="text-2xl font-semibold underline">Arcana</h2>
                      <p>{card.arcana}</p>
                      <h2 className="text-2xl font-semibold underline mt-4">Card Description</h2>
                      <p>{card.cardDescription}</p>
                      {/* {
                          hebrewLetterData?.title !== "" && (
                              <>
                                  <h2 className="text-2xl font-semibold underline mt-4">Hebrew Letter</h2>
                                  <p>{hebrewLetterData?.title}</p>
                                  <p className="text-2xl -mt-1">{hebrewLetterData?.hebrewLetter}</p>
                              </>
                          )
                      } */}
                  </div>

                  <div>
                  <h2 className="text-2xl font-semibold underline">Astrology</h2>
                      {card.arcana === "Major" && (
                       <>
                      <ul>
                        {Object.keys(card.astroPower).map((key) => (
                          <li key={key}>
                            {key === 'elemental' && (
                              <>
                              <div className="flex flex-row gap-1">
                                <p> <strong>Elemental:</strong></p>
                                {elementData?.title}
                                <p className="text-2xl -mt-1 font-semibold">{elementData?.textSymbol}</p>
                              </div>
                              </>
                            )} 
                            {key === 'planetary' && (
                              <>
                              <div className="flex flex-row gap-1">
                                <p> <strong>Planetary:</strong></p>
                                {planetData?.title}
                                <p className="text-2xl -mt-1 font-semibold">{planetData?.textSymbol}</p>
                              </div>
                              </>
                            )}
                            {key === 'zodiacal' && (
                              <>
                              <div className="flex flex-row gap-1">
                                <p> <strong>Zodiacal:</strong></p>
                                {zodiacData?.title}
                                <p className="text-2xl -mt-1 font-semibold">{zodiacData?.textSymbol}</p>
                              </div>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                      </>
                      )}
                      {card.arcana === "Minor" && (
                       <>
                      <ul>
                        {Object.keys(card.astroPower).map((key) => (
                          <li key={key}>
                            {key === 'elemental' && (
                              <>
                              <div className="flex flex-row gap-1">
                                <p> <strong>Elemental:</strong></p>
                                {elementData?.title}
                              <p className="text-2xl -mt-1 font-semibold">{elementData?.textSymbol}</p>
                              </div>
                              </>
                            )} 
                            {key === 'planetary' && (
                              <>
                              <div className="flex flex-col">
                                <p> <strong>Transitory:</strong></p>
                                <div className="flex flex-row items-center gap-1 flex-wrap">
                                  <div className="flex flex-row gap-1">
                                    {planetData?.title}
                                    <p className="text-2xl -mt-1 font-semibold leading-none">{planetData?.textSymbol}</p>
                                  </div>
                                  -<strong>in</strong>-
                                  <div className="flex flex-row gap-1">
                                    {zodiacData?.title}
                                    <p className="text-2xl -mt-1 font-semibold">{zodiacData?.textSymbol}</p>
                                  </div>
                                </div>
                              </div>
                              </>
                            )}

                            {key === 'minorElement' && (
                              <>
                              <div className="flex flex-col">
                                <p> <strong>Elemental:</strong></p>
                                <div className="flex flex-row items-center gap-1 flex-wrap">
                                  <div className="flex flex-row gap-1">
                                    {"The "+ minorElement?.title}
                                    <p className="text-2xl -mt-1 font-semibold leading-none">{minorElement?.textSymbol}</p>
                                  </div>
                                  -<strong>in the world of</strong>-
                                  <div className="flex flex-row gap-1 flex-wrap">
                                    {mainElement?.title}
                                    {/* {"("+mainElement?.world+")"} */}
                                    <p className="text-2xl -mt-1 font-semibold leading-none">{mainElement?.textSymbol}</p>
                                  </div>
                                </div>
                              </div>
                              </>
                            )}
                          
                     
                          </li>
                        ))}
                      </ul>
                      </>
                      )}
                      <h2 className="text-2xl font-semibold underline mt-4">Effects</h2>
                      <p><strong>Upright:</strong> {card.uprightEffect}</p>
                      <p><strong>Reversed:</strong> {card.reversedEffect}</p>
                      <h2 className="text-2xl font-semibold underline mt-4">Divinatory Meanings</h2>
                      <ul>
                          {card.divinatoryMeaning.map((meaning, index) => (
                              <li key={index}>{meaning}</li>
                          ))}
                      </ul>
                      <h2 className="text-2xl font-semibold underline mt-4">Kabalism</h2>
                      <ul>
                        {Object.keys(card.kabalism).map((key) => (
                          <li key={key}>
                            {key === 'hebrewLetter' && (
                              <>
                              <div className="flex flex-row gap-1">
                                <p> <strong>Hebrew Letter:</strong></p>
                                {hebrewLetterData?.title}
                                <p className="text-2xl -mt-1 font-semibold">{hebrewLetterData?.hebrewLetter}</p>
                              </div>
                              </>
                            )} 
                            {key === 'treeOfLifePath' && (
                              <>
                                <div className="flex flex-row gap-1">
                                  {card.kabalism['treeOfLifePath'].map((value: any, index) => (
                                    <p key={index}><strong> Tree of Life:</strong>{" "+ value}</p> // Using index as a key because specific details of value uniqueness are unknown
                                  ))}
                                </div>
                              </>
                            )}

                          </li>
                        ))}
                      </ul>
                  </div>
              </div>
            </div>
        </div>
      </div>  
    );
};

export default TarotCardPage;
