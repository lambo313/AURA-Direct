"use client";

import { useState, useEffect } from "react";
import TarotCard from "./tarot-card";
import { ITarotCard } from "@/models/TarotCards"; // Import the ITarotCard interface
import { any, string } from "zod";

interface TarotCardListProps {
  data: ITarotCard[]; // Explicitly type the data prop as an array of ITarotCard
  handleTagClick: (tagName: string) => void; // Define the type for the handleTagClick function
  handleEdit: () => void; // Define the handleEdit function prop
  handleDelete: () => void; // Define the handleDelete function prop
  onCardSelect: (tarotCard: object) => void;
}

const TarotCardList = ({ data, handleTagClick, handleEdit, handleDelete, onCardSelect  }: TarotCardListProps) => {
  return (
    <div className="mt-16 flex flex-wrap justify-center gap-4">
      {data.map((tarotCard) => (
        <TarotCard
          key={tarotCard._id}
          tarotCard={tarotCard}
          handleTagClick={handleTagClick}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          onCardClick={onCardSelect }
        />
      ))}
    </div>
  );
};

interface TarotDeckProps {
  getCard: (card: ITarotCard) => void;
}

const TarotDeck = ({ getCard }: TarotDeckProps) => {
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<number | undefined>(undefined);

  const [searchedResults, setSearchedResults] = useState([]);
  const [tarotCards, setTarotCards] = useState([]);
  
  const [selectedCards, setSelectedCards] = useState<ITarotCard[]>([]);

    const handleCardSelect = (cardData: any) => {
        setSelectedCards([...selectedCards, cardData]);
        getCard(cardData)
    };


  const fetchTarotCards = async () => {
    try {
      const response = await fetch("/api/tarotdeck");
      const data = await response.json();
      setTarotCards(data);
    } catch (error) {
      console.error("Error fetching tarot cards:", error);
    }
  };

  useEffect(() => {
    fetchTarotCards();
  }, []);

  const filterTarotCards = (searchText: string) => {
    const regex = new RegExp(searchText, "i"); // 'i' flag for case-insensitive search
    return tarotCards.filter(
      (tarotCard: any) =>
        regex.test(tarotCard.title) ||
        regex.test(tarotCard.divinatoryMeaning)
        // regex.test(tarotCard.uprightEffect) ||
        // regex.test(tarotCard.reversedEffect) ||
        // regex.test(tarotCard.cardDescription)
      // Add more filters as needed
    );
  };

  const handleSearchChange = (e: any) => {
        clearTimeout(searchTimeout);
        setSearchText(e.target.value);
    
        // debounce method
        const timeoutId: any = setTimeout(() => {
            const searchResult = filterTarotCards(e.target.value);
            setSearchedResults(searchResult);
        }, 500);
    
        setSearchTimeout(timeoutId); 
  };

  const handleTagClick = (tagName: string) => {
    setSearchText(tagName);
    const searchResult = filterTarotCards(tagName);
    setSearchedResults(searchResult);
  };

  const handleEdit = () => {
    console.log("Edit!!!")
  }

  const handleDelete = () => {
    console.log("Delete!!!")
  }
  

  return (
    <div className="px-10 pb-20">
            {/* <h2 className="text-center text-4xl text-black font-extrabold mb-10">
                (78 Cards)
            </h2> */}
            <form className="relative w-full flex-center">
                <input
                type="text"
                placeholder="Search for a title or meaning"
                value={searchText}
                onChange={handleSearchChange}
                required
                className="search_input peer"
                />
            </form>

            {/* All Tarot Cards */}
            {searchText ? (
                <TarotCardList
                data={searchedResults}
                handleTagClick={handleTagClick}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                onCardSelect={handleCardSelect}
                />
            ) : (
                <TarotCardList 
                data={tarotCards} 
                handleTagClick={handleTagClick} 
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                onCardSelect={handleCardSelect}
                />
            )}
    </div>
  );
};

export default TarotDeck;