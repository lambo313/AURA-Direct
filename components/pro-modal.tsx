"use client"

import { useProModal } from "@/hooks/use-pro-modal"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Badge } from "./ui/badge";
import { MessageSquare, Music, Image, Code, Video, Check, Zap, View, Layers, FileStack   } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";


const tools = [
  {
    label: "Tarot Deck",
    icon: Layers,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    href: '/tarotdeck'
  },
  {
    label: "Tarot Reader",
    icon: View,
    color: "text-green-700",
    bgColor: "bg-green-500/10",
    href: '/tarotreader'
  },
  {
    label: "Saved Readings",
    icon: FileStack,
    color: "text-pink-700",
    bgColor: "bg-pink-500/10",
    href: '/savedreadings'
  },
  // {
  //   label: "Music Generation",
  //   icon: Music,
  //   color: "text-emerald-500",
  //   bgColor: "bg-emerald-500/10",
  //   href: '/music'
  // },
  // {
  //   label: "Video Generation",
  //   icon: Video,
  //   color: "text-orange-700",
  //   bgColor: "bg-orange-700/10",
  //   href: '/video'
  // }
]

export const ProModal = () => {

  const proModal = useProModal();
  const [loading, setLoading] = useState(false);


  const onSubscribe = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");

      window.location.href = (response).data.url;
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
                    <div className="flex items-center gap-x-2 font-bold py-1">
                      Upgrade to AURA Direct
                      <Badge className="uppercase tex-sm py-1" variant="premium">
                        pro
                      </Badge>
                    </div>
                </DialogTitle>
                <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
                {tools.map((tool) => (
                  <Card
                    key={tool.label}
                    className="p-3 border-black/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-x-4">
                      <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                        <tool.icon className={cn("w-6 h-6", tool.color)}/>
                      </div>
                      <div className="font=semibold text-sm">
                        {tool.label}
                      </div>
                    </div>
                    <Check className="text-primary w-5 h-5"/>

                  </Card>
                ))}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                disabled={loading}
                onClick={onSubscribe}
                size="lg"
                variant="premium"
                className="w-full"
              >
                Upgrade
                <Zap className="w-4 h-4 ml-2 fill-white"/>
              </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
