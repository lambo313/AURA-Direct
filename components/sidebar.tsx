'use client'

import Image from "next/image"
import Link from "next/link"
import { Montserrat } from "next/font/google"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  MessageSquare, 
  ImageIcon, 
  VideoIcon, 
  Music,
  Code,
  View, 
  Layers, 
  FileStack,
  Settings } from "lucide-react"
import { FreeCounter } from "./free-counter"



const montserrat = Montserrat({ 
  weight: '600',
  subsets: ['latin']
})

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-sky-500',
  },
  {
    label: 'Tarot Deck',
    icon: Layers,
    href: '/tarotdeck',
    color: 'text-violet-500',
  },
  {
    label: 'Tarot Reader',
    icon: View,
    href: '/tarotreader',
    color: 'text-green-700',
  },
  {
    label: 'Saved Readings',
    icon: FileStack,
    href: '/savedreadings',
    color: 'text-pink-700',
  },
  // {
  //   label: 'Video Generation',
  //   icon: VideoIcon,
  //   href: '/video',
  //   color: 'text-orange-700',
  // },
  // {
  //   label: 'Music Generation',
  //   icon: Music,
  //   href: '/music',
  //   color: 'text-emerald-500',
  // },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
   
  }
]

interface SidebarProps {
  apiLimitCount: number;
  isPro: boolean;
};


const Sidebar = ({
  apiLimitCount = 0,
  isPro = false

}: SidebarProps) => {
  const pathname = usePathname();

  // bg-[#111827]
  return (
    <div className="space-y-4 py-4 flex flex-col h-full glassmorphism text-white overflow-y-scroll hide-scrollbar">
      <div className="px-3 py-2 flex-1">
        <Link href='/dashboard' className="flex justify-center items-center mb-14">
          <div className="relative h-14 w-14 mr-0.5">
            <Image 
              fill
              alt='Logo'
              src='/logo.png'
              priority
              sizes="small"
            />
          </div>
          <div className="flex flex-col">
            <h1 className={cn ("text-2xl font-bold golden_gradient text-center -mb-2", montserrat.className)}>
              AURA
            </h1>
            <h2 className={cn("text-xs font-bold golden_gradient text-center", montserrat.className)}>
              Direct
            </h2>
          </div>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link 
              href={route.href}
              key={route.href}
              className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
              pathname === route.href ? "text-white bg-white/10" : "text-zing-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn('h-5 w-5 mr-3', route.color)}/>
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <FreeCounter
        isPro={isPro}
        apiLimitCount={apiLimitCount}
      />
    </div>
  )
}

export default Sidebar