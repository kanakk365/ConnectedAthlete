"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ChartBarDefault } from "@/components/ui/bar-chart";
import { ChartPieDonut } from "@/components/ui/pie-chart";

const metricCards = [
  {
    title: "Calories",
    value: "457",
    unit: "Kcal",
    image: "/calories.png",
    color: "#dc767c",
  },
  {
    title: "Step Count",
    value: "4,795",
    unit: "Steps",
    image: "/step.png",
    color: "#547aff",
  },
  {
    title: "Sleep",
    value: "7.23",
    unit: "Hours",
    image: "/sleep.png",
    color: "#6f73e2",
  },
  {
    title: "Heart Rate",
    value: "72",
    unit: "BPM",
    image: "/heart.png",
    color: "#9161ff",
  },
] as const;

export default function HealthCharts() {
  return (
    <div className="space-y-6">
      {/* Top Row - Metric Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map(({ title, value, unit, image, color }) => (
          <Card
            key={title}
            className="relative overflow-hidden border-0 p-0 text-white"
            style={{ backgroundColor: color }}
          >
            <CardContent className="relative flex h-full flex-col justify-center p-6">
              <div>
                <p className="text-sm font-medium text-white/70">{title}</p>
                <p className="mt-3 text-3xl font-semibold leading-none">
                  {value}
                </p>
                <p className="text-xs font-medium text-white/60">
                  {unit}
                </p>
              </div>
              <div className="absolute bottom-4 right-4">
                <Image
                  src={image}
                  alt={title}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Second Row - Charts */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartBarDefault />
        <ChartPieDonut />
      </div>
    </div>
  );
}
