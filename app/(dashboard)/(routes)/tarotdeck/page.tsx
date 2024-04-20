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
import { Card } from "@/components/ui/card";
// import { TarotCardProvider } from '@/components/tarot-card-context';


// const suits = ["cups", "swords", "pentacles"]

// const suit = 'Pentacles'
// const suitLower = suit.toLowerCase()
// const element = '65fdb360eb50bf0b212412a4'


// const handleAddCards = async () => {
//   const cardsToAdd = [
//     {
//         "cardImage": "/images/minor-arcana/"+suitLower+"/"+suitLower+"-01-ace.webp",
//         "cardDescription": "In this card, there is a single mysterious hand that comes out of the clouds. In the hand is what looks like a gold coin with a pentagram engraved on its surface. This pentacle is associated with the element of earth, and seen as a sign of wealth and all things material and earthly. Below the hand is a garden which appears to be flourishing with flowers and other kinds of vegetation - giving off the aura of fertility, growth and prosperity. The mountain represents the ambition required to drive one's search for the pentacle. The flowing creek seem to indicate that emotions are flowing towards this ambition.",
//         "arcana": "Minor",
//         "title": "Ace of "+suit,
//         "reversedEffect": "Lost opportunity, lack of planning and foresight.",
//         "uprightEffect": "A new financial or career opportunity, manifestation, abundance.",
//         "astroPower": {
//             "elemental": [
//                 element
//             ]
//         },
//         "divinatoryMeaning": [
//             "opportunities",
//             "resources",
//             "manifestation"
//         ],
//         "kabalism": {
//             "treeOfLifePath": [
//                 "1st Sephirah"
//             ]
//         }
//     },
//     {
//         // "_id": "661efa33075c4659d6c3507f",
//         "cardImage": "/images/minor-arcana/"+suitLower+"/"+suitLower+"-02.webp",
//         "cardDescription": "The Two of Pentacles card depicts a man who is dancing as he is juggling two large coins. The pentacles are surrounded by the infinity sign that denotes that the person can handle all the issues the come his way and he can manage his life with grace. In the background, you will notice that there are two ships that are riding the giant waves, and they reinforce the balancing act that the man has to face - he is in rough and choppy waters, but manages to stay afloat. The Two of Pentacles depicts the usual ups and downs that occur in one’s life. Despite all the chaos that surrounds him, the man lives a very carefree life as he dances, and handles all that comes to him with joy.",
//         "arcana": "Minor",
//         "title": "Two of "+suit,
//         "reversedEffect": "Over-committed, disorganisation, reprioritisation.",
//         "uprightEffect": "Multiple priorities, time management, prioritisation, adaptability.",
//         "astroPower": {
        
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd301eb50bf0b212412b9"
//             ],
//             "zodiacal": [
//                 "65fdccfeeb50bf0b212412b5"
//             ]
//         },
//         "divinatoryMeaning": [
//             "change",
//             "transformation",
//             "adaption"
//         ],
//         "kabalism": {
//             "treeOfLifePath": [
//                 "2nd Sephirah"
//             ]
//         }
//     },
//     {
//         // "_id": "661f035c075c4659d6c35080",
//         "cardImage": "/images/minor-arcana/"+suitLower+"/"+suitLower+"-03.webp",
//         "cardDescription": "The Three of Pentacles displays a young apprentice who works in a cathedral. In front of him, there are two others, a priest and a nobleman of some sort, that are holding plans of the cathedral on a piece of parchment. We can tell from the way the apprentice has raised his head that he is discussing his progress on building the cathedral. The two others are keenly listening to him in order to more clearly understand what is needed of them and how they can provide guidance. Despite the apprentice being less experienced, the two others listen to him because they know his ideas and his experience are fundamental in the successful completion of the whole building. The Three of Pentacles therefore represents the coming together of different kinds of knowledge in order to build something together.",
//         "arcana": "Minor",
//         "title": "Three of "+suit,
//         "reversedEffect": "Disharmony, misalignment, working alone.",
//         "uprightEffect": "Teamwork, collaboration, learning, implementation.",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd30deb50bf0b212412ba"
//             ],
//             "zodiacal": [
//                 "65fdccfeeb50bf0b212412b5"
//             ]
//         },
//         "divinatoryMeaning": [
//             "works",
//             "mechanism",
//             "means"
//         ],
//         "kabalism": {
//             "treeOfLifePath": [
//                 "3rd Sephirah"
//             ]
//         }
//     },
//     {
//         // "_id": "661f056b075c4659d6c35081",
//         "cardImage": "/images/minor-arcana/"+suitLower+"/"+suitLower+"-04.webp",
//         "cardDescription": "This card depicts a man who is sitting on a stool, who is holding onto two pentacles in a very defensive and tight posture. It’s almost as if he is hoarding them out of fear of loss. One pentacle is balanced precariously on his head, while another one is tightly clutched between his own hands, and there are two of them which are securely placed underneath his feet. He is making sure that there is absolutely no one touching his coins. At the same time, he is also unable to move because he is holding the coins so tightly. In other words, he is restrained from acting because he is holding too tight to his possessions. To some, money does not always bring freedom.",
//         "arcana": "Minor",
//         "title": "Four of "+suit,
//         "reversedEffect": "Saving money, security, conservatism, scarcity, control.",
//         "uprightEffect": "Over-spending, greed, self-protection.",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd353eb50bf0b212412be"
//             ],
//             "zodiacal": [
//                 "65fdccfeeb50bf0b212412b5"
//             ]
//         },
//         "divinatoryMeaning": [
//             "power",
//             "might",
//             "force"
//         ],
//         "kabalism": {
//             "treeOfLifePath": [
//                 "4th Sephirah"
//             ]
//         }
//     },
//     {
//         // "_id": "661f0691075c4659d6c35082",
//         "cardImage": "/images/minor-arcana/"+suitLower+"/"+suitLower+"-05.webp",
//         "cardDescription": "Just like the fives of the other suits in the tarot, the Five of Pentacles symbolizes adversity. It shows two individuals walking outside while it is snowing. Not only are they cold, they are also sick, poor, tired, and hungry. It looks as if they are lacking the basic necessities of life. A lot of people can relate to the two individuals in more ways than one.\n\nOne of the individuals in the card has crutches, while the other figure has a shawl covering her head. She is walking barefoot in the snow. There is a black wall in the background with a stained glass window featuring the five pentacles, suggesting a church of some kind.\n\nMore often than not, the Five of Pentacles is a bad omen. However, do not fret, as it can change depending on where it is placed in the reading.",
//         "arcana": "Minor",
//         "title": "Five of "+suit,
//         "reversedEffect": "Recovery from financial loss, spiritual poverty.",
//         "uprightEffect": "Financial loss, poverty, lack mindset, isolation, worry.",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd320eb50bf0b212412bc"
//             ],
//             "zodiacal": [
//                 "65fdc938eb50bf0b212412ad"
//             ]
//         },
//         "divinatoryMeaning": [
//             "worry",
//             "unease",
//             "anxiety"
//         ],
//         "kabalism": {
//             "treeOfLifePath": [
//                 "5th Sephirah"
//             ]
//         }
//     },
//     {
//         // "_id": "661f0ea0075c4659d6c35083",
//         "cardImage": "/images/minor-arcana/"+suitLower+"/"+suitLower+"-06.webp",
//         "cardDescription": "In the image on the Six of Pentacles, there is a man who is dressed in purple robes. The color purple symbolizes is the status and wealth of this man. He has a scale that is balanced in one hand, which stands for equality and fairness. We are reminded of the Justice tarot card, which suggests karma, cause and effect, and that we receive what we give. His other hand is giving money to two beggars who are kneeling at his feet. The Six of Pentacles suggests that you are in a secure enough position to give to others without affecting your own stability.",
//         "arcana": "Minor",
//         "title": "Six of "+suit,
//         "reversedEffect": "Self-care, unpaid debts, one-sided charity.",
//         "uprightEffect": "Giving, receiving, sharing wealth, generosity, charity.",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd32eeb50bf0b212412bd"
//             ],
//             "zodiacal": [
//                 "65fdc938eb50bf0b212412ad"
//             ]
//         },
//         "divinatoryMeaning": [
//             "success",
//             "fruition",
//             "arrangement"
//         ],
//         "kabalism": {
//             "treeOfLifePath": [
//                 "6th Sephirah"
//             ]
//         }
//     },
//     {
//         // "_id": "661f1087075c4659d6c35084",
//         "cardImage": "/images/minor-arcana/"+suitLower+"/"+suitLower+"-07.webp",
//         "cardDescription": "The Seven of Pentacles shows a young man who seems to be taking a break from his hard labor to admire the fruit and blossoms in his garden. He rests on his shovel as he is admiring the seven pentacles hanging from the lush green vegetation. The way that he is laying his head over hands seems to suggest a kind of fatigue - he has worked hard to make sure that this year's crop is a good one. Because he is focused on long term goals, he cannot touch his harvest right now, and only reserves one of the pentacles for himself, choosing to invest the others. With his efforts, he hopes to grow his crop for the long term. ",
//         "arcana": "Minor",
//         "title": "Seven of "+suit,
//         "reversedEffect": "Lack of long-term vision, limited success or reward.",
//         "uprightEffect": "Long-term view, sustainable results, perseverance, investment.",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd2f1eb50bf0b212412b8"
//             ],
//             "zodiacal": [
//                 "65fdc938eb50bf0b212412ad"
//             ]
//         },
//         "divinatoryMeaning": [
//             "failure",
//             "omission",
//             "cessation"
//         ],
//         "kabalism": {
//             "treeOfLifePath": [
//                 "7th Sephirah"
//             ]
//         }
//     },
//     {
//         // "_id": "661f1328075c4659d6c35085",
//         "cardImage": "/images/minor-arcana/"+suitLower+"/"+suitLower+"-08.webp",
//         "cardDescription": "The Eight of Pentacles card depicts a young man who is etching a pentacle shape into the eight golden coins. The card symbolizes someone who is completely focused and absorbed in what they are doing. The town that is far in the background means that he successfully isolated himself from the distractions so that he can fully concentrate on his task. The Eight of Pentacles refers to that moments in your life when you are dedicated to completing a certain task. You are fully-immersed, and you are committed in delivering the best version of your work.",
//         "arcana": "Minor",
//         "title": "Eight of "+suit,
//         "reversedEffect": "Self-development, perfectionism, misdirected activity.",
//         "uprightEffect": "Apprenticeship, repetitive tasks, mastery, skill development.",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd353eb50bf0b212412be"
//             ],
//             "zodiacal": [
//                 "65fdcad3eb50bf0b212412b1"
//             ]
//         },
//         "divinatoryMeaning": [
//             "prudence",
//             "discipline",
//             "shrewness"
//         ],
//         "kabalism": {
//             "treeOfLifePath": [
//                 "8th Sephirah"
//             ]
//         }
//     },
//     {
//         // "_id": "661f147f075c4659d6c35086",
//         "cardImage": "/images/minor-arcana/"+suitLower+"/"+suitLower+"-09.webp",
//         "cardDescription": "The Nine of Pentacles depicts a woman in the middle of a vineyard. The woman wears what appears to be a long, luxurious dress adorned with sunflowers. She seems to be part of a wealthy house, for in the far background, we see a castle. A falcon is sitting peacefully and playfully on her left hand. The vines behind her are rich and filled with grapes and golden coins, signaling that she has been very successful in her ventures, which are yielding a great and plentiful harvest.",
//         "arcana": "Minor",
//         "title": "Nine of "+suit,
//         "reversedEffect": "Abundance, luxury, self-sufficiency, financial independence.",
//         "uprightEffect": "Self-worth, over-investment in work, hustling.",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd315eb50bf0b212412bb"
//             ],
//             "zodiacal": [
//                 "65fdcad3eb50bf0b212412b1"
//             ]
//         },
//         "divinatoryMeaning": [
//             "gain",
//             "obtain",
//             "increase"
//         ],
//         "kabalism": {
//             "treeOfLifePath": [
//                 "9th Sephirah"
//             ]
//         }
//     },
//     {
//         // "_id": "661f15d5075c4659d6c35087",
//         "cardImage": "/images/minor-arcana/"+suitLower+"/"+suitLower+"-10.webp",
//         "cardDescription": "In the Ten of Pentacles card, there is an old man seated in an archway leading into a great estate. It seems he is the head of the family, for he is surrounded by younger loved ones. He wears a robe that is decorated with moon crescents and grapevines - indicating the joining of spirit and matter. He has his family and dogs with him. There is a happy couple in front of him, presumably his children and a playful child behind this couple, his grandchild. The child playfully reaches out to pet the dog.",
//         "arcana": "Minor",
//         "title": "Ten of "+suit,
//         "reversedEffect": "The dark side of wealth, financial failure or loss.",
//         "uprightEffect": "Wealth, financial security, family, long-term success, contribution.",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd320eb50bf0b212412bc"
//             ],
//             "zodiacal": [
//                 "65fdcad3eb50bf0b212412b1"
//             ]
//         },
//         "divinatoryMeaning": [
//             "wealth",
//             "abundance",
//             "prosperity"
//         ],
//         "kabalism": {
//             "treeOfLifePath": [
//                 "10th Sephirah"
//             ]
//         }
//     },
//     {
//         // "_id": "661f22c1075c4659d6c35088",
//         "cardImage": "/images/minor-arcana/"+suitLower+"/"+suitLower+"-11-page.webp",
//         "cardDescription": "The Page of Pentacles card depicts a youth standing all by himself in a wide field surrounded by flowers. In the background, you will also notice several lush trees and a furrowed field. The young man seems to be walking in a slow manner and appears unaware of his surroundings, for his attention is completely captured by the coin he is holding, and all that it represents: ambition, security, wealth, nature, and sensuality. The Page of Pentacles symbolizes a person who is grounded, loyal and diligent.",
//         "arcana": "Minor",
//         "title": "Page of "+suit,
//         "reversedEffect": "Lack of progress, procrastination, learn from failure.",
//         "uprightEffect": "Manifesting, financial opportunity, skill development.",
//         "astroPower": {
//             "mainElement": [
//                 element
//             ],
//             "seasonality": [
//                 "Spring"
//             ],
//             "minorElement": "65fdb360eb50bf0b212412a4"
//         },
//         "divinatoryMeaning": [
//             "diligent",
//             "planner",
//             "grounded"
//         ],
//         "kabalism": {
//             "treeOfLifePath": [
//                 "Malkuth"
//             ]
//         }
//     },
//     {
//         // "_id": "661f25f1075c4659d6c35089",
//         "cardImage": "/images/minor-arcana/"+suitLower+"/"+suitLower+"-12-knight.webp",
//         "cardDescription": "Much like the other court cards of this suit, the Knight of Pentacles revolves around work, effort, and a general responsibility. The Knight of Pentacles sits on a dark horse in a field. Unlike the other knights, who are always off on one adventure or another, this knight decides to stay home, and instead, focus on tilling the fields. He prepares for the next harvest - it is on this land that he believes that he can do the most. In his hands, he has a single gold coin. He gazes into it, and in his eyes we see a careful consideration. Perhaps he is dreaming of what it could bring him. The other knights may think he's a little boring, but this knight is more concerned about the long term future of his kingdom.\n\n",
//         "arcana": "Minor",
//         "title": "Knight of "+suit,
//         "reversedEffect": "Self-discipline, boredom, feeling ‘stuck’, perfectionism.",
//         "uprightEffect": "Hard work, productivity, routine, conservatism.",
//         "astroPower": {
//             "mainElement": [
//                 element
//             ],
//             "minorElement": [
//                 "65fda183eb50bf0b212412a2"
//             ]
//         },
//         "divinatoryMeaning": [
//             "reliable",
//             "efficient",
//             "stoic"
//         ],
//         "kabalism": {
//             "treeOfLifePath": [
//                 "Tiphereth"
//             ]
//         }
//     },
//     {
//         // "_id": "661f288e075c4659d6c3508a",
//         "cardImage": "/images/minor-arcana/"+suitLower+"/"+suitLower+"-13-queen.webp",
//         "cardDescription": "The Queen of Pentacles card depicts a beautiful woman sitting on a decorated throne holding a golden coin. Surrounding her are beautiful blossoming trees and green floral gardens. Her throne is decorated with various beasts of the earth, tying her closely with nature and abundance. At the bottom of the card, on the right-hand side, a rabbit is pouncing into the frame, which symbolizes her high energy and fertility. The Queen of Pentacles, therefore, depicts a certain level of success and prosperity. But the rabbit at the bottom cautions us that we should be careful of where we leap when we are chasing that success.\n\n",
//         "arcana": "Minor",
//         "title": "Queen of "+suit,
//         "reversedEffect": "Financial independence, self-care, work-home conflict.",
//         "uprightEffect": "Nurturing, practical, providing financially, a working parent.",
//         "astroPower": {
//             "mainElement": [
//                 element
//             ],
//             "minorElement": [
//                 "65fdc33deb50bf0b212412a9"
//             ]
//         },
//         "divinatoryMeaning": [
//             "practicality",
//             "usefulness",
//             "convenience"
//         ],
//         "kabalism": {
//             "treeOfLifePath": [
//                 "Binah"
//             ]
//         }
//     },
//     {
//         // "_id": "661f2bc8075c4659d6c3508b",
//         "cardImage": "/images/minor-arcana/"+suitLower+"/"+suitLower+"-14-king.webp",
//         "cardDescription": "The King of Pentacles refers to a man of high ambition, materialistic satisfaction, and worldly success. The King of Pentacles is sitting on a throne that is adorned with vines and bull carvings, and the robe that he is wearing is embroidered with many images of grapevines. He looks sophisticated and regal. He is also surrounded by different types of plants, vines, and flowers which depicts this king’s attainment of materialistic success. He holds a scepter in his right hand and the coin with a pentacles engraved on it in his left hand. The castle can be seen behind him, which is a symbol of his determination and effort.",
//         "arcana": "Minor",
//         "title": "King of "+suit,
//         "reversedEffect": "Financially inept, obsessed with wealth and status, stubborn.",
//         "uprightEffect": "Wealth, business, leadership, security, discipline, abundance.",
//         "astroPower": {
//             "mainElement": [
//                 element
//             ],
//             "minorElement": [
//                 "65fdc3b7eb50bf0b212412aa"
//             ]
//         },
//         "divinatoryMeaning": [
//             "security",
//             "protection",
//             "unexposed"
//         ],
//         "kabalism": {
//             "treeOfLifePath": [
//                 "Chokmah"
//             ]
//         }
//     }
// ]

//   // console.log("Cards to Add!: ",cardsToAdd)

//   try {
//     // Send a POST request to the server endpoint
//     const response = await fetch(`/api/saveTarotCards`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({cardsToSave: cardsToAdd}),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to save tarot cards"); // Throw an error if request fails
//     }
//     const data = await response.json();
//     console.log("DATA SAVED!: ", data)

//   } catch (error) {
//     console.error("Error saving tarot cards:", error);
//     throw error; // Rethrow or handle as needed
//   }
// }


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
          {/* <Button 
          className="flex m-auto" 
          onClick={handleAddCards}
          >
            Add Cards
          </Button> */}
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