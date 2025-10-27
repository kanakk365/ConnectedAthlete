"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video } from "lucide-react"

export default function LiveStream() {
  return (
    <Card className="bg-card border-border h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <Video className="w-5 h-5 text-primary" />
          Live Training Sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="w-full flex-1 rounded-lg overflow-hidden bg-black" />
      </CardContent>
    </Card>
  )
}
