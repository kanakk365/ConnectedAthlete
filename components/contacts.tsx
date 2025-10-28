"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Contact {
  id: string
  name: string
  role: string
  initials: string
}

const contacts: Contact[] = [
  {
    id: "1",
    name: "Arvind",
    role: "Trainer",
    initials: "A",
  },
  {
    id: "2",
    name: "Anthony",
    role: "Physiotherapist",
    initials: "A",
  },
  {
    id: "3",
    name: "Chris Jones",
    role: "Doctor",
    initials: "C",
  },
  {
    id: "4",
    name: "Davis S",
    role: "Physio therapist",
    initials: "D",
  },
  {
    id: "5",
    name: "Ethan",
    role: "Doctor",
    initials: "E",
  },
  {
    id: "6",
    name: "Esther",
    role: "Physio therapist",
    initials: "D",
  },
]

export default function Contacts() {
  return (
    <Card className="bg-card border border-border h-full flex flex-col">
      <CardHeader className="">
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Contact
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Search Bar */}
        <div className="relative mb-6   ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-10 border-none rounded-lg text-sm !bg-[#0f0f1a]"
          />
        </div>

        {/* Contacts List */}
        <div className="space-y-3 flex-1 overflow-y-auto scrollbar-thin divide-y divide-border ">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center gap-3 py-2 cursor-pointer transition-colors"
            >
              <div className="shrink-0 w-8 h-8 rounded-full bg-[#0f0f1a] flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {contact.initials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">
                  {contact.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {contact.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
