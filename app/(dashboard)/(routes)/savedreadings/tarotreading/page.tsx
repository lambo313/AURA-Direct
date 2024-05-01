"use client"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-hot-toast";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation'
import { Heading } from "@/components/heading";
import { File, CircleEllipsis, Trash2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import ReactMarkdown from "react-markdown";
import { ITarotCard } from "@/models/TarotCards";
import { ITarotReadingDocument } from "@/models/tarotReading";
import ReadingMat from "@/components/reading-mat";
import ReadingMat2 from '@/components/reading-mat2';
import { ObjectId } from "mongoose";
import { string } from "zod";
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


import { Form, FormControl, FormField, FormItem, FormDescription, FormLabel, FormMessage, } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const formSchema2 = z.object({
  title: z.string().optional(),
  notes: z.string().optional()
})


const TarotReadingPage = () => {
  const router = useRouter();

  const [cards, setCards] = useState<ITarotCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<ITarotCard[]>([]);
  const [reading, setReading] = useState<ITarotReadingDocument>();
  const [readingTopic, setReadingTopic] = useState<string>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const id = searchParams.get('id')

  const detailsForm = useForm<z.infer<typeof formSchema2>>({
    resolver: zodResolver(formSchema2),
    defaultValues: {
      title: "",
      notes: ""
    },
  })

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
            body: JSON.stringify({ id: id }),
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

  useEffect(() => {
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
          // console.log("Titles Array: ", titlesArray)
          // console.log("Topic: ", readingTopic)
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

          // console.log("Reordered Dealt Cards: ", reorderedCards);
          setCards(reorderedCards);
        } catch (error) {
          console.error("Failed to fetch card details:", error);
        }
      };

      fetchCardsDetails(reading.cards);
    }
  }, [reading]);

  const handleTarotCardClick = (card: ITarotCard) => {
    if (card) {
      // console.log('THE CARD!!!',card);
      router.push(`/tarotdeck/tarotcard/?id=${card}`);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/deleteSavedReadings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch saved reading: ${response.status}`);
      }

      const deletedReading = await response.json();

      router.push(`/savedreadings`);
    } catch (error) {
      console.error("Error deleting saved reading:", error);
    }
  };

  const handleEdit = async () => {
    setIsEditing(true);
  }

  const handleCancelEdit = async () => {
    setIsEditing(false); // Set editing mode to false after saving
  }

  const handleSaveEdit = async () => {
    try {
      const { title, notes } = detailsForm.getValues();
      const response = await fetch(`/api/updateSavedReading`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, title: title, notes: notes}),
      });
      if (!response.ok) {
        throw new Error(`Failed to update saved reading: ${response.status}`);
      }

      const updatedReading = await response.json();

    } catch (error) {
      console.error("Error updating saved reading:", error);
    }

    setIsEditing(false); // Set editing mode to false after saving
    toast.success("Reading Details Updated!")
    window.location.reload();
  }


  if (!reading) {
    return <div>Loading...</div>; // Show loading indicator while fetching the reading
  }

  return (
    <div className="pb-20">
      <Heading
        title="Tarot Reading"
        description="Your AI generated reading."
        icon={File}
        iconColor="text-amber-700"
        bgColor="bg-amber-700/10"
      />
      <Tabs defaultValue='tarot-reader' className="w-full">
        <div className="font-semibold text-center">{readingTopic}</div>
        <div className="font-light text-center">
          {new Date(reading.readingDate).toLocaleString()}
        </div>
        <Popover>
          <PopoverTrigger asChild className="flex m-auto mb-2 cursor-pointer">
            <CircleEllipsis />
          </PopoverTrigger>
          <PopoverContent className="flex flex-row">

            <Dialog>
              <DialogTrigger className="flex mx-auto ">
                <Trash2 />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription className="flex flex-col">
                    This action cannot be undone. This will permanently delete the current
                    reading.
                    <Button
                      variant={"destructive"}
                      className="w-1/2 m-auto mt-4"
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>

                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Pencil className="flex mx-auto cursor-pointer" onClick={handleEdit} />

          </PopoverContent>
        </Popover>

        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="tarot-reader">AURA</TabsTrigger>
          <TabsTrigger className="w-full" value="add-details">Additional Details</TabsTrigger>
        </TabsList>
        <TabsContent value="tarot-reader">
          <div className="px-4 lg:px-8">
            <div key={reading.id}>
              {/* Dealt Cards Section */}
              <div className="h-full">
                {(reading.spread === '1-Card' || reading.spread === '4-Card') && (
                  <ReadingMat
                    cards={cards} // Assuming dealtCards is a property of the reading object
                    onCardRemove={handleCardRemove}
                    positions={['']}
                    onCardClick={handleTarotCardClick}
                  />
                )}
                {reading.spread === 'Celtic-Cross' && (
                  <ReadingMat2
                    cards={cards}
                    onCardRemove={handleCardRemove}
                    positions={[]}
                    onCardClick={handleTarotCardClick}
                  />
                )}
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
        </TabsContent>
        <TabsContent className="" value="add-details">
          {/* Additional Details here. */}
          {/* <Pencil className="mx-auto mt-6 cursor-pointer" onClick={handleEdit}/> */}
          <Form {...detailsForm}>
            <form className="space-y-8 glassmorphism max-w-2xl w-10/12 mx-auto mt-2">
              <FormField
                control={detailsForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    {isEditing ? ( 
                    <FormControl>
                      <Input 
                      placeholder="Enter Title(Optional)" {...field} />
                    </FormControl>
                    ) : ( 
                      <h3><strong>{reading.title}</strong></h3>
                    )}
                    <FormDescription>
                      This is your reading title.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={detailsForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    {isEditing ? ( 
                    <FormControl>
                      <Textarea placeholder="Enter Notes(Optional)" {...field} />
                    </FormControl>
                    ) : ( 
                      <p>{reading?.notes}</p>
                    )}
                    <FormDescription>
                      These are your reading notes.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </TabsContent>

        {isEditing && (
                <div className="flex flex-row">
                  <Button variant={"destructive"} onClick={handleCancelEdit} className="mx-auto flex my-4">Cancel</Button>
                  <Button onClick={handleSaveEdit} className="mx-auto flex my-4">Save Changes</Button>
                </div>
              )}

      </Tabs>

    </div>
  );
};

export default TarotReadingPage;
