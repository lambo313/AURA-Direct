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


const suits = ["cups", "swords", "pentacles"]

const suit = 'Cups'
const suitLower = suit.toLowerCase()
const element = '65fdc33deb50bf0b212412a9'


// const handleAddCards = async () => {
//   const cardsToAdd = [
//     {
//         "cardImage": "/images/minor-arcana/"+suitLower+"/"+suitLower+"-01-ace.webp",
//         "cardDescription": "In the Ace of Cups card, there is a hand emanating from the clouds holding out a cup, as if in a offer to the querent to take a drink. This cup is overflowing with sparkling water which symbolizes pure and pristine emotion. If you take this offer, drinking from this cup will surely bring you nothing short of emotional as well as spiritual fulfillment.\n\nIn order to obtain the kind of emotional or spiritual fulfillment that is depicted in the Ace of Cups, the querent will need to follow this inner voice, and remain true to it, regardless of the situation. This will require emotional discipline, but the rewards that this can bring are hinted at within the card itself: overflowing joy and happiness.",
//         "arcana": "Minor",
//         "title": "Ace of "+suit,
//         "reversedEffect": "Self-love, intuition, repressed emotions.",
//         "uprightEffect": "Love, new relationships, compassion, creativity.",
//         "astroPower": {
//             "elemental": [
//                 element
//             ]
//         },
//         "divinatoryMeaning": [
//             "loving",
//             "emotional",
//             "harness"
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
//         "cardDescription": "This card shows an image of a man and a woman that are exchanging their cups in a ceremony. There is the symbol of Hermes’ caduceus in between which is often related to negotiation, trade, cosmic energy, protection, proper conduct, and duality. The Two of Cups refers to something quite positive, for it is one of the most auspicious cards in the tarot for relationships, whether romantic, business or otherwise. It suggests a new partnership is in the works, and it will be created with balance, respect, and honor. Above the caduceus is a chimera, which symbolizes fire and passion also governs this partnership.",
//         "arcana": "Minor",
//         "title": "Two of "+suit,
//         "reversedEffect": "Self-love, break-ups, disharmony, distrust.",
//         "uprightEffect": "Unified love, partnership, mutual attraction",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd315eb50bf0b212412bb"
//             ],
//             "zodiacal": [
//                 "65fdc9cbeb50bf0b212412af"
//             ]
//         },
//         "divinatoryMeaning": [
//             "love",
//             "harmony",
//             "unified"
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
//         "cardDescription": "When you draw the Three of Cups, you will see three women lifting their cups up in the air in a celebration of some sort. Good times are in the air, for the three ladies have wreaths made of flowers in their hair. Wreaths are often associated with success and victory, so their happiness is well deserved. The ladies are also seen standing on top of a field of flowers and fruit, further adding to the joyful feelings in this card. There are feelings of beauty, growth, compassion and happiness that the women share between each other.\n\nAn interesting note though, in the Rider-Waite the woman in the middle is turned away from the reader and her face hidden from view. However, the two other maidens are seen smiling.",
//         "arcana": "Minor",
//         "title": "Three of "+suit,
//         "reversedEffect": "Independence, alone time, hardcore partying, ‘three’s a crowd’.",
//         "uprightEffect": "Celebration, friendship, creativity, collaborations.",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd320eb50bf0b212412bc"
//             ],
//             "zodiacal": [
//                 "65fdc9cbeb50bf0b212412af"
//             ]
//         },
//         "divinatoryMeaning": [
//             "abundance",
//             "profuse",
//             "plentiful"
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
//         "cardDescription": "The Four of Cups displays a young man sitting under a tree on a mountaintop, far from others. He seems to be in contemplation and meditation. In front of him are three cups laying on the grass while another cup is being offered to him by a hand in the air. The man has crossed his hand and legs, and he is looking down at the three cups, unimpressed, such that he cannot see the cup being presented to him by the stretched arm. The Four of Cups represents our tendency to take for granted the things that we have, making it hard for us to see what treasures the universe presents us with. We tend to have the answers to our troubles right around us, but we tend to focus too much on what we do not have.",
//         "arcana": "Minor",
//         "title": "Four of "+suit,
//         "reversedEffect": "Retreat, withdrawal, checking in for alignment.",
//         "uprightEffect": "Meditation, contemplation, apathy, reevaluation.",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd32eeb50bf0b212412bd"
//             ],
//             "zodiacal": [
//                 "65fdc9cbeb50bf0b212412af"
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
//         "cardDescription": "There are certain Tarot cards whose imagery immediately conjure up negative emotions, and the Five of Cups carries such weight. This is a card which signifies loss as well as the painful challenges which stem from that particular loss. The card depicts a figure that is wearing a black cloak. The person hides his face in what seems to be despair. There are five cups on the ground, three of which have fallen while the other two remain standing. The person, however, seem to notice that there are two standing cups as is too busy mourning over those which are fallen. There is a powerful river which flows between him and a house or a castle in the distance, indicating that a torrent of emotions have separated him from home.",
//         "arcana": "Minor",
//         "title": "Five of "+suit,
//         "reversedEffect": "Personal setbacks, self-forgiveness, moving on.",
//         "uprightEffect": "Regret, failure, disappointment, pessimism.",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd30deb50bf0b212412ba"
//             ],
//             "zodiacal": [
//                 "65fdcc15eb50bf0b212412b3"
//             ]
//         },
//         "divinatoryMeaning": [
//             "dissappointment",
//             "nonfulfillment",
//             "displeasure"
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
//         "cardDescription": "The Six of Cups symbolize the joy of nostalgia, the comfort of home and childhood innocence. In the card itself, there are six cups filled with white flowers. Two children are depicted in the foreground, and one is passing a cup to another. This handing of the flowers from the boy to the girl shows the passing of traditions and happy reunions. The children seem to be in a castle of sorts, that we can imagine give them a sense of security and comfort.",
//         "arcana": "Minor",
//         "title": "Six of "+suit,
//         "reversedEffect": "Living in the past, forgiveness, lacking playfulness.",
//         "uprightEffect": "Revisiting the past, childhood memories, innocence, joy.",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd353eb50bf0b212412be"
//             ],
//             "zodiacal": [
//                 "65fdcc15eb50bf0b212412b3"
//             ]
//         },
//         "divinatoryMeaning": [
//             "pleasure",
//             "well-being",
//             "bliss"
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
//         "cardDescription": "The Seven of Cups symbolizes imagination, choice, wishful thinking, illusion and fantasy. The card shows person with their back turned towards us, contemplating 7 images that are creeping out of the cups, all of which are floating in the clouds. Clouds are a representation of dreams, illusions, thoughts and imagination. There are numerous fantasies that are appearing from the cups, which are representative of the many visions that one sees while dreaming. The Seven of Cups may imply that you have a number of options to choose from.\n\n",
//         "arcana": "Minor",
//         "title": "Seven of "+suit,
//         "reversedEffect": "Alignment, personal values, overwhelmed by choices.",
//         "uprightEffect": "Opportunities, choices, wishful thinking, illusion.",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd315eb50bf0b212412bb"
//             ],
//             "zodiacal": [
//                 "65fdcc15eb50bf0b212412b3"
//             ]
//         },
//         "divinatoryMeaning": [
//             "debauch",
//             "debase",
//             "corrupt"
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
//         "cardDescription": "In the Eight of Cups, we are confronted with the moment of transition. We see a cloaked figure taking off to a barren land leaving behind eight golden cups. He is tired of what those cups that he has spent so much time collecting, and is now setting out to seeking a higher purpose. It may be a result of a boredom or unhappiness that comes with realizing that whatever they have been looking for in life isn’t as pleasurable or as satisfying as they once assumed it would be.\n\nThe person undertaking this journey might also signify be seeking excitement in the unknown. The mountainous barren lands that he sets off to can also be symbols of facing new challenges. Their stark emptiness seem to indicate that they are waiting for one to come and shape the. The journey that is taken can be done in the guise of trying out new things that have the potential to help one grow both mentally as well as spiritually.\n\nIt also shows the willingness to detach oneself from others so that one can work on self-improvement, self-understanding and growth.",
//         "arcana": "Minor",
//         "title": "Eight of "+suit,
//         "reversedEffect": "Trying one more time, indecision, aimless drifting, walking away.",
//         "uprightEffect": "Disappointment, abandonment, withdrawal, escapism.",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd2f1eb50bf0b212412b8"
//             ],
//             "zodiacal": [
//                 "65fdc723eb50bf0b212412ab"
//             ]
//         },
//         "divinatoryMeaning": [
//             "indolence",
//             "laziness",
//             "sloth"
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
//         "cardDescription": "In this card, a middle-aged man is sitting on a wooden bench while his arms are crossed, and his face are showing quite a level of contentment. He is dressed elegantly and has the look of the true satisfaction. The head-dress on his head is red, and is a depiction of his active mind. At his background, you will notice there are nine golden cups, structured and arranged in an orderly manner. The Nine of Cups symbolizes a representation of fulfillment and success, both spiritually and materially. The man shows that expression of success after achieving his innermost desire.",
//         "arcana": "Minor",
//         "title": "Nine of "+suit,
//         "reversedEffect": "Inner happiness, materialism, dissatisfaction, indulgence.",
//         "uprightEffect": "Contentment, satisfaction, gratitude, wish come true.",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd301eb50bf0b212412b9"
//             ],
//             "zodiacal": [
//                 "65fdc723eb50bf0b212412ab"
//             ]
//         },
//         "divinatoryMeaning": [
//             "happiness",
//             "achievements",
//             "success"
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
//         "cardDescription": "On the Ten of Cups, there is a couple holding each other while facing a beautiful house and a green garden. Beside them, there are two children playing joyously. The couple is seen holding each other in a loving and romantic embrace, while the children are freely playing. The couple seems to be in a stable relationship, while also blessed with the abundance of a comfortable home and beautiful children. The green land signifies fertility, and the river shows how freely the feelings of the couple are flowing, meaning that their relationship is quite peaceful. Above in the sky, there are ten cups, shaped in an arc, which are meant to symbolize blessings from heaven. The rainbow behind them shows the end of hard times and sorrows, and a new happy life where each and every one of the family will enjoy. The Ten of Cups card depicts ‘having it all’\n",
//         "arcana": "Minor",
//         "title": "Ten of "+suit,
//         "reversedEffect": "Disconnection, misaligned values, struggling relationships.",
//         "uprightEffect": "Divine love, blissful relationships, harmony, alignment.",
//         "astroPower": {
//             "elemental": [
//                 element
//             ],
//             "planetary": [
//                 "65fdd30deb50bf0b212412ba"
//             ],
//             "zodiacal": [
//                 "65fdc723eb50bf0b212412ab"
//             ]
//         },
//         "divinatoryMeaning": [
//             "satiety",
//             "fulfillment",
//             "satisfaction"
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
//         "cardDescription": "The Page of Cups represents the unexpected inspiration that comes to us from the unconscious, perhaps in ways that we may not truly understand. In this card, a youth at the seashore wears a blue tunic adorned with floral prints, and holds a golden cup. She also wears a beret that looks quite bohemian, and a long flowing scarf. She is surprised by a fish that pops out of the cup, as if to greet her from a fairytale. She can neither drink nor toast with the cup as the fish stares at her and seemingly tries to engage with her.",
//         "arcana": "Minor",
//         "title": "Page of "+suit,
//         "reversedEffect": "New ideas, doubting intuition, creative blocks, emotional immaturity.",
//         "uprightEffect": "Creative opportunities, intuitive messages, curiosity, possibility.",
//         "astroPower": {
//             "mainElement": [
//                 element
//             ],
//             "seasonality": [
//                 "Fall"
//             ],
//             "minorElement": "65fdb360eb50bf0b212412a4"
//         },
//         "divinatoryMeaning": [
//             "sensitivity",
//             "naivete",
//             "innocence"
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
//         "cardDescription": "The Knight of Cups is a card which depicts a young knight who is gloriously riding a white horse while at the same time holding a cup as if he is a messenger of a certain sort. Unlike the Knight of Wands or the Knight of Swords, this particular one isn’t charging along with his horse. He is instead moving slowly forward which provides the entire setting an overall impression of peace and calmness. The horse is known to represent one's drive, energy, and power. The horse's color is white, which is a well-known symbol of spirituality, light, and purity.\n\n",
//         "arcana": "Minor",
//         "title": "Knight of "+suit,
//         "reversedEffect": "Overactive imagination, unrealistic, jealous, moody.",
//         "uprightEffect": "Creativity, romance, charm, imagination, beauty.",
//         "astroPower": {
//             "mainElement": [
//                 element
//             ],
//             "minorElement": [
//                 "65fda183eb50bf0b212412a2"
//             ]
//         },
//         "divinatoryMeaning": [
//             "idealist",
//             "charming",
//             "graceful"
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
//         "cardDescription": "The Queen of Cups rules the emotional realm. She is the woman whose throne is right on the ocean’s edge, and water is typically symbolic of the unconscious and feeling. Her position at the shore indicates that she lies between land and sea, the place where feeling and thought exist. She holds a cup that has handles shaped like an angel. This cup is closed, which is why the Queen of Cups symbolizes the thoughts that come with our unconscious mind. The queen sits alone, which allows her to think. The calmness of the water and the sky symbolizes the serene mind of the queen. Her feet are not touching the water, which stands for her looking at her thoughts and feelings from the outside.\n\n",
//         "arcana": "Minor",
//         "title": "Queen of "+suit,
//         "reversedEffect": "Inner feelings, self-care, self-love, co-dependency.",
//         "uprightEffect": "Compassionate, caring, emotionally stable, intuitive, in flow.",
//         "astroPower": {
//             "mainElement": [
//                 element
//             ],
//             "minorElement": [
//                 "65fdc33deb50bf0b212412a9"
//             ]
//         },
//         "divinatoryMeaning": [
//             "compassion",
//             "supportive",
//             "kindness"
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
//         "cardDescription": "The King of Cups is a card in the tarot that shows generosity, control, and emotional balance. The card itself depicts a king seated on a throne, who has an amulet that is shaped like a fish. The fish in his necklace represents his creativity and spirit, which thrives on the calm waters that surround him. We can see from the background that there is a steady balance between the conscious and unconscious.\n\nBehind the king, there is a fish jumping out of the ocean on the right side, and a ship on the left side, representative of the emotional and material worlds respectively. The King of Cups shows that you do not suppress your impulses, but have learned to deal with them in a balanced manner.",
//         "arcana": "Minor",
//         "title": "King of "+suit,
//         "reversedEffect": "Self-compassion, inner feelings, moodiness, emotionally manipulative.",
//         "uprightEffect": "Emotionally balanced, compassionate, diplomatic.",
//         "astroPower": {
//             "mainElement": [
//                 element
//             ],
//             "minorElement": [
//                 "65fdc3b7eb50bf0b212412aa"
//             ]
//         },
//         "divinatoryMeaning": [
//             "devoted",
//             "wise",
//             "counsellor"
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