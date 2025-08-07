import HealthCharts from "./health-charts"
import CalendarWidget from "./calendar-widget"
import Announcements from "./announcements"
import InviteTeam from "./invite-team"
import FileUploads from "./file-uploads"
import LiveStream from "./live-stream"

export default function Content() {
  return (
    <div className="space-y-6">
      {/* Health Charts - 6 charts in a grid */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Health Metrics</h2>
        <HealthCharts />
      </div>

      {/* Second Row - Calendar (full width) */}
      <div>
        <CalendarWidget />
      </div>

      {/* Third Row - Team Invites and File Uploads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InviteTeam />
        <Announcements />
        
      </div>

      {/* Fourth Row - Live Stream and File Uploads */}
      <div className="flex flex-row gap-6 h-[600px]">
        <div className="w-full lg:w-3/5 h-full">
          <LiveStream />
        </div>
        <div className="w-full lg:w-2/5 h-full">
          <FileUploads />
        </div>
      </div>
    </div>
  )
}
