"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ChartBarDefault } from "@/components/ui/bar-chart";
import { ChartPieDonut } from "@/components/ui/pie-chart";
import { useCallback, useEffect, useState } from "react";
import { fitbitFetch, isAuthorized } from "@/lib/fitbit/api";
import { getActivitiesSummaryToday, getHeart7d, getSleepToday, getSteps7d } from "@/lib/fitbit/endpoints";
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
  const [profile, setProfile] = useState<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<MetricCard[]>([
    { title: "Calories", value: "—", unit: "Kcal", image: "/calories.png", color: "#dc767c" },
    { title: "Step Count", value: "—", unit: "Steps", image: "/step.png", color: "#547aff" },
    { title: "Sleep", value: "—", unit: "Hours", image: "/sleep.png", color: "#6f73e2" },
    { title: "Heart Rate", value: "—", unit: "BPM", image: "/heart.png", color: "#9161ff" },
  ]);
  const [weeklySteps, setWeeklySteps] = useState<Array<{ day: string; steps: number }>>([]);
  const [sleepDonut, setSleepDonut] = useState<Array<{ name: string; value: number; fill: string }>>([]);
  const searchParams = useSearchParams();

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

  // Inline callback handling on the dashboard
  useEffect(() => {
    (async () => {
      const code = searchParams.get("code");
      const err = searchParams.get("error");
      if (err) {
        setError(err);
        return;
      }
      if (!code) return;
      const pending = getPendingPkce();
      if (!pending) {
        setError("Missing PKCE verifier from session");
        return;
      }
      try {
        await exchangeCodeForToken({
          code,
          redirectUri: FITBIT_REDIRECT_URI,
          clientId: FITBIT_CLIENT_ID,
          codeVerifier: pending.codeVerifier,
        });
        clearPendingPkce();
        setConnected(true);
        router.replace("/dashboard");
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Token exchange failed";
        setError(msg);
      }
    })();
  }, [router, searchParams]);

  useEffect(() => {
    (async () => {
      if (!connected) return;
      try {
        setError(null);
        const [profileRes, stepsJson, heartJson, sleepJson, actJson] = await Promise.all([
          (async () => {
            const r = await fitbitFetch("/1/user/-/profile.json");
            if (!r.ok) throw new Error(`Fitbit error ${r.status}`);
            return r.json();
          })(),
          getSteps7d(),
          getHeart7d(),
          getSleepToday(),
          getActivitiesSummaryToday(),
        ]);

        setProfile(profileRes);

        // Steps today
        const stepsSeries = stepsJson["activities-steps"] || [];
        const stepsToday = stepsSeries.length ? Number(stepsSeries[stepsSeries.length - 1].value || 0) : 0;
        const mappedSteps = stepsSeries.map((d: { dateTime: string; value: string }) => ({
          day: new Date(d.dateTime).toLocaleDateString(undefined, { weekday: 'short' }),
          steps: Number(d.value || 0),
        }));
        setWeeklySteps(mappedSteps);

        // Resting HR today
        const heartSeries = heartJson["activities-heart"] || [];
        const todayHeart = heartSeries.length ? heartSeries[heartSeries.length - 1] : undefined;
        type HeartValue = { restingHeartRate?: number };
        const heartVal: HeartValue | null = (todayHeart && typeof todayHeart.value === 'object')
          ? (todayHeart.value as HeartValue)
          : null;
        const rhr = (heartVal && typeof heartVal.restingHeartRate === 'number')
          ? String(heartVal.restingHeartRate)
          : "—";

        // Sleep last night (total minutes)
        const minutesAsleep = sleepJson?.summary?.totalMinutesAsleep ?? 0;
        const hoursSleep = minutesAsleep ? (minutesAsleep / 60).toFixed(2) : "—";

        // Sleep stages (levels.summary) -> hours for donut chart
        type SleepEntry = { dateOfSleep?: string; levels?: { summary?: { deep?: { minutes?: number }, light?: { minutes?: number }, rem?: { minutes?: number }, wake?: { minutes?: number } } } };
        const rawSleep = (sleepJson as unknown as { sleep?: unknown[] })?.sleep;
        const sleepEntries: SleepEntry[] = Array.isArray(rawSleep) ? (rawSleep as SleepEntry[]) : [];
        // pick the latest sleep entry
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

        setMetrics((prev) => prev.map((m) => {
          if (m.title === "Calories") return { ...m, value: calories ? calories.toLocaleString() : "—" };
          if (m.title === "Step Count") return { ...m, value: stepsToday.toLocaleString() };
          if (m.title === "Sleep") return { ...m, value: String(hoursSleep) };
          if (m.title === "Heart Rate") return { ...m, value: String(rhr) };
          return m;
        }));
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
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium">Fitbit profile (sample)</p>
            <button
              onClick={() => { clearTokens(); clearPendingPkce(); setConnected(false); router.push('/dashboard'); }}
              className="inline-flex items-center rounded bg-red-600 px-2 py-1 text-xs text-white"
            >
              Disconnect Fitbit
            </button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {profile !== null && (
            <pre className="max-h-64 overflow-auto text-xs">{JSON.stringify(profile, null, 2)}</pre>
          )}
        </div>
      )}
      {/* Top Row - Metric Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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

      {/* Second Row - Charts */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartBarDefault data={weeklySteps} />
        <ChartPieDonut data={sleepDonut} />
      </div>
    </div>
  );
}
