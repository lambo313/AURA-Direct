"use client"

import { useRouter } from "next/navigation";
import { ArrowRight, MessageSquare, Music, Image, Code, Video, View, Layers, FileStack  } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

const DashboardPage = () => {
  const router = useRouter();
  return (
    <div>
      <div className="mb-8 space-y-4">
        {/* <div className="flex items-center justify-center"> */}
          <h2 className="text-2xl md:text-4xl font-bold text-center">
          Explore the power of{' '}
          <span className="golden_gradient">
            AURA
          </span>
          </h2>
          
        {/* </div> */}
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Experience Imagination.
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) => (
          <Card
            onClick={()=> router.push(tool.href)}
            key={tool.href}
            className = "p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 2-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)}/>
              </div>
              <div className="font-semibold">
                {tool.label}
              </div>
            </div>
              <ArrowRight className="w-5 h-5"/>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default DashboardPage;