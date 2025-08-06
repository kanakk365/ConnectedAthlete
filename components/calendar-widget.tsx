"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface Event {
  id: string
  title: string
  date: string
  time: string
  type: "training" | "medical" | "competition"
}

const events: Event[] = [
  { id: "1", title: "Morning Training", date: "2024-01-15", time: "07:00", type: "training" },
  { id: "2", title: "Medical Checkup", date: "2024-01-16", time: "14:00", type: "medical" },
  { id: "3", title: "Competition", date: "2024-01-20", time: "10:00", type: "competition" },
]

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((event) => event.date === dateStr)
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "training":
        return "bg-blue-500"
      case "medical":
        return "bg-red-500"
      case "competition":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Calendar
          </CardTitle>
          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="w-4 h-4 mr-1" />
            Add Event
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")} className="p-1 h-8 w-8">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")} className="p-1 h-8 w-8">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <div key={`empty-${i}`} className="p-2 h-10" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const dayEvents = getEventsForDate(day)
              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === currentDate.getMonth() &&
                new Date().getFullYear() === currentDate.getFullYear()

              return (
                <div
                  key={day}
                  className={`p-1 h-10 text-center cursor-pointer rounded-md transition-colors relative ${
                    isToday
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100 dark:hover:bg-[#1F1F23] text-gray-900 dark:text-white"
                  }`}
                  onClick={() => console.log(`Selected date: ${new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()}`)}
                >
                  <span className="text-sm">{day}</span>
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                      {dayEvents.slice(0, 3).map((event, idx) => (
                        <div key={idx} className={`w-1 h-1 rounded-full ${getEventTypeColor(event.type)}`} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Upcoming Events */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Upcoming Events</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {events.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-[#1F1F23]">
                  <div className={`w-2 h-2 rounded-full ${getEventTypeColor(event.type)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{event.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
