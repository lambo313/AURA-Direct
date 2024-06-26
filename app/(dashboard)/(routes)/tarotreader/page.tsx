'use client'

import React, { useState, useEffect, use } from "react";
import axios from "axios";

import * as z from "zod";

import { Heading } from "@/components/heading"
import { View } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"

import { formSchema } from "./constants";
 
import { Form, FormControl, FormField, FormItem, FormDescription,  FormLabel, FormMessage,} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea"


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OpenAI } from "openai";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";

import ReactMarkdown from "react-markdown";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "react-hot-toast";
import { ITarotCard } from '@/models/TarotCards';
import TarotReading from "@/components/tarot-reading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const formSchema2 = z.object({
  title: z.string().optional(),
  notes: z.string().optional()
})

const TarotReaderPage = () => {
  const proModal = useProModal();
  const router = useRouter();
  

  const [dealtCards, setDealtCards] = useState<ITarotCard[]>([]);
  const [selectedTopicValue, setSelectedTopicValue] = React.useState("");
  const [selectedSpreadValue, setSelectedSpreadValue] = React.useState("");


  const [isGenerated, setIsGenerated] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [messages, setMessages] = useState<OpenAI.Chat.ChatCompletionMessageParam[]>([])
  const [instructionContent, setInstructionContent] = React.useState("");
  const [maxCardsToDeal, setMaxCardsToDeal] = useState(0);

  const handleTopicChange = (value: string) => {
    setSelectedTopicValue(value);
};

const handleSpreadChange = (value: string) => {
  setSelectedSpreadValue(value);
};

useEffect(() => {
  console.log("Selected Spread Value!: ", selectedSpreadValue)
  console.log("Selected Topic Value!: ", selectedTopicValue)
}, [selectedTopicValue, selectedSpreadValue])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "" 
    }
  });

  const detailsForm = useForm<z.infer<typeof formSchema2>>({
    resolver: zodResolver(formSchema2),
    defaultValues: {
      title: "",
      notes: ""
    },
  })

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (selectedSpreadValue === '4-Card') {
      setMaxCardsToDeal(4)
      setInstructionContent("You are a tarot reader being given instructions to perform your tarot reading in the following sequential format: The main components of the information you will receive is a data string seperated by a dash(-). The first item on the list is considered the Topic/Theme of the entire reading - therefore, your first task is to stick to the Topic(if the Topic is specified as General, no need to mention the Topic, otherise, stick to, if not, emphasize the Topic). The second item on the list is considered the Dealt Cards - Your second task is to analyze the Dealt Cards(a comma separated string that you will split into a list) with the following template: index1=Past, index2=Challenge, index3=Advice, index4=Outcome. You must provide your response as an analysis in the form of a list(potentially, nested) with bullet points included and bold the indexes. After each card is analyzed - end the reading with a response that is a detailed summary painting a vivid picture of the entire reading - you are looking to conclude the reading by connecting the card meanings together to get the overall reading analysis in regards to the Topic. Create a fluid narrative by incorporating transitions and connectors to enhance coherence. In the interest of brevity, infuse communication with synonyms, paraphrasing, and a subtle touch of metaphorical language. This not only adds depth but also humanizes the language pattern, making the discourse more engaging and avoiding unnecessary repetition. Interject scenarios, suggestions, and examples throughout the summary - create a script and tell a story!")
    } else if (selectedSpreadValue === '1-Card') {
      setMaxCardsToDeal(1)
      setInstructionContent("You are a tarot reader being given instructions to perform your tarot reading in the following sequential format: The main components of the information you will receive is a data string seperated by a dash(-). The first item on the list is considered the Topic/Theme of the entire reading - therefore, your first task is to stick to the Topic(if the Topic is specified as General, no need to mention the Topic, otherise, stick to, if not, emphasize the Topic). The second item on the list is considered the Dealt Card - Your second task is to analyze the Dealt Card(a string). You must provide your response as an analysis in the form of a list(potentially, nested) with bullet points included and bold the indexes. After the card is analyzed - end the reading with a response that is a detailed summary painting a vivid picture of the entire reading - you are looking to get the overall reading analysis in regards to the Topic. Create a fluid narrative by incorporating transitions and connectors to enhance coherence. In the interest of brevity, infuse communication with synonyms, paraphrasing, and a subtle touch of metaphorical language. This not only adds depth but also humanizes the language pattern, making the discourse more engaging and avoiding unnecessary repetition. Interject scenarios, suggestions, and examples throughout the summary - create a script and tell a story!")
    } else if (selectedSpreadValue === 'Celtic-Cross') {
      setMaxCardsToDeal(10)
      setInstructionContent("You are a tarot reader being given instructions to perform your tarot reading in the following sequential format: The main components of the information you will receive is a data string seperated by a dash(-). The first item on the list is considered the Topic/Theme of the entire reading - therefore, your first task is to stick to the Topic(if the Topic is specified as General, no need to mention the Topic, otherise, stick to, if not, emphasize the Topic). The second item on the list is considered the Dealt Cards - Your second task is to analyze the Dealt Cards(a comma separated string that you will split into a list) with the following template: index1=Where you are now, index2=Potential/challenges, index3=What to focus on, index4=Your past, index5=Your strengths, index6=Near future, index7=Suggested approach, index8=What you need to know, index9=Hopes and fears, index10=Your potential future. You must provide your response as an analysis in the form of a list(potentially, nested) with bullet points included and bold the indexes. After each card is analyzed - end the reading with a response that is a detailed summary painting a vivid picture of the entire reading - you are looking to conclude the reading by connecting the card meanings together to get the overall reading analysis in regards to the Topic. Create a fluid narrative by incorporating transitions and connectors to enhance coherence. In the interest of brevity, infuse communication with synonyms, paraphrasing, and a subtle touch of metaphorical language. This not only adds depth but also humanizes the language pattern, making the discourse more engaging and avoiding unnecessary repetition. Interject scenarios, suggestions, and examples throughout the summary - create a script and tell a story!")
    }
  }, [selectedSpreadValue])


  const instructionMessage = {
    role: "system",
    content: instructionContent
}

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      const userMessage: OpenAI.Chat.ChatCompletionMessageParam = {
        role: "user",
        content: values.prompt
      }
      const newMessages = [...messages, userMessage]

      const response = await axios.post("/api/tarotreader", { messages: newMessages, instructions: instructionMessage });
      console.log("Instruction Message!!: ", instructionMessage)

      setMessages((current) => [...current, userMessage, response.data]);

      form.reset();
      setIsGenerated(true);

    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      router.refresh();
    }
  };



  // Function to handle dealt cards change
    const handleDealtCardsChange = (cards: ITarotCard[]) => {
      setDealtCards(cards);
  };


  // Convert titles to a text string separated by commas
  const dealtCardsString: string = dealtCards.map(card => card.title).join(', ');

  useEffect(() => {
    form.setValue('prompt', selectedTopicValue + " - " + dealtCardsString );
  }, [dealtCardsString, selectedTopicValue, form]);

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

  const handleSaveReading = async () => {

    try {
      if (!messages || messages.length === 0) {
        console.error("No messages available to save.");
        toast.error("No messages available to save.");
        return;
      }
  
      const newReading = {
        userId: userId,
        cards: dealtCards,
        spread: selectedSpreadValue,
        response: messages,
        readingDate: new Date()
      }

      console.log("New Reading: ", newReading)
  
      // Send a POST request to the server endpoint
      const response = await fetch("/api/saveReading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReading),
      });
  
      if (response.ok) {
        toast.success("Reading saved successfully");
        setIsSaved(true);
      } else {
        toast.error("Failed to save reading");
      }
    } catch (error: any) {
      console.error("Error saving tarot reading:", error);
      toast.error("Failed to save reading");
    }
  };
  
  
  

  return (
    <div className="pb-4">
        <Heading
          title="Tarot Reader"
          description="Generate tarot readings using AURA."
          icon={View}
          iconColor="text-green-700"
          bgColor="bg-green-700/10"
        />
        <Tabs defaultValue='tarot-reader' className="w-full">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="tarot-reader">AURA</TabsTrigger>
            <TabsTrigger className="w-full" value="add-details">Additional Details</TabsTrigger>
          </TabsList>
          <TabsContent value="tarot-reader">

          <div className="px-4 lg:px-8">
          <div className="h-full">
            <TarotReading
              onDealtCardsChange={handleDealtCardsChange}
              onTopicChange={handleTopicChange}
              onSpreadChange={handleSpreadChange}
            />
            {/* <div>
                <h2>Dealt Cards:</h2>
                <p>{dealtCardsString}</p>
            </div> */}
          </div>
          <div>
            <Form
              {...form}
            >
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="rounded-lg
                border
                w-full
                p-4
                px-3
                md:px-6
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
                "
              >
                <FormField
                  name="prompt"
                  render={({ field}) => (
                    <FormItem className="col-span-12 lg:col-span-10">
                      <FormControl className="m-0 p-0">
                        <Input
                          className="border-0 outline-none 
                          focus-visible:ring-0 
                          focus-visible:ring-transparent"
                          disabled={true}
                          placeholder="Tarot card reading..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button 
                className="col-span-12 lg:col-span-2 w-full" 
                disabled={isLoading || isGenerated || dealtCards.length < maxCardsToDeal || maxCardsToDeal == 0}
                onClick={() => {
                  // Add your onClick handler logic here
                  
                }}
                >
                  Generate
                </Button>
              </form>
            </Form>
          </div>

          {/* Message Content Section */}
          <div className="space-y-4 mt-4">
            {isLoading && (
              <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                <Loader/>
              </div>
            )}
            {/* Uncomment if you need to display something when there are no messages and not loading */}
            {/* messages.length === 0 && !isLoading && (
              <div>
                <Empty label="No conversation started"/>
              </div>
            ) */}
            <div className="flex flex-col-reverse gap-y-4">
              {messages.filter(message => message.role !== "user").map((message) => (
                <div 
                  key={message.content?.toString()}
                  className={`p-8 w-full flex items-start gap-x-8 rounded-lg ${message.role === "user" ? "bg-white border border-black/10" : "bg-muted"}`}
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
              ))}
            </div>
          </div>
        </div>

          </TabsContent>
          <TabsContent className="glassmorphism max-w-2xl w-10/12 mx-auto mt-2" value="add-details">
            {/* Additional Details here. */}
            <Form {...detailsForm}>
              <form className="space-y-8">
                <FormField
                  control={detailsForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Title(Optional)" {...field} />
                      </FormControl>
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
                      <FormControl>
                        {/* <Input placeholder="Enter Notes(Optional)" {...field} /> */}
                        <Textarea placeholder="Enter Notes(Optional)" {...field}/>
                      </FormControl>
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
        </Tabs>

        
          {/* Save Button Section */}
          {messages.length > 0 && (
            <div className="flex justify-center mt-4">
              <Button 
              onClick={handleSaveReading}
              disabled={isSaved}
              >
              Save Reading
              </Button>
            </div>
          )}
    </div>
  )
}

export default TarotReaderPage