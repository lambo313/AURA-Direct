"use client"

import { Heading } from "@/components/heading";
import { FileStack } from "lucide-react";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { FaArrowRight } from 'react-icons/fa'; // Import the ArrowRight icon
import { ITarotReadingDocument } from "@/models/tarotReading";

const SavedReadingsPage = () => {
  const router = useRouter();
  const [savedReadings, setSavedReadings] = useState<ITarotReadingDocument[]>([]);

  const [userId, setUserId] = useState('');

  useEffect(() => {
    async function fetchUserId() {
      try {
        const response = await fetch('/api/getUserId');
        const data = await response.json();
        // console.log('DATA!!!: ', data)
        setUserId(data.userId);
      } catch (error) {
        console.error('Error fetching email:', error);
      }
    }

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchSavedReadings = async () => {
      try {
        // Fetch saved readings data from the server
        const response = await fetch('/api/saveReading', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Assuming your API expects a custom header like 'X-User-Id' for the user ID
            'Authorization': userId,
          },
        });
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

  return (
    <div>  
      <Heading
        title="Saved Readings"
        description="View your saved tarot readings."
        icon={FileStack}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
      />
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {savedReadings.map((reading) => (
          <Card
            onClick={() => handleReadingClick(reading._id)}
            key={reading._id}
            className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-x-4">
              {/* Render reading icon or any other relevant content */}
              <div className="font-semibold">{reading.question}</div>
              <div className="font-light">{new Date(reading.readingDate).toLocaleString()}</div>
            </div>
            <FaArrowRight className="w-5 h-5" />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SavedReadingsPage;
