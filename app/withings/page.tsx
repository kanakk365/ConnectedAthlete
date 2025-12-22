"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { WeightLineChart } from "@/components/ui/weight-line-chart";
import { HeartRateLineChart } from "@/components/ui/heart-rate-line-chart";
import { SpO2LineChart } from "@/components/ui/spo2-line-chart";
import { SleepDurationBarChart } from "@/components/ui/sleep-duration-bar-chart";
import { CaloriesBarChart } from "@/components/ui/calories-bar-chart";
import { DistanceLineChart } from "@/components/ui/distance-line-chart";
import { ChartBarDefault } from "@/components/ui/bar-chart";
import { useCallback, useEffect, useState } from "react";
import { isAuthorized } from "@/lib/withings/api";
import { getMeasurements, getActivity, getSleep, parseMeasureValue } from "@/lib/withings/endpoints";
import { clearTokens } from "@/lib/withings/token-store";
import { useRouter } from "next/navigation";
import { WITHINGS_CLIENT_ID, WITHINGS_DEFAULT_SCOPE, WITHINGS_REDIRECT_URI } from "@/lib/withings/config";

type MetricCard = { title: string; value: string; unit: string; image: string; color: string };

// Withings measure types
const MEASURE_TYPES = {
    WEIGHT: 1,
    HEIGHT: 4,
    FAT_FREE_MASS: 5,
    FAT_RATIO: 6,
    FAT_MASS: 8,
    DIASTOLIC_BP: 9,
    SYSTOLIC_BP: 10,
    HEART_PULSE: 11,
    TEMPERATURE: 12,
    SPO2: 54,
    BODY_TEMP: 71,
    SKIN_TEMP: 73,
};

