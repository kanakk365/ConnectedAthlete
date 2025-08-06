"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlus, Mail, Stethoscope, BellIcon as Whistle, Users } from "lucide-react"
import { useState } from "react"

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
        return <Stethoscope className="w-4 h-4 text-red-500" />
      case "coach":
        return <Whistle className="w-4 h-4 text-blue-500" />
      case "therapist":
        return <Users className="w-4 h-4 text-green-500" />
      default:
        return <Users className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
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
    <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-blue-500" />
          Team Members
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Invite Form */}
          <div className="space-y-3 p-3 bg-gray-50 dark:bg-[#1F1F23] rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Invite New Member</h4>
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
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#0F0F12] text-gray-900 dark:text-white text-sm"
              >
                <option value="doctor">Doctor</option>
                <option value="coach">Coach</option>
                <option value="therapist">Therapist</option>
              </select>
            </div>
            <Button onClick={handleInvite} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              <Mail className="w-4 h-4 mr-2" />
              Send Invitation
            </Button>
          </div>

          {/* Current Team Members */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Current Team</h4>
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-[#1F1F23]">
                  <img src={member.avatar || "/placeholder.svg"} alt={member.name} className="w-8 h-8 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(member.role)}
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{member.name}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{member.email}</p>
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
