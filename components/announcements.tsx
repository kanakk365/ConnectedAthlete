"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Megaphone, Pin, Clock } from "lucide-react"

interface Announcement {
  id: string
  title: string
  content: string
  author: string
  timestamp: string
  priority: "high" | "medium" | "low"
  pinned: boolean
}

const announcements: Announcement[] = [
  {
    id: "1",
    title: "New Training Schedule",
    content: "Updated training schedule for next week. Please check your calendar for changes.",
    author: "Coach Martinez",
    timestamp: "2 hours ago",
    priority: "high",
    pinned: true,
  },
  {
    id: "2",
    title: "Medical Check-up Reminder",
    content: "Don't forget your quarterly medical check-up scheduled for this Friday.",
    author: "Dr. Smith",
    timestamp: "1 day ago",
    priority: "medium",
    pinned: false,
  },
  {
    id: "3",
    title: "Equipment Maintenance",
    content: "Gym equipment will be under maintenance this weekend. Alternative training location provided.",
    author: "Facility Manager",
    timestamp: "2 days ago",
    priority: "low",
    pinned: false,
  },
]

export default function Announcements() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-primary bg-primary/10"
      case "medium":
        return "border-l-chart-4 bg-chart-4/10"
      case "low":
        return "border-l-chart-2 bg-chart-2/10"
      default:
        return "border-l-border bg-muted"
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-primary" />
            Announcements
          </CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`p-3 rounded-lg border-l-4 ${getPriorityColor(announcement.priority)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-card-foreground">{announcement.title}</h4>
                  {announcement.pinned && <Pin className="w-3 h-3 text-primary" />}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {announcement.timestamp}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
              <p className="text-xs text-muted-foreground">By {announcement.author}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
