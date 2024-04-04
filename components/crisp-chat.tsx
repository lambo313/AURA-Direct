"use client"

import { useEffect } from "react"
import { Crisp } from "crisp-sdk-web"

export const CrispChat = () => {
    useEffect(() => {
      Crisp.configure("f0414097-f5f6-4501-86db-a77a68c6a3a1")
    }, []);
    
  return null
}

