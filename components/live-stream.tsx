"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, Play, Users, Maximize2, Volume2 } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

interface LiveStream {
  id: string
  title: string
  instructor: string
  viewers: number
  duration: string
  thumbnail: string
  isLive: boolean
}

const liveStreams: LiveStream[] = [
  {
    id: "1",
    title: "Morning Cardio Session",
    instructor: "Coach Martinez",
    viewers: 24,
    duration: "45 min",
    thumbnail: "/placeholder.svg?height=200&width=300",
    isLive: true,
  },
  {
    id: "2",
    title: "Recovery & Stretching",
    instructor: "Therapist Anna",
    viewers: 12,
    duration: "30 min",
    thumbnail: "/placeholder.svg?height=200&width=300",
    isLive: false,
  },
]

export default function LiveStream() {
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(liveStreams[0])

  return (
    <Card className="bg-card border-border h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <Video className="w-5 h-5 text-primary" />
          Live Training Sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1 overflow-y-auto scrollbar-thin">
          {/* Main Stream Player */}
          {selectedStream && (
            <div className="relative rounded-lg overflow-hidden bg-black">
              <Image
                src={selectedStream.thumbnail || "/placeholder.svg"}
                alt={selectedStream.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <Button size="lg" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white">
                  <Play className="w-6 h-6 mr-2" />
                  {selectedStream.isLive ? "Join Live" : "Watch Recording"}
                </Button>
              </div>

              {/* Live indicator */}
              {selectedStream.isLive && (
                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  LIVE
                </div>
              )}

              {/* Controls */}
              <div className="absolute bottom-3 right-3 flex gap-2">
                <Button variant="ghost" size="sm" className="bg-black bg-opacity-50 text-white hover:bg-opacity-70">
                  <Volume2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="bg-black bg-opacity-50 text-white hover:bg-opacity-70">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Stream Info */}
          {selectedStream && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-card-foreground">{selectedStream.title}</h3>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>with {selectedStream.instructor}</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {selectedStream.viewers} viewers
                  </div>
                  <span>{selectedStream.duration}</span>
                </div>
              </div>
            </div>
          )}

          {/* Stream List */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-card-foreground">Available Sessions</h4>
            <div className="space-y-2">
              {liveStreams.map((stream) => (
                <div
                  key={stream.id}
                  onClick={() => setSelectedStream(stream)}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedStream?.id === stream.id
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  <div className="relative">
                    <Image
                      src={stream.thumbnail || "/placeholder.svg"}
                      alt={stream.title}  
                      width={64}
                      height={48}
                      className="w-16 h-12 object-cover rounded"
                    />
                    {stream.isLive && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">{stream.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {stream.instructor} • {stream.viewers} viewers
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">{stream.duration}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
