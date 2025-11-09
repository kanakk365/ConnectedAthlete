"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ChartBarDefault } from "@/components/ui/bar-chart";
import { ChartPieDonut } from "@/components/ui/pie-chart";
import { HeartRateLineChart } from "@/components/ui/heart-rate-line-chart";
import { WeightLineChart } from "@/components/ui/weight-line-chart";
import { SleepDurationBarChart } from "@/components/ui/sleep-duration-bar-chart";
import { CaloriesBarChart } from "@/components/ui/calories-bar-chart";
import { DistanceLineChart } from "@/components/ui/distance-line-chart";
import { ActiveZoneMinutesBarChart } from "@/components/ui/active-zone-minutes-bar-chart";
import { SpO2LineChart } from "@/components/ui/spo2-line-chart";
import { BodyMetricsLineChart } from "@/components/ui/body-metrics-line-chart";
import { useCallback, useEffect, useRef, useState } from "react";
import { isAuthorized } from "@/lib/fitbit/api";
import { getActivitiesSummaryToday, getActiveZoneMinutesTimeSeries, getBMITimeSeries, getBodyFatTimeSeries, getBodyToday, getCaloriesTimeSeries, getDistanceTimeSeries, getDistanceToday, getHeart7d, getHeartRateTimeSeries, getSleepTimeSeries, getSleepToday, getSpO2TimeSeries, getSpO2Today, getSteps7d, getTemperatureToday, getWeightTimeSeries } from "@/lib/fitbit/endpoints";
import { clearPendingPkce } from "@/lib/fitbit/pkce";
import { clearTokens } from "@/lib/fitbit/token-store";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { FITBIT_CLIENT_ID, FITBIT_DEFAULT_SCOPE, FITBIT_REDIRECT_URI } from "@/lib/fitbit/config";
import { buildAuthorizeUrl, createPkce, savePendingPkce, getPendingPkce } from "@/lib/fitbit/pkce";
import { exchangeCodeForToken } from "@/lib/fitbit/client";

type MetricCard = { title: string; value: string; unit: string; image: string; color: string };

