"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { FullScreenCalendar } from "./full-screen-calendar";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "training" | "medical" | "competition";
}

const events: Event[] = [
  {
    id: "1",
    title: "Morning Training",
    date: "2024-01-15",
    time: "08:00",
    type: "training",
  },
  {
    id: "2",
    title: "Medical Checkup",
    date: "2024-01-16",
    time: "14:00",
    type: "medical",
  },
  {
    id: "3",
    title: "Team Practice",
    date: "2024-01-17",
    time: "16:00",
    type: "training",
  },
  {
    id: "4",
    title: "Recovery Session",
    date: "2024-01-18",
    time: "10:00",
    type: "training",
  },
  {
    id: "5",
    title: "Nutrition Consultation",
    date: "2024-01-19",
    time: "12:00",
    type: "medical",
  },
  {
    id: "6",
    title: "Competition Prep",
    date: "2024-01-20",
    time: "15:00",
    type: "competition",
  },
  {
    id: "7",
    title: "Evening Workout",
    date: "2024-01-21",
    time: "18:00",
    type: "training",
  },
  {
    id: "8",
    title: "Physio Session",
    date: "2024-01-22",
    time: "11:00",
    type: "medical",
  },
];

export default function CalendarWidget() {
  // Convert events to the format expected by FullScreenCalendar
  const calendarData = events.map((event) => ({
    day: new Date(event.date),
    events: [
      {
        id: parseInt(event.id),
        name: event.title,
        time: event.time,
        datetime: `${event.date}T${event.time}:00`,
      },
    ],
  }));

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "training":
        return "bg-primary";
      case "medical":
        return "bg-destructive";
      case "competition":
        return "bg-chart-2";
      default:
        return "bg-muted-foreground";
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Calendar
          </CardTitle>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Event
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <FullScreenCalendar data={calendarData} />
          </div>

          {/* Upcoming Events Section */}
          <div className="space-y-4 ">
            <h4 className="text-lg font-semibold text-card-foreground">
              Upcoming Events
            </h4>
            <div className="space-y-3 max-h-[31.8rem] h-full overflow-y-auto scrollbar-thin">
              {events.slice(0, 8).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 px-4 py-1 rounded-lg bg-muted border border-border shadow-sm hover:bg-muted/80 transition-colors"
                >
                  <div
                    className={`w-4 h-4 rounded-full ${getEventTypeColor(
                      event.type
                    )} shadow-sm`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-card-foreground truncate">
                      {event.title}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">
                      {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
