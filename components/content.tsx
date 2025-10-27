import HealthCharts from "./health-charts"
import DashboardSection from "./dashboard-section"
import CalendarWidget from "./calendar-widget"
import LiveStream from "./live-stream"
import Gallery from "./gallery"

export default function Content() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Health Metrics</h2>
        <HealthCharts />
      </div>

      <DashboardSection />

      <div>
        <CalendarWidget />
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InviteTeam />
        <Announcements />
      </div> */}

      <div className="flex flex-row gap-6 h-[600px]">
        <div className="w-full h-full">
          <LiveStream />
        </div>
      </div>

      <Gallery />
    </div>
  )
}
