"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlus, Mail, Stethoscope, BellIcon as Whistle, Users } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

interface TeamMember {
  id: string
  name: string
  role: "doctor" | "coach" | "therapist"
  email: string
  status: "active" | "pending" | "inactive"
  avatar: string
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Dr. Sarah Wilson",
    role: "doctor",
    email: "sarah.wilson@hospital.com",
    status: "active",
    avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-02-albo9B0tWOSLXCVZh9rX9KFxXIVWMr.png",
  },
  {
    id: "2",
    name: "Coach Martinez",
    role: "coach",
    email: "martinez@sportsclub.com",
    status: "active",
    avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png",
  },
]

export default function InviteTeam() {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"doctor" | "coach" | "therapist">("doctor")

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "doctor":
        return <Stethoscope className="w-4 h-4 text-destructive" />
      case "coach":
        return <Whistle className="w-4 h-4 text-primary" />
      case "therapist":
        return <Users className="w-4 h-4 text-chart-2" />
      default:
        return <Users className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-chart-2/10 text-chart-2"
      case "pending":
        return "bg-chart-4/10 text-chart-4"
      case "inactive":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleInvite = () => {
    if (email) {
      // Handle invite logic here
      console.log(`Inviting ${email} as ${role}`)
      setEmail("")
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary" />
          Team Members
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Invite Form */}
          <div className="space-y-3 p-3 bg-muted rounded-lg">
            <h4 className="text-sm font-medium text-card-foreground">Invite New Member</h4>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "doctor" | "coach" | "therapist")}
                className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
              >
                <option value="doctor">Doctor</option>
                <option value="coach">Coach</option>
                <option value="therapist">Therapist</option>
              </select>
            </div>
            <Button onClick={handleInvite} className="w-full">
              <Mail className="w-4 h-4 mr-2" />
              Send Invitation
            </Button>
          </div>

          {/* Current Team Members */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-card-foreground">Current Team</h4>
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted">
                  <Image src={member.avatar || "/placeholder.svg"} alt={member.name} width={11} height={11} className="w-3 h-3 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(member.role)}
                      <p className="text-sm font-medium text-card-foreground truncate">{member.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(member.status)}`}>
                    {member.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
