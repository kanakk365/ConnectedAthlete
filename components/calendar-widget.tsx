"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Plus, CalendarDays, MapPin } from "lucide-react";
import { FullScreenCalendar } from "./full-screen-calendar";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "training" | "medical" | "competition";
  location?: string;
}

const events: Event[] = [
  {
    id: "1",
    title: "IBA Men's World Boxing Championship",
    date: "2025-08-11",
    time: "09:00",
    type: "competition",
    location: "Uttarakhand",
  },
  {
    id: "2",
    title: "Awareness Session - Anti Doping",
    date: "2025-08-11",
    time: "14:00",
    type: "training",
    location: "NS NIS Patiala",
  },
  {
    id: "3",
    title: "Asian Boxing Championship",
    date: "2025-08-11",
    time: "16:00",
    type: "competition",
    location: "Thailand",
  },
  {
    id: "4",
    title: "Morning Training Session",
    date: "2025-08-12",
    time: "08:00",
    type: "training",
    location: "Training Center",
  },
  {
    id: "5",
    title: "Medical Checkup",
    date: "2025-08-13",
    time: "10:00",
    type: "medical",
    location: "Medical Center",
  },
  {
    id: "6",
    title: "Team Strategy Meeting",
    date: "2025-08-14",
    time: "15:00",
    type: "training",
    location: "Conference Room",
  },
  {
    id: "7",
    title: "Awareness Session - Anti Doping",
    date: "2025-08-11",
    time: "14:00",
    type: "training",
    location: "NS NIS Patiala",
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
      case "competition":
        return "bg-[#9161ff]"; // Purple color for competitions
      case "training":
        return "bg-blue-500"; // Blue for training
      case "medical":
        return "bg-blue-500"; // Blue for medical
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full bg-card border  rounded-lg p-6 mt-8">
      {/* Left Section - Calendar */}
      <div className="lg:col-span-2 space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Calendar
          </h2>
          <Button size="sm" className="">
            <Plus className="w-4 h-4 mr-1" />
            Add event
          </Button>
        </div>

        {/* Calendar */}
        <div className="bg-card rounded-lg border">
          <FullScreenCalendar data={calendarData} />
        </div>
      </div>

      {/* Right Section - Schedules */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Schedules</h3>
        <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-4 rounded-lg bg-[#0f0f1a] relative overflow-hidden"
            >
              {/* Left colored bar */}
              <div className={`w-1 h-full ${getEventTypeColor(event.type)} absolute left-0 top-0 rounded-r-full`}></div>

              <div className="flex-1 min-w-0 pl-3">
                <p className="text-white font-medium text-sm leading-tight">
                  {event.title}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-slate-400 text-xs flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(event.date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }).replace(/\//g, '-')}
                  </span>
                  {event.location && (
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
