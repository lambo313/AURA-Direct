'use client'

import { useState } from "react";
import axios from "axios";

import * as z from "zod";

import { Heading } from "@/components/heading"
import { Layers } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"

import { formSchema } from "./constants";
 
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OpenAI } from "openai";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "react-hot-toast";
import TarotDeck from "@/components/tarot-deck-content";
import { ITarotCard } from "@/models/TarotCards"; // Import the ITarotCard interface
// import { TarotCardProvider } from '@/components/tarot-card-context';

const TarotDeckPage = () => {
  const router = useRouter();
  // const [selectedCard, setSelectedCard] = useState<ITarotCard | null>(null);

  const handleTarotCardClick = (card: ITarotCard) => {
    if (card) {
      // console.log('THE CARD!!!',card);
      router.push(`/tarotdeck/tarotcard/?id=${card._id}`);
    }
  };


  return (
    // <TarotCardProvider>
      <div>
          <Heading
            title="Tarot Deck"
            description="Our most advanced tarot model."
            icon={Layers}
            iconColor="text-violet-500"
            bgColor="bg-violet-500/10"
          />
          <div className="px-4 lg:px-8">
            <div className="h-full">
              <TarotDeck
              getCard={handleTarotCardClick}
              />
            </div>
          </div>
      </div>
    // </TarotCardProvider>
  )
}

export default TarotDeckPage