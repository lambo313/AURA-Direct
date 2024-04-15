"use client"

import { Heading } from "@/components/heading";
import { FileStack, RefreshCcw } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { FaArrowRight } from 'react-icons/fa'; // Import the ArrowRight icon
import { ITarotReadingDocument } from "@/models/tarotReading";
import { TopicsCombobox } from '@/components/topic-combo-box';
import { SpreadCombobox } from '@/components/spread-combo-box';

const SavedReadingsPage = () => {
  const router = useRouter();
  const [savedReadings, setSavedReadings] = useState<ITarotReadingDocument[]>([]);

  // const [userId, setUserId] = useState('');

  const [selectedTopicValue, setSelectedTopicValue] = React.useState("");
    const [selectedSpreadValue, setSelectedSpreadValue] = React.useState("");

  const handleTopicSelect = (value: string) => {
    setSelectedTopicValue(value);
  };

  const handleSpreadSelect = (value: string) => {
    setSelectedSpreadValue(value);
  };

  // useEffect(() => {
  //   async function fetchUserId() {
  //     try {
  //       const response = await fetch('/api/getUserId');
  //       const data = await response.json();
  //       // console.log('DATA!!!: ', data)
  //       setUserId(data.userId);
  //     } catch (error) {
  //       console.error('Error fetching email:', error);
  //     }
  //   }

  //   fetchUserId();
  // }, []);

  useEffect(() => {
    const fetchSavedReadings = async () => {
      try {
        // Fetch saved readings data from the server
        const response = await fetch('/api/saveReading');
        let data = await response.json();
        console.log("DATA: ", data)
        data = data.reverse();
        setSavedReadings(data);
      } catch (error) {
        console.error('Error fetching saved readings:', error);
      }
    };

    fetchSavedReadings();
  }, []);

  const handleReadingClick = async (id: string) => {
    router.push(`/savedreadings/tarotreading/?id=${id}`);
  };

  function getReadingTopic(responseContent: string): string {
    const splitResponse = (responseContent || '').split('-').map((part: string) => part.trim());
    return splitResponse[0] || ''; // Assuming the topic is the second part after splitting
  }

  function getDealtCardsStrig(responseContent: string): string {
    const splitResponse = (responseContent || '').split('-').map((part: string) => part.trim());
    return splitResponse[1] || ''; // Assuming the topic is the second part after splitting
  }

  return (
    <div className="pb-20">  
      <Heading
        title="Saved Readings"
        description="View your saved tarot readings."
        icon={FileStack}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
      />
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
          <div 
            className='glassmorphism w-max mx-auto flex flex-col gap-4 text-center' 
            >
              Filter
              <div className="flex items-center">
                  <TopicsCombobox
                      onSelect={handleTopicSelect}
                  />
                  <button
                      className="ml-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                      onClick={() => (handleTopicSelect(""))}
                  >
                      <RefreshCcw className="w-4 h-4" />
                  </button>
              </div>
              <div className="flex items-center">
              <SpreadCombobox
                    onSelect={handleSpreadSelect}
                />
                  <button
                      className="ml-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                      onClick={() => (handleSpreadSelect(""))}
                  >
                      <RefreshCcw className="w-4 h-4" />
                  </button>
              </div>
          </div>
          {savedReadings
            .filter(reading =>
              // Check for topic match (or no selection)
              (selectedTopicValue === "" || getReadingTopic(reading.response[0]?.content || '') === selectedTopicValue) &&
              // Check for spread match (or no selection)
              (selectedSpreadValue === "" || reading.spread === selectedSpreadValue)
            )
            .map((reading) => (
          <Card
            onClick={() => handleReadingClick(reading._id)}
            key={reading._id}
            className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
          >
            <div className="flex flex-col">
            <div className="flex items-center gap-x-4">
              {/* Render reading icon or any other relevant content */}
              <div className="font-semibold"> {getReadingTopic(reading.response[0]?.content || '')}</div>
              <span>
                {"•"}
              </span>
              <div className="font-light">{new Date(reading.readingDate).toLocaleString()}</div>
            </div>
            <div className="font-light">{getDealtCardsStrig(reading.response[0]?.content || '')}</div>

            </div>
            <FaArrowRight className="w-5 h-5" />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SavedReadingsPage


