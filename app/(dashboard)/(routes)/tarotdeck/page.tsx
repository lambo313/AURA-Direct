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

// const suit = 'Swords'
// const suitLower = suit.toLowerCase()
// const element = '65fda183eb50bf0b212412a2'


// const handleAddCards = async () => {
//   const cardsToAdd = [
//     {
//         "cardImage": "/images/minor-arcana/"+suitLower+"/"+suitLower+"-01-ace.webp",
//         "cardDescription": "The Ace of Swords shows a hand emerging from the clouds wielding a double-edged sword. This double edged sword carries a golden crown while being encircled by a wreath. The wreath has for a long time been associated with victory, success and great achievement.\n\nThe crown is used as the symbol for both royalty and the power to rule that comes with royalty.\n\nBehind the foreground, the sword stands floating over a varied setting - which holds both mountains and sea, which are used as symbols of the vast reach and distant lands that the swords can be used to conquer, as well as ambition. ",
//         "arcana": "Minor",
//         "title": "Ace of "+suit,
//         "reversedEffect": "Inner clarity, re-thinking an idea, clouded judgement",
//         "uprightEffect": "Breakthroughs, new ideas, mental clarity, success",
//         "astroPower": {
//             "elemental": [
//                 element
//             ]
//         },
//         "divinatoryMeaning": [
//             "clarity",
//             "breakthrough",
//             "concentration"
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
//         "cardDescription": "The Two of Swords symbolizes the confusion we face when we are forced to make difficult choices. In the Two of Swords card, there is a seated woman that is blindfolded while holding a sword in each of her hands. In the background, there is a sea surrounded by crags and rocks that serve as obstacles for vessels and ships, stalling progress and action. The woman in the card being blindfolded is a representation of a situation which prevents her from seeing both the problem and the solution with clarity.\n\nThe swords that she is holding in each of her hands show that there are two choices that lead in different directions and are mutually exclusive to one another. It may also depict a stalemate, which means that the problem should be addressed with a logical and rational thinking. The Moon positioned on the right side of the card signifies may signify the role of illusions and deception in the difficulty that the woman has in making a choice.",
//         "arcana": "Minor",
//         "title": "Two of "+suit,
//         "reversedEffect": "Indecision, confusion, information overload, stalemate",
//         "uprightEffect": "Difficult decisions, weighing up options, an impasse, avoidance",
//         "astroPower": {
        
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd32eeb50bf0b212412bd"
//             ],
//             "zodiacal": [
//                 "65fdcb55eb50bf0b212412b2"
//             ]
//         },
//         "divinatoryMeaning": [
//             "peace",
//             "tranquility",
//             "freedom"
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
//         "cardDescription": "One of the most iconic images in the tarot, the Three of Swords displays a floating heart that is pierced by three swords. Above it, there are heavy clouds. There is also a heavy downpour in the background. The symbolism is pretty opaque, and the emotional effect that it has is immediate. The heart is the seat of warmth, affection and spirit, and the three swords indicate the power to harm, cause pain, and create suffering to what it pierces. This is an image of grief, loss and literally heartbreak. The clouds and rain depict the surrounding grimness of the situation. All these symbols point to the Three of Swords showing a low point in one's life.",
//         "arcana": "Minor",
//         "title": "Three of "+suit,
//         "reversedEffect": "Negative self-talk, releasing pain, optimism, forgiveness",
//         "uprightEffect": "Heartbreak, mental pain, sorrow, grief, hurt",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd2f1eb50bf0b212412b8"
//             ],
//             "zodiacal": [
//                 "65fdcb55eb50bf0b212412b2"
//             ]
//         },
//         "divinatoryMeaning": [
//             "sorrow",
//             "distress",
//             "misfortune"
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
//         "cardDescription": "There is a quiet stillness that is present in the Four of Swords, a sense of calm peace that is contrasted so deeply with the pain in the Three of Swords. Here, in a church, there is a carving of a knight that lies upon a tomb with three swords hanging above him while the fourth one lies beneath him. These three swords are a reminder of the suffering that he has endured in the earlier card. The position of the fourth sword seems to be a signal that the fight has ended. A child and a woman are depicted by the stained glass place behind the statue, giving the scene a sense of warmth and welcoming after the retreat. The knight has his hands positioned as if he is praying.",
//         "arcana": "Minor",
//         "title": "Four of "+suit,
//         "reversedEffect": "Exhaustion, burn-out, deep contemplation, stagnation",
//         "uprightEffect": "Rest, relaxation, meditation, contemplation, recuperation",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd301eb50bf0b212412b9"
//             ],
//             "zodiacal": [
//                 "65fdcb55eb50bf0b212412b2"
//             ]
//         },
//         "divinatoryMeaning": [
//             "luxury",
//             "confort",
//             "extravagance"
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
//         "cardDescription": "The Five of Swords card depicts a young man who has a very convenient look of contempt on his face. He is looking at the enemies that he has managed to conquer. There are five swords that he possesses – which he has taken from the other combatants who are in the card. The two other figures are walking away from him in a slow manner with a sense of loss and sadness. Above them, the sky is tumultuous and cloudy, which indicates that not everything is well, despite the fact that the battle is already over.",
//         "arcana": "Minor",
//         "title": "Five of "+suit,
//         "reversedEffect": "Reconciliation, making amends, past resentment",
//         "uprightEffect": "Conflict, disagreements, competition, defeat, winning at all costs",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd315eb50bf0b212412bb"
//             ],
//             "zodiacal": [
//                 "65fdb8f9eb50bf0b212412a8"
//             ]
//         },
//         "divinatoryMeaning": [
//             "defeat",
//             "overcome",
//             "subdue"
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
//         "cardDescription": "The image in the Six of Swords shows a woman and a child in a boat being rowed in the water to a land that is on the other side. We can gather from the images that the woman and the child are leaving something behind, as their backs are faced towards us. The woman's head is covered with a cloak - perhaps she is fleeing something, and must go without others knowing her true identity. We can assume that because of this, she is undergoing great loss or sadness. The symbolism within the Six of Swords is that of loss or change, as well as moving towards a future that looks more promising than the one that we left behind. The six swords alongside the boat symbolize the strong power of the rational mind, compared to intuition and the heart.",
//         "arcana": "Minor",
//         "title": "Six of "+suit,
//         "reversedEffect": "Personal transition, resistance to change, unfinished business",
//         "uprightEffect": "Transition, change, rite of passage, releasing baggage.",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd320eb50bf0b212412bc"
//             ],
//             "zodiacal": [
//                 "65fdb8f9eb50bf0b212412a8"
//             ]
//         },
//         "divinatoryMeaning": [
//             "science",
//             "configuration",
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
//         "cardDescription": "In the Seven of Swords card, there is a man that is seen running away sneakily from a camp of some sort, while carrying five swords in his hands. Behind him, two other swords are on standing on the ground. From this image, we can deduce that the Seven of Swords is about stealth, getting away with something, deception or betrayal.\n\nThe expression on the man’s face shows quite a bit of confidence, and he seems to be sure of his success on this mission of stealing the swords. Unfortunately for him though, on the left there seems to be a group of soldiers who have discovered the theft and one soldier is actually raising a flag or a weapon as if to signal his pursuit.",
//         "arcana": "Minor",
//         "title": "Seven of "+suit,
//         "reversedEffect": "Imposter syndrome, self-deceit, keeping secrets",
//         "uprightEffect": "Betrayal, deception, getting away with something, acting strategically",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd32eeb50bf0b212412bd"
//             ],
//             "zodiacal": [
//                 "65fdb8f9eb50bf0b212412a8"
//             ]
//         },
//         "divinatoryMeaning": [
//             "futility",
//             "uselessness",
//             "ineffectiveness"
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
//         "cardDescription": "On the Eight of Swords is a woman who is tied up and blindfolded. There are eight swords placed strategically around her in a way that restricts her movement as though she is in some kind of trap or jail. However, it seems as though whoever built the trap was a little lazy or hasty, leaving some open space where she could escape. But because of the blindfold preventing the woman from seeing, she has no way of finding her way out of this trap. The barren land around her might signify a lack of creativity of some sort, while the grey sky in the background can signify despair, since there she feels that there is no hope of her breaking free from the kind of situation that she is bound to. If only she could take the blindfold off, she would see that she could simply just walk out of this situation.",
//         "arcana": "Minor",
//         "title": "Eight of "+suit,
//         "reversedEffect": "Self-limiting beliefs, inner critic, releasing negative thoughts, open to new perspectives",
//         "uprightEffect": "Negative thoughts, self-imposed restriction, imprisonment, victim mentality",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd301eb50bf0b212412b9"
//             ],
//             "zodiacal": [
//                 "65fdc97aeb50bf0b212412ae"
//             ]
//         },
//         "divinatoryMeaning": [
//             "interference",
//             "invasion",
//             "poaching"
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
//         "cardDescription": "The Nine of Swords depicts a woman that is sitting on her bed while she holds her head in her hands. It appears as though the woman has just awakened from a very bad nightmare. She seems to be upset, anxious and fearful. Nine swords are hanging on her wall, and a carving that depicts a person defeated by another can be found in her bed. The quilt has been decorated with various astrological symbols and roses. Here we see the same woman in that we saw earlier in the Eight of Swords - and perhaps, she was finally released, but haunted by the nightmares of the suffering she endured while she was left and deserted.",
//         "arcana": "Minor",
//         "title": "Nine of "+suit,
//         "reversedEffect": "Inner turmoil, deep-seated fears, secrets, releasing worry",
//         "uprightEffect": "Anxiety, worry, fear, depression, nightmares",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd30deb50bf0b212412ba"
//             ],
//             "zodiacal": [
//                 "65fdc97aeb50bf0b212412ae"
//             ]
//         },
//         "divinatoryMeaning": [
//             "cruelty",
//             "suffering",
//             "pain"
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
//         "cardDescription": "Another one of the most striking and ominous cards in the deck, the Ten of Swords shows a man lying flat on the ground with his face facing the dirt. He is covered with a red cloth from the chest down to his legs. Ten long swords are stabbed into his back, he may not have seen this end coming. There is a terrible stillness in the air: the sky above him is black and cloudy indicating the fear and negativity associated with death. The waters in front of him are still, with no ripples - adding to the eerie stillness and finality of this card. Looking into the horizon, in the east, the sun is rising, and the weather seems very calm despite the darkness. The Ten of Swords seems to intimate that this is the lowest point in one's life, and it cannot get worse than this. At least, even in this state, the sun is rising.\n",
//         "arcana": "Minor",
//         "title": "Ten of "+suit,
//         "reversedEffect": "Recovery, regeneration, resisting an inevitable end",
//         "uprightEffect": "Painful endings, deep wounds, betrayal, loss, crisis",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd353eb50bf0b212412be"
//             ],
//             "zodiacal": [
//                 "65fdc97aeb50bf0b212412ae"
//             ]
//         },
//         "divinatoryMeaning": [
//             "ruin",
//             "disintegration",
//             "decay"
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
//         "cardDescription": "The Page of Swords card is representative of a person in one's life who shows an abundance of energy. With wind-blown trees, turbulent clouds and the their tossed hair, a youth stands proudly on a rocky precipice. This energetic youth has a sword in her hands. Her expression is one of determination, and perhaps a little bit of defiance - she seems ready to pounce at the slightest word.",
//         "arcana": "Minor",
//         "title": "Page of "+suit,
//         "reversedEffect": "Self-expression, all talk and no action, haphazard action, haste",
//         "uprightEffect": "New ideas, curiosity, thirst for knowledge, new ways of communicating",
//         "astroPower": {
//             "mainElement": [
//                 element
//             ],
//             "seasonality": [
//                 "Winter"
//             ],
//             "minorElement": "65fdb360eb50bf0b212412a4"
//         },
//         "divinatoryMeaning": [
//             "curiosity",
//             "restlessness",
//             "mental energy"
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
//         "cardDescription": "What a rush we see this Knight in! The Knight of Swords card depicts a young man who is dressed in his armor and rides a strong white horse into the midst of a battle. The white color of his horse is a reference to the overall purity and intellectual energy which motivates this young rider. The sky behind him holds stormy clouds as well as trees which are tossed wildly around by the strong winds. The horse’s harness is also decorated with images of birds and butterflies. The cape of the knight is also decorated with those same birds.\n\n",
//         "arcana": "Minor",
//         "title": "Knight of "+suit,
//         "reversedEffect": "Restless, unfocused, impulsive, burn-out",
//         "uprightEffect": "Ambitious, action-oriented, driven to succeed, fast-thinking",
//         "astroPower": {
//             "mainElement": [
//                 element
//             ],
//             "minorElement": [
//                 "65fda183eb50bf0b212412a2"
//             ]
//         },
//         "divinatoryMeaning": [
//             "assertive",
//             "direct",
//             "daring"
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
//         "cardDescription": "The Queen of Swords wears a stern look as she sits high on the throne - looking off into the distance. A queen of the air element that the swords represents, her place in the clouds shows that no one can trick or fool her. The sword in her right hand is pointed towards the sky, whereas the left hand is extended like it is offering something. The Queen of Swords gives us the gift of judgment for everyday decisions and having the flexibility to take in knowledge from others.\n\n",
//         "arcana": "Minor",
//         "title": "Queen of "+suit,
//         "reversedEffect": "Overly-emotional, easily influenced, bitchy, cold-hearted",
//         "uprightEffect": "Independent, unbiased judgement, clear boundaries, direct communication",
//         "astroPower": {
//             "mainElement": [
//                 element
//             ],
//             "minorElement": [
//                 "65fdc33deb50bf0b212412a9"
//             ]
//         },
//         "divinatoryMeaning": [
//             "honest",
//             "independent",
//             "principled"
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
//         "cardDescription": "The King of Swords tarot card shows a king who sits on his throne while holding a double-edged sword that points upwards in his right hand. The King of Swords radiates intellectual power, clear thinking, truth, and authority. He understands that power holds great responsibility.\n\nThe blue tunic that the king wears is a symbol of his spiritual understanding. The butterflies on the back of his throne are indicative of transformation.",
//         "arcana": "Minor",
//         "title": "King of "+suit,
//         "reversedEffect": "Quiet power, inner truth, misuse of power, manipulation",
//         "uprightEffect": "Mental clarity, intellectual power, authority, truth",
//         "astroPower": {
//             "mainElement": [
//                 element
//             ],
//             "minorElement": [
//                 "65fdc3b7eb50bf0b212412aa"
//             ]
//         },
//         "divinatoryMeaning": [
//             "reason",
//             "discipline",
//             "integrity"
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