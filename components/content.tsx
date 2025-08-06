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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Health Metrics</h2>
        <HealthCharts />
      </div>

      {/* Second Row - Calendar and Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CalendarWidget />
        <Announcements />
      </div>

      {/* Third Row - Team Invites and File Uploads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InviteTeam />
        <FileUploads />
      </div>

      {/* Fourth Row - Live Stream (full width) */}
      <div>
        <LiveStream />
      </div>
    </div>
  )
}