export default function WithingsPage() {
    const router = useRouter();
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [metrics, setMetrics] = useState<MetricCard[]>([
        { title: "Weight", value: "—", unit: "kg", image: "/heart.png", color: "#6366f1" },
        { title: "Heart Rate", value: "—", unit: "BPM", image: "/heart.png", color: "#9161ff" },
        { title: "Blood Pressure", value: "—", unit: "mmHg", image: "/heart.png", color: "#dc767c" },
        { title: "SpO2", value: "—", unit: "%", image: "/heart.png", color: "#06b6d4" },
        { title: "Temperature", value: "—", unit: "°C", image: "/heart.png", color: "#ec4899" },
        { title: "Steps", value: "—", unit: "Steps", image: "/step.png", color: "#547aff" },
        { title: "Calories", value: "—", unit: "Kcal", image: "/calories.png", color: "#dc767c" },
        { title: "Sleep", value: "—", unit: "Hours", image: "/sleep.png", color: "#6f73e2" },
    ]);

    const [weightData, setWeightData] = useState<Array<{ date: string; weight: number }>>([]);
    const [heartRateData, setHeartRateData] = useState<Array<{ date: string; heartRate: number }>>([]);
    const [spo2Data, setSpo2Data] = useState<Array<{ date: string; spo2: number }>>([]);
    const [sleepData, setSleepData] = useState<Array<{ date: string; hours: number }>>([]);
    const [caloriesData, setCaloriesData] = useState<Array<{ date: string; calories: number }>>([]);
    const [stepsData, setStepsData] = useState<Array<{ day: string; steps: number }>>([]);
    const [distanceData, setDistanceData] = useState<Array<{ date: string; distance: number }>>([]);

    const generateDummyData = useCallback(() => {
        const today = new Date();
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(date.getDate() - (6 - i));
            return date;
        });

        const baseWeight = 70 + Math.random() * 5;
        const dummyWeightData = last7Days.map((date) => ({
            date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            weight: +(baseWeight + (Math.random() - 0.5) * 0.5).toFixed(1),
        }));

        const dummyHeartRateData = last7Days.map((date) => ({
            date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            heartRate: Math.floor(Math.random() * 10) + 58,
        }));

        const dummySpo2Data = last7Days.map((date) => ({
            date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            spo2: +(95 + Math.random() * 3).toFixed(1),
        }));

        const dummySleepData = last7Days.map((date) => ({
            date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            hours: +(7 + Math.random() * 2).toFixed(2),
        }));

        const dummyCaloriesData = last7Days.map((date) => ({
            date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            calories: Math.floor(Math.random() * 1000) + 1500,
        }));

        const dummyStepsData = last7Days.map((date) => ({
            day: days[date.getDay()],
            steps: Math.floor(Math.random() * 5000) + 5000,
        }));

        const dummyDistanceData = last7Days.map((date) => ({
            date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            distance: +(Math.random() * 5 + 3).toFixed(2),
        }));

        setWeightData(dummyWeightData);
        setHeartRateData(dummyHeartRateData);
        setSpo2Data(dummySpo2Data);
        setSleepData(dummySleepData);
        setCaloriesData(dummyCaloriesData);
        setStepsData(dummyStepsData);
        setDistanceData(dummyDistanceData);

        setMetrics([
            { title: "Weight", value: "72.5", unit: "kg", image: "/heart.png", color: "#6366f1" },
            { title: "Heart Rate", value: "62", unit: "BPM", image: "/heart.png", color: "#9161ff" },
            { title: "Blood Pressure", value: "120/80", unit: "mmHg", image: "/heart.png", color: "#dc767c" },
            { title: "SpO2", value: "97.2", unit: "%", image: "/heart.png", color: "#06b6d4" },
            { title: "Temperature", value: "36.8", unit: "°C", image: "/heart.png", color: "#ec4899" },
            { title: "Steps", value: "8,432", unit: "Steps", image: "/step.png", color: "#547aff" },
            { title: "Calories", value: "2,145", unit: "Kcal", image: "/calories.png", color: "#dc767c" },
            { title: "Sleep", value: "7.5", unit: "Hours", image: "/sleep.png", color: "#6f73e2" },
        ]);
    }, []);

    const onConnect = useCallback(async () => {
        setError(null);
        if (!WITHINGS_CLIENT_ID) {
            setError("Missing NEXT_PUBLIC_WITHINGS_CLIENT_ID env var");
            return;
        }
        try {
            const state = Math.random().toString(36).slice(2);
            sessionStorage.setItem("withings_oauth_state", state);

            const params = new URLSearchParams({
                response_type: "code",
                client_id: WITHINGS_CLIENT_ID.trim(),
                redirect_uri: WITHINGS_REDIRECT_URI.trim(),
                scope: WITHINGS_DEFAULT_SCOPE.trim(),
                state,
            });

            const url = `https://account.withings.com/oauth2_user/authorize2?${params.toString()}`;
            console.log("Withings OAuth URL:", url);
            console.log("Redirect URI:", WITHINGS_REDIRECT_URI);
            console.log("Redirect URI length:", WITHINGS_REDIRECT_URI.length);
            window.location.assign(url);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Failed to start Withings auth";
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
        (async () => {
            if (!connected) return;
            setLoading(true);
            setError(null);

            try {
                const [measurementsRes, activityRes, sleepRes] = await Promise.all([
                    getMeasurements("1,9,10,11,54,71", 30).catch(() => null),
                    getActivity(7).catch(() => null),
                    getSleep(7).catch(() => null),
                ]);

                // Process measurements
                if (measurementsRes?.status === 0 && measurementsRes.body?.measuregrps) {
                    const groups = measurementsRes.body.measuregrps;

                    // Extract latest values for each measure type
                    const latestValues: Record<number, { value: number; date: number }> = {};
                    const weightHistory: Array<{ date: string; weight: number }> = [];
                    const heartRateHistory: Array<{ date: string; heartRate: number }> = [];
                    const spo2History: Array<{ date: string; spo2: number }> = [];

                    for (const group of groups) {
                        const groupDate = new Date(group.date * 1000);
                        const dateStr = groupDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

                        for (const measure of group.measures) {
                            const value = parseMeasureValue(measure.value, measure.unit);

                            // Track latest values
                            if (!latestValues[measure.type] || group.date > latestValues[measure.type].date) {
                                latestValues[measure.type] = { value, date: group.date };
                            }

                            // Build history arrays
                            if (measure.type === MEASURE_TYPES.WEIGHT) {
                                weightHistory.push({ date: dateStr, weight: value });
                            } else if (measure.type === MEASURE_TYPES.HEART_PULSE) {
                                heartRateHistory.push({ date: dateStr, heartRate: value });
                            } else if (measure.type === MEASURE_TYPES.SPO2) {
                                spo2History.push({ date: dateStr, spo2: value });
                            }
                        }
                    }

                    // Update chart data
                    setWeightData(weightHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
                    setHeartRateData(heartRateHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
                    setSpo2Data(spo2History.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));

                    // Update metric cards with latest values
                    setMetrics((prev) => prev.map((m) => {
                        if (m.title === "Weight" && latestValues[MEASURE_TYPES.WEIGHT]) {
                            return { ...m, value: latestValues[MEASURE_TYPES.WEIGHT].value.toFixed(1) };
                        }
                        if (m.title === "Heart Rate" && latestValues[MEASURE_TYPES.HEART_PULSE]) {
                            return { ...m, value: String(Math.round(latestValues[MEASURE_TYPES.HEART_PULSE].value)) };
                        }
                        if (m.title === "Blood Pressure" && latestValues[MEASURE_TYPES.SYSTOLIC_BP] && latestValues[MEASURE_TYPES.DIASTOLIC_BP]) {
                            return { ...m, value: `${Math.round(latestValues[MEASURE_TYPES.SYSTOLIC_BP].value)}/${Math.round(latestValues[MEASURE_TYPES.DIASTOLIC_BP].value)}` };
                        }
                        if (m.title === "SpO2" && latestValues[MEASURE_TYPES.SPO2]) {
                            return { ...m, value: latestValues[MEASURE_TYPES.SPO2].value.toFixed(1) };
                        }
                        if (m.title === "Temperature" && (latestValues[MEASURE_TYPES.BODY_TEMP] || latestValues[MEASURE_TYPES.TEMPERATURE])) {
                            const temp = latestValues[MEASURE_TYPES.BODY_TEMP] || latestValues[MEASURE_TYPES.TEMPERATURE];
                            return { ...m, value: temp.value.toFixed(1) };
                        }
                        return m;
                    }));
                }

                // Process activity data
                if (activityRes?.status === 0 && activityRes.body?.activities) {
                    const activities = activityRes.body.activities;
                    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

                    const stepsHistory = activities.map((act: { date: string; steps?: number }) => ({
                        day: days[new Date(act.date).getDay()],
                        steps: act.steps || 0,
                    }));

                    const caloriesHistory = activities.map((act: { date: string; calories?: number }) => ({
                        date: new Date(act.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                        calories: act.calories || 0,
                    }));

                    const distanceHistory = activities.map((act: { date: string; distance?: number }) => ({
                        date: new Date(act.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                        distance: act.distance ? act.distance / 1000 : 0, // Convert meters to km
                    }));

                    setStepsData(stepsHistory);
                    setCaloriesData(caloriesHistory);
                    setDistanceData(distanceHistory);

                    // Update metric cards with latest activity
                    if (activities.length > 0) {
                        const latest = activities[activities.length - 1];
                        setMetrics((prev) => prev.map((m) => {
                            if (m.title === "Steps" && latest.steps) {
                                return { ...m, value: latest.steps.toLocaleString() };
                            }
                            if (m.title === "Calories" && latest.calories) {
                                return { ...m, value: latest.calories.toLocaleString() };
                            }
                            return m;
                        }));
                    }
                }

                // Process sleep data
                if (sleepRes?.status === 0 && sleepRes.body?.series) {
                    const sleepSeries = sleepRes.body.series;

                    const sleepHistory = sleepSeries.map((s: { date: string; data?: { durationtosleep?: number; deepsleepduration?: number; lightsleepduration?: number; remsleepduration?: number } }) => {
                        const totalSeconds = (s.data?.deepsleepduration || 0) + (s.data?.lightsleepduration || 0) + (s.data?.remsleepduration || 0);
                        return {
                            date: new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                            hours: totalSeconds / 3600,
                        };
                    });

                    setSleepData(sleepHistory);

                    // Update sleep metric
                    if (sleepSeries.length > 0) {
                        const latest = sleepSeries[sleepSeries.length - 1];
                        const totalSeconds = (latest.data?.deepsleepduration || 0) + (latest.data?.lightsleepduration || 0) + (latest.data?.remsleepduration || 0);
                        const hours = (totalSeconds / 3600).toFixed(1);
                        setMetrics((prev) => prev.map((m) =>
                            m.title === "Sleep" ? { ...m, value: hours } : m
                        ));
                    }
                }
            } catch (e: unknown) {
                const msg = e instanceof Error ? e.message : "Failed to fetch Withings data";
                setError(msg);
            } finally {
                setLoading(false);
            }
        })();
    }, [connected]);

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Withings Health Data</h1>
                {connected && (
                    <button
                        onClick={() => { clearTokens(); setConnected(false); router.refresh(); }}
                        className="inline-flex items-center rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                    >
                        Disconnect Withings
                    </button>
                )}
            </div>

            {!connected && (
                <div className="flex items-center justify-between rounded-md border p-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Connect your Withings account to see live data.</p>
                    </div>
                    <button onClick={onConnect} className="inline-flex items-center rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700">
                        Connect Withings
                    </button>
                </div>
            )}

            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {loading && (
                <div className="rounded-md border p-4 text-center">
                    <p className="text-sm text-muted-foreground">Loading Withings data...</p>
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
                    <ChartBarDefault data={stepsData} />
                    <WeightLineChart data={weightData} />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <HeartRateLineChart data={heartRateData} />
                    <SpO2LineChart data={spo2Data} />
                    <SleepDurationBarChart data={sleepData} />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <CaloriesBarChart data={caloriesData} />
                    <DistanceLineChart data={distanceData} />
                </div>
            </div>
        </div>
    );
}