export default function HealthCharts() {
  const router = useRouter();
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<MetricCard[]>([
    { title: "Calories", value: "—", unit: "Kcal", image: "/calories.png", color: "#dc767c" },
    { title: "Step Count", value: "—", unit: "Steps", image: "/step.png", color: "#547aff" },
    { title: "Sleep", value: "—", unit: "Hours", image: "/sleep.png", color: "#6f73e2" },
    { title: "Heart Rate", value: "—", unit: "BPM", image: "/heart.png", color: "#9161ff" },
    { title: "Weight", value: "—", unit: "kg", image: "/heart.png", color: "#6366f1" },
    { title: "SpO2", value: "—", unit: "%", image: "/heart.png", color: "#06b6d4" },
    { title: "Temperature", value: "—", unit: "°C", image: "/heart.png", color: "#ec4899" },
    { title: "Distance", value: "—", unit: "km", image: "/step.png", color: "#8b5cf6" },
  ]);
  const [weeklySteps, setWeeklySteps] = useState<Array<{ day: string; steps: number }>>([]);
  const [sleepDonut, setSleepDonut] = useState<Array<{ name: string; value: number; fill: string }>>([]);
  const [heartRateData, setHeartRateData] = useState<Array<{ date: string; heartRate: number }>>([]);
  const [weightData, setWeightData] = useState<Array<{ date: string; weight: number }>>([]);
  const [sleepData, setSleepData] = useState<Array<{ date: string; hours: number }>>([]);
  const [caloriesData, setCaloriesData] = useState<Array<{ date: string; calories: number }>>([]);
  const [distanceData, setDistanceData] = useState<Array<{ date: string; distance: number }>>([]);
  const [activeZoneMinutesData, setActiveZoneMinutesData] = useState<Array<{ date: string; minutes: number }>>([]);
  const [spo2Data, setSpo2Data] = useState<Array<{ date: string; spo2: number }>>([]);
  const [bodyMetricsData, setBodyMetricsData] = useState<Array<{ date: string; weight?: number; bmi?: number; bodyFat?: number }>>([]);
  const searchParams = useSearchParams();
  const processedCodeRef = useRef<string | null>(null);

  const generateDummyData = useCallback(() => {
    const today = new Date();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    const dummyWeeklySteps = last7Days.map((date) => ({
      day: days[date.getDay()],
      steps: Math.floor(Math.random() * 5000) + 5000, // 5000-10000 steps
    }));

    const totalSleepHours = 7 + Math.random() * 2; // 7-9 hours
    const deepHours = totalSleepHours * 0.2;
    const lightHours = totalSleepHours * 0.5;
    const remHours = totalSleepHours * 0.2;
    const awakeHours = totalSleepHours * 0.1;
    const dummySleepDonut = [
      { name: 'Deep Sleep', value: +(deepHours).toFixed(2), fill: '#6366f1' },
      { name: 'Light Sleep', value: +(lightHours).toFixed(2), fill: '#ec4899' },
      { name: 'REM Sleep', value: +(remHours).toFixed(2), fill: '#8b5cf6' },
      { name: 'Awake', value: +(awakeHours).toFixed(2), fill: '#a78bfa' },
    ];

    const dummyHeartRateData = last7Days.map((date) => ({
      date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      heartRate: Math.floor(Math.random() * 10) + 58, // 58-68 BPM
    }));

    const baseWeight = 70 + Math.random() * 5; // 70-75 kg
    const dummyWeightData = last7Days.map((date) => ({
      date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      weight: +(baseWeight + (Math.random() - 0.5) * 0.5).toFixed(1), // Small variations
    }));

    const dummySleepData = last7Days.map((date) => ({
      date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      hours: +(7 + Math.random() * 2).toFixed(2), // 7-9 hours
    }));

    const dummyCaloriesData = last7Days.map((date) => ({
      date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      calories: Math.floor(Math.random() * 1000) + 1500, // 1500-2500 calories
    }));

    const dummyDistanceData = last7Days.map((date) => ({
      date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      distance: +(Math.random() * 5 + 3).toFixed(2), // 3-8 km
    }));

    const dummyActiveZoneMinutes = last7Days.map((date) => ({
      date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      minutes: Math.floor(Math.random() * 60) + 20, // 20-80 minutes
    }));

    const dummySpo2Data = last7Days.map((date) => ({
      date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      spo2: +(95 + Math.random() * 3).toFixed(1), // 95-98%
    }));

    const dummyBodyMetrics = last7Days.map((date) => ({
      date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      weight: +(baseWeight + (Math.random() - 0.5) * 0.5).toFixed(1),
      bmi: +(22 + Math.random() * 2).toFixed(1), // 22-24 BMI
      bodyFat: +(15 + Math.random() * 5).toFixed(1), // 15-20% body fat
    }));

    setWeeklySteps(dummyWeeklySteps);
    setSleepDonut(dummySleepDonut);
    setHeartRateData(dummyHeartRateData);
    setWeightData(dummyWeightData);
    setSleepData(dummySleepData);
    setCaloriesData(dummyCaloriesData);
    setDistanceData(dummyDistanceData);
    setActiveZoneMinutesData(dummyActiveZoneMinutes);
    setSpo2Data(dummySpo2Data);
    setBodyMetricsData(dummyBodyMetrics);

    setMetrics([
      { title: "Calories", value: "2,145", unit: "Kcal", image: "/calories.png", color: "#dc767c" },
      { title: "Step Count", value: "8,432", unit: "Steps", image: "/step.png", color: "#547aff" },
      { title: "Sleep", value: "7.85", unit: "Hours", image: "/sleep.png", color: "#6f73e2" },
      { title: "Heart Rate", value: "62", unit: "BPM", image: "/heart.png", color: "#9161ff" },
      { title: "Weight", value: "72.5", unit: "kg", image: "/heart.png", color: "#6366f1" },
      { title: "SpO2", value: "97.2", unit: "%", image: "/heart.png", color: "#06b6d4" },
      { title: "Temperature", value: "36.8", unit: "°C", image: "/heart.png", color: "#ec4899" },
      { title: "Distance", value: "5.43", unit: "km", image: "/step.png", color: "#8b5cf6" },
    ]);
  }, []);

  const onConnect = useCallback(async () => {
    setError(null);
    if (!FITBIT_CLIENT_ID) {
      setError("Missing NEXT_PUBLIC_FITBIT_CLIENT_ID env var");
      return;
    }
    try {
      const { codeVerifier, codeChallenge } = await createPkce();
      const state = Math.random().toString(36).slice(2);
      savePendingPkce({ codeVerifier, createdAt: Date.now(), state });
      const url = buildAuthorizeUrl({
        clientId: FITBIT_CLIENT_ID,
        redirectUri: FITBIT_REDIRECT_URI,
        scope: FITBIT_DEFAULT_SCOPE,
        codeChallenge,
        state,
        prompt: "consent",
      });
      window.location.assign(url);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to start Fitbit auth";
      setError(msg);
    }
  }, []);

  useEffect(() => {
    setConnected(isAuthorized());
  }, []);

  useEffect(() => {
    if (!connected) {
      generateDummyData();
    }
  }, [connected, generateDummyData]);

  useEffect(() => {
    const code = searchParams.get("code");
    const err = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (!code && !err) return;

    if (code && processedCodeRef.current === code) return;

    router.replace("/dashboard");

    (async () => {
      if (err) {
        setError(errorDescription || err);
        clearPendingPkce();
        return;
      }

      if (!code) return;

      processedCodeRef.current = code;

      const pending = getPendingPkce();
      if (!pending) {
        setError("Missing PKCE verifier from session. Please try connecting again.");
        return;
      }

      clearPendingPkce();

      try {
        await exchangeCodeForToken({
          code,
          redirectUri: FITBIT_REDIRECT_URI,
          clientId: FITBIT_CLIENT_ID,
          codeVerifier: pending.codeVerifier,
        });
        setConnected(true);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Token exchange failed";
        setError(msg);
        processedCodeRef.current = null;
      }
    })();
  }, [router, searchParams]);

  useEffect(() => {
    (async () => {
      if (!connected) return;
      try {
        setError(null);
        const [stepsJson, heartJson, sleepJson, actJson, bodyJson, spo2Json, tempJson, distanceJson] = await Promise.all([
          getSteps7d(),
          getHeart7d(),
          getSleepToday(),
          getActivitiesSummaryToday(),
          getBodyToday().catch(() => null),
          getSpO2Today().catch(() => null),
          getTemperatureToday().catch(() => null),
          getDistanceToday().catch(() => null),
        ]);

        const stepsSeries = stepsJson["activities-steps"] || [];
        const stepsToday = stepsSeries.length ? Number(stepsSeries[stepsSeries.length - 1].value || 0) : 0;
        const mappedSteps = stepsSeries.map((d: { dateTime: string; value: string }) => ({
          day: new Date(d.dateTime).toLocaleDateString(undefined, { weekday: 'short' }),
          steps: Number(d.value || 0),
        }));
        setWeeklySteps(mappedSteps);

        const heartSeries = heartJson["activities-heart"] || [];
        let rhr = "—";
        for (let i = heartSeries.length - 1; i >= 0; i--) {
          const entry = heartSeries[i];
          if (entry?.value && typeof entry.value === 'object' && typeof entry.value.restingHeartRate === 'number') {
            rhr = String(entry.value.restingHeartRate);
            break;
          }
        }

        const minutesAsleep = sleepJson?.summary?.totalMinutesAsleep ?? 0;
        const hoursSleep = minutesAsleep ? (minutesAsleep / 60).toFixed(2) : "—";

        type SleepEntry = { dateOfSleep?: string; levels?: { summary?: { deep?: { minutes?: number }, light?: { minutes?: number }, rem?: { minutes?: number }, wake?: { minutes?: number } } } };
        const rawSleep = (sleepJson as unknown as { sleep?: unknown[] })?.sleep;
        const sleepEntries: SleepEntry[] = Array.isArray(rawSleep) ? (rawSleep as SleepEntry[]) : [];
        const latestSleep = sleepEntries.length
          ? sleepEntries.sort((a, b) => String(a.dateOfSleep || "").localeCompare(String(b.dateOfSleep || ""))).pop()
          : null;
        const lvl = latestSleep?.levels?.summary || {};
        const deepMin = typeof lvl.deep?.minutes === 'number' ? lvl.deep.minutes : 0;
        const lightMin = typeof lvl.light?.minutes === 'number' ? lvl.light.minutes : 0;
        const remMin = typeof lvl.rem?.minutes === 'number' ? lvl.rem.minutes : 0;
        const wakeMin = typeof lvl.wake?.minutes === 'number' ? lvl.wake.minutes : 0;
        setSleepDonut([
          { name: 'Deep Sleep', value: +(deepMin / 60).toFixed(2), fill: '#6366f1' },
          { name: 'Light Sleep', value: +(lightMin / 60).toFixed(2), fill: '#ec4899' },
          { name: 'REM Sleep', value: +(remMin / 60).toFixed(2), fill: '#8b5cf6' },
          { name: 'Awake', value: +(wakeMin / 60).toFixed(2), fill: '#a78bfa' },
        ]);

        const calories = actJson?.summary?.caloriesOut ?? 0;

        let weightValue = "—";
        if (bodyJson?.weight && Array.isArray(bodyJson.weight) && bodyJson.weight.length > 0) {
          const latestWeight = bodyJson.weight.sort((a, b) => 
            String(b.dateTime || "").localeCompare(String(a.dateTime || ""))
          )[0];
          if (latestWeight.value) {
            weightValue = latestWeight.value.toFixed(1);
          }
        }

        let spo2Value = "—";
        if (spo2Json?.value && Array.isArray(spo2Json.value) && spo2Json.value.length > 0) {
          const latestSpo2 = spo2Json.value.sort((a, b) => 
            String(b.dateTime || "").localeCompare(String(a.dateTime || ""))
          )[0];
          if (latestSpo2.value?.avg !== undefined) {
            spo2Value = latestSpo2.value.avg.toFixed(1);
          }
        }

        let tempValue = "—";
        if (tempJson?.value && Array.isArray(tempJson.value) && tempJson.value.length > 0) {
          const latestTemp = tempJson.value.sort((a, b) => 
            String(b.dateTime || "").localeCompare(String(a.dateTime || ""))
          )[0];
          if (latestTemp.value !== undefined) {
            tempValue = latestTemp.value.toFixed(1);
          }
        }

        let distanceValue = "—";
        if (distanceJson?.["activities-distance"] && Array.isArray(distanceJson["activities-distance"]) && distanceJson["activities-distance"].length > 0) {
          const todayDistance = distanceJson["activities-distance"][distanceJson["activities-distance"].length - 1];
          if (todayDistance?.value !== undefined && todayDistance?.value !== null) {
            const distanceNum = typeof todayDistance.value === 'string' 
              ? Number(todayDistance.value) 
              : typeof todayDistance.value === 'number' 
                ? todayDistance.value 
                : Number(todayDistance.value);
            if (!isNaN(distanceNum) && isFinite(distanceNum)) {
              distanceValue = distanceNum.toFixed(2);
            }
          }
        }

        setMetrics((prev) => prev.map((m) => {
          if (m.title === "Calories") return { ...m, value: calories ? calories.toLocaleString() : "—" };
          if (m.title === "Step Count") return { ...m, value: stepsToday.toLocaleString() };
          if (m.title === "Sleep") return { ...m, value: String(hoursSleep) };
          if (m.title === "Heart Rate") return { ...m, value: String(rhr) };
          if (m.title === "Weight") return { ...m, value: weightValue };
          if (m.title === "SpO2") return { ...m, value: spo2Value };
          if (m.title === "Temperature") return { ...m, value: tempValue };
          if (m.title === "Distance") return { ...m, value: distanceValue };
          return m;
        }));

        try {
          const [
            heartRateSeries,
            weightSeries,
            sleepSeries,
            caloriesSeries,
            distanceSeries,
            activeZoneSeries,
            spo2Series,
            bodyFatSeries,
            bmiSeries
          ] = await Promise.all([
            getHeartRateTimeSeries('7d').catch(() => null),
            getWeightTimeSeries('30d').catch(() => null),
            getSleepTimeSeries('7d').catch(() => null),
            getCaloriesTimeSeries('7d').catch(() => null),
            getDistanceTimeSeries('7d').catch(() => null),
            getActiveZoneMinutesTimeSeries('7d').catch(() => null),
            getSpO2TimeSeries('7d').catch(() => null),
            getBodyFatTimeSeries('30d').catch(() => null),
            getBMITimeSeries('30d').catch(() => null),
          ]);

          if (heartRateSeries?.["activities-heart"]) {
            const formatted = heartRateSeries["activities-heart"]
              .map((entry) => {
                const rhr = typeof entry.value === 'object' && entry.value?.restingHeartRate
                  ? entry.value.restingHeartRate
                  : null;
                return rhr !== null ? {
                  date: new Date(entry.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                  heartRate: rhr,
                } : null;
              })
              .filter((entry): entry is { date: string; heartRate: number } => entry !== null)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setHeartRateData(formatted);
          }

          if (weightSeries?.weight) {
            const formatted = weightSeries.weight
              .map((entry) => ({
                date: entry.dateTime ? new Date(entry.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '',
                weight: entry.value || 0,
              }))
              .filter(entry => entry.weight > 0 && entry.date)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setWeightData(formatted);
          }

          if (sleepSeries?.sleep) {
            const formatted = sleepSeries.sleep
              .map((entry) => ({
                date: entry.dateOfSleep ? new Date(entry.dateOfSleep).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '',
                hours: entry.summary?.totalMinutesAsleep ? (entry.summary.totalMinutesAsleep / 60) : 0,
              }))
              .filter(entry => entry.hours > 0 && entry.date)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setSleepData(formatted);
          }

          if (caloriesSeries?.["activities-calories"]) {
            const formatted = caloriesSeries["activities-calories"]
              .map((entry) => {
                const val = typeof entry.value === 'string' ? Number(entry.value) : entry.value || 0;
                return {
                  date: entry.dateTime ? new Date(entry.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '',
                  calories: val,
                };
              })
              .filter(entry => entry.calories > 0 && entry.date)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setCaloriesData(formatted);
          }

          if (distanceSeries?.["activities-distance"]) {
            const formatted = distanceSeries["activities-distance"]
              .map((entry) => {
                const val = typeof entry.value === 'string' ? Number(entry.value) : entry.value || 0;
                return {
                  date: entry.dateTime ? new Date(entry.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '',
                  distance: val,
                };
              })
              .filter(entry => entry.distance > 0 && entry.date)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setDistanceData(formatted);
          }

          if (activeZoneSeries?.["activities-active-zone-minutes"]) {
            const formatted = activeZoneSeries["activities-active-zone-minutes"]
              .map((entry) => ({
                date: entry.dateTime ? new Date(entry.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '',
                minutes: entry.value?.totalMinutes || 0,
              }))
              .filter(entry => entry.minutes > 0 && entry.date)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setActiveZoneMinutesData(formatted);
          }

          if (spo2Series?.value) {
            const formatted = spo2Series.value
              .map((entry) => ({
                date: entry.dateTime ? new Date(entry.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '',
                spo2: entry.value?.avg || 0,
              }))
              .filter(entry => entry.spo2 > 0 && entry.date)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setSpo2Data(formatted);
          }

          const bodyMetricsMap = new Map<string, { weight?: number; bmi?: number; bodyFat?: number }>();
          
          if (weightSeries?.weight) {
            weightSeries.weight.forEach(entry => {
              if (entry.dateTime && entry.value) {
                const dateKey = new Date(entry.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                if (!bodyMetricsMap.has(dateKey)) {
                  bodyMetricsMap.set(dateKey, {});
                }
                bodyMetricsMap.get(dateKey)!.weight = entry.value;
              }
            });
          }

          if (bmiSeries?.["body-bmi"]) {
            bmiSeries["body-bmi"].forEach(entry => {
              if (entry.dateTime && entry.value) {
                const dateKey = new Date(entry.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                if (!bodyMetricsMap.has(dateKey)) {
                  bodyMetricsMap.set(dateKey, {});
                }
                bodyMetricsMap.get(dateKey)!.bmi = entry.value;
              }
            });
          }

          if (bodyFatSeries?.fat) {
            bodyFatSeries.fat.forEach(entry => {
              if (entry.dateTime && entry.value) {
                const dateKey = new Date(entry.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                if (!bodyMetricsMap.has(dateKey)) {
                  bodyMetricsMap.set(dateKey, {});
                }
                bodyMetricsMap.get(dateKey)!.bodyFat = entry.value;
              }
            });
          }

          const bodyMetricsFormatted = Array.from(bodyMetricsMap.entries())
            .map(([date, metrics]) => ({ date, ...metrics }))
            .filter(entry => entry.date && (entry.weight !== undefined || entry.bmi !== undefined || entry.bodyFat !== undefined))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          setBodyMetricsData(bodyMetricsFormatted);
        } catch (e: unknown) {
          console.error("Failed to fetch time-series data:", e);
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to fetch Fitbit data";
        setError(msg);
      }
    })();
  }, [connected]);

  return (
    <div className="space-y-6">
      {!connected && (
        <div className="flex items-center justify-between rounded-md border p-4">
          <div>
            <p className="text-sm text-muted-foreground">Connect your Fitbit to see live data.</p>
          </div>
          <button onClick={onConnect} className="inline-flex items-center rounded bg-blue-600 px-3 py-2 text-white">
            Connect Fitbit
          </button>
        </div>
      )}
      {connected && (
        <div className="rounded-md border p-4">
          <div className="flex items-center justify-end">
            <button
              onClick={() => { clearTokens(); clearPendingPkce(); setConnected(false); router.push('/dashboard'); }}
              className="inline-flex items-center rounded bg-red-600 px-2 py-1 text-xs text-white"
            >
              Disconnect Fitbit
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {metrics.map(({ title, value, unit, image, color }) => (
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
                  width={(title === "Sleep" || title === "Heart Rate") ? 60 : 40}
                  height={(title === "Sleep" || title === "Heart Rate") ? 60 : 40}
                  className="object-contain"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <ChartBarDefault data={weeklySteps} />
          <ChartPieDonut data={sleepDonut} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <HeartRateLineChart data={heartRateData} />
          <WeightLineChart data={weightData} />
          <SpO2LineChart data={spo2Data} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SleepDurationBarChart data={sleepData} />
          <CaloriesBarChart data={caloriesData} />
          <DistanceLineChart data={distanceData} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ActiveZoneMinutesBarChart data={activeZoneMinutesData} />
          <BodyMetricsLineChart data={bodyMetricsData} />
        </div>
      </div>
    </div>
  );
}
