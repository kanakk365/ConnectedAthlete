"use client"

import type React from "react"
import { CartesianGrid, Line, LineChart, XAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Activity, Footprints, Flame, Clock, Moon, Heart, TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const stepsData = [
  { time: "6AM", value: 0 },
  { time: "9AM", value: 2500 },
  { time: "12PM", value: 5200 },
  { time: "3PM", value: 7800 },
  { time: "6PM", value: 10500 },
  { time: "9PM", value: 12000 },
]

const caloriesData = [
  { time: "6AM", value: 0 },
  { time: "9AM", value: 150 },
  { time: "12PM", value: 420 },
  { time: "3PM", value: 680 },
  { time: "6PM", value: 950 },
  { time: "9PM", value: 1200 },
]

const activeEnergyData = [
  { time: "6AM", value: 0 },
  { time: "9AM", value: 85 },
  { time: "12PM", value: 240 },
  { time: "3PM", value: 380 },
  { time: "6PM", value: 520 },
  { time: "9PM", value: 650 },
]

const standMinutesData = [
  { time: "6AM", value: 0 },
  { time: "9AM", value: 3 },
  { time: "12PM", value: 6 },
  { time: "3PM", value: 8 },
  { time: "6PM", value: 10 },
  { time: "9PM", value: 12 },
]

const awakeData = [
  { day: "Mon", hours: 16.5 },
  { day: "Tue", hours: 15.8 },
  { day: "Wed", hours: 16.2 },
  { day: "Thu", hours: 15.5 },
  { day: "Fri", hours: 16.8 },
  { day: "Sat", hours: 17.2 },
  { day: "Sun", hours: 15.9 },
]

const heartRateData = [
  { time: "6AM", value: 58 },
  { time: "9AM", value: 62 },
  { time: "12PM", value: 68 },
  { time: "3PM", value: 72 },
  { time: "6PM", value: 65 },
  { time: "9PM", value: 60 },
]

// Customized dot component for pinging animation
const CustomizedDot = (props: React.SVGProps<SVGCircleElement>) => {
  const { cx, cy, stroke } = props

  return (
    <g>
      {/* Main dot */}
      <circle cx={cx} cy={cy} r={3} fill={stroke} />
      {/* Ping animation circles */}
      <circle
        cx={cx}
        cy={cy}
        r={3}
        stroke={stroke}
        fill="none"
        strokeWidth="1"
        opacity="0.8"
      >
        <animate
          attributeName="r"
          values="3;10"
          dur="1s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.8;0"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  )
}

interface HealthChartCardProps {
  title: string
  value: string
  unit: string
  icon: React.ReactNode
  data: Array<Record<string, string | number>>
  color: string
  dataKey: string
  xAxisKey: string
  chartType: 'dotted' | 'glowing' | 'pinging'
  trend?: string
}

function HealthChartCard({ 
  title, 
  value, 
  unit, 
  icon, 
  data, 
  color, 
  dataKey, 
  xAxisKey, 
  chartType,
  trend = "5.2%"
}: HealthChartCardProps) {
  const renderChart = () => {
    switch (chartType) {
      case 'dotted':
        return (
          <LineChart data={data}>
           
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={(value) => value.slice(0, 3)}
              fontSize={10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "none",
                borderRadius: "8px",
                color: "white",
              }}
            />
            <Line
              dataKey={dataKey}
              type="linear"
              stroke={color}
              dot={false}
              strokeDasharray="4 4"
              strokeWidth={2}
            />
          </LineChart>
        )
      
      case 'glowing':
        return (
          <LineChart data={data}>
           
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={(value) => value.slice(0, 3)}
              fontSize={10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "none",
                borderRadius: "8px",
                color: "white",
              }}
            />
            <Line
              dataKey={dataKey}
              type="bump"
              stroke={color}
              dot={false}
              strokeWidth={3}
              filter="url(#rainbow-line-glow)"
            />
            <defs>
              <filter
                id="rainbow-line-glow"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
          </LineChart>
        )
      
      case 'pinging':
        return (
          <LineChart data={data}>
 
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={(value) => value.slice(0, 3)}
              fontSize={10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "none",
                borderRadius: "8px",
                color: "white",
              }}
            />
            <Line
              dataKey={dataKey}
              type="linear"
              stroke={color}
              strokeDasharray="4 4"
              dot={<CustomizedDot />}
              strokeWidth={2}
            />
          </LineChart>
        )
      
      default:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={(value) => value.slice(0, 3)}
              fontSize={10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "none",
                borderRadius: "8px",
                color: "white",
              }}
            />
            <Line
              dataKey={dataKey}
              type="linear"
              stroke={color}
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        )
    }
  }

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            {icon}
            {title}
            <Badge
              variant="outline"
              className="text-primary bg-primary/10 border-none ml-2"
            >
              <TrendingUp className="h-4 w-4" />
              <span>{trend}</span>
            </Badge>
          </CardTitle>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground">{unit}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={80}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default function HealthCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <HealthChartCard
        title="Steps"
        value="12,000"
        unit="steps today"
        icon={<Footprints className="w-4 h-4 text-blue-500" />}
        data={stepsData}
        color="#3b82f6"
        dataKey="value"
        xAxisKey="time"
        chartType="dotted"
        trend="8.5%"
      />
      <HealthChartCard
        title="Calories"
        value="1,200"
        unit="kcal burned"
        icon={<Flame className="w-4 h-4 text-orange-500" />}
        data={caloriesData}
        color="#f97316"
        dataKey="value"
        xAxisKey="time"
        chartType="glowing"
        trend="12.3%"
      />
      <HealthChartCard
        title="Active Energy"
        value="650"
        unit="kcal active"
        icon={<Activity className="w-4 h-4 text-green-500" />}
        data={activeEnergyData}
        color="#22c55e"
        dataKey="value"
        xAxisKey="time"
        chartType="pinging"
        trend="15.7%"
      />
      <HealthChartCard
        title="Stand Minutes"
        value="12"
        unit="hours standing"
        icon={<Clock className="w-4 h-4 text-purple-500" />}
        data={standMinutesData}
        color="#a855f7"
        dataKey="value"
        xAxisKey="time"
        chartType="dotted"
        trend="3.2%"
      />
      <HealthChartCard
        title="Awake Hours"
        value="16.2"
        unit="hours awake"
        icon={<Moon className="w-4 h-4 text-indigo-500" />}
        data={awakeData}
        color="#6366f1"
        dataKey="hours"
        xAxisKey="day"
        chartType="glowing"
        trend="1.8%"
      />
      <HealthChartCard
        title="Resting Heart Rate"
        value="62"
        unit="bpm average"
        icon={<Heart className="w-4 h-4 text-red-500" />}
        data={heartRateData}
        color="#ef4444"
        dataKey="value"
        xAxisKey="time"
        chartType="pinging"
        trend="-2.1%"
      />
    </div>
  )
}
