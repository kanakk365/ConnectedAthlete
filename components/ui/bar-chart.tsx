"use client"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A bar chart with steps data"

const chartData = [
  { day: "Mon", steps: 2400 },
  { day: "Tue", steps: 3200 },
  { day: "Wed", steps: 2800 },
  { day: "Thu", steps: 3600 },
  { day: "Fri", steps: 4200 },
  { day: "Sat", steps: 3800 },
  { day: "Sun", steps: 3100 },
]

const chartConfig = {
  steps: {
    label: "Steps",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartBarDefault() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Steps</CardTitle>
        <CardDescription>Steps count for the week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="steps" fill="var(--color-steps)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
