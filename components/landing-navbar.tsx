"use client"

import { Montserrat } from "next/font/google"
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const font = Montserrat({
    weight: "600",
    subsets: ["latin"]
})

export const LandingNavbar = () => {
  const { isSignedIn } = useAuth();
  
  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
        <Link href="/" className="flex items-center">
            <div className="relative h-14 w-14 mr-0.5">
                <Image
                    fill
                    alt="Logo"
                    src="/logo.png"
                    priority
                />
            </div>
            <div className="flex flex-col">
                <h1 className={cn("text-2xl font-bold rainbow_gradient_1 text-center -mb-2", font.className)}>
                    AURA
                </h1>
                <h2 className={cn("text-xs font-bold rainbow_gradient_2 text-center", font.className)}>
                    Direct
                </h2>
            </div>
        </Link>
        <div className="flex items-center gap-x-2">
            <Link href={isSignedIn ? "dashboard" : "/sign-up"}>
                <Button variant="outline" className="rounded-full">
                    Get Started
                </Button>
            </Link>
        </div>
    </nav>
  )
}
