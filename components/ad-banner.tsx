"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"

export default function AdBanner() {
  return (
    <Card className=" h-full overflow-hidden relative">
     <Image 
       src="/ad.png" 
       alt="Ad Banner" 
       fill
       className="object-cover"
     />
    </Card>
  )
}
