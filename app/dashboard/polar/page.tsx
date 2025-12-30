"use client";

import Image from "next/image";
import Layout from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { WeightLineChart } from "@/components/ui/weight-line-chart";
import { HeartRateLineChart } from "@/components/ui/heart-rate-line-chart";
import { SleepDurationBarChart } from "@/components/ui/sleep-duration-bar-chart";
import { CaloriesBarChart } from "@/components/ui/calories-bar-chart";
import { DistanceLineChart } from "@/components/ui/distance-line-chart";
import { ChartBarDefault } from "@/components/ui/bar-chart";
import { useCallback, useEffect, useState } from "react";
import { isAuthorized } from "@/lib/polar/api";
import {
    getExercises,
    getActivities28d,
    getSleepNights,
    getContinuousHeartRate,
    getNightlyRecharges,
    getToday,
    formatDuration,
} from "@/lib/polar/endpoints";
import { clearTokens } from "@/lib/polar/token-store";
import { useRouter } from "next/navigation";
import {
    POLAR_CLIENT_ID,
    POLAR_AUTH_URL,
    POLAR_REDIRECT_URI,
} from "@/lib/polar/config";

type MetricCard = {
    title: string;
    value: string;
    unit: string;
    image: string;
    color: string;
};

export default function PolarPage() {
    const router = useRouter();
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [metrics, setMetrics] = useState<MetricCard[]>([
        { title: "Steps", value: "—", unit: "Steps", image: "/step.png", color: "#547aff" },
        { title: "Heart Rate", value: "—", unit: "BPM", image: "/heart.png", color: "#9161ff" },
        { title: "Calories", value: "—", unit: "Kcal", image: "/calories.png", color: "#dc767c" },
        { title: "Sleep Score", value: "—", unit: "Score", image: "/sleep.png", color: "#6f73e2" },
        { title: "Exercise", value: "—", unit: "min", image: "/heart.png", color: "#06b6d4" },
        { title: "Distance", value: "—", unit: "km", image: "/step.png", color: "#ec4899" },
        { title: "Sleep Duration", value: "—", unit: "Hours", image: "/sleep.png", color: "#6366f1" },
        { title: "Recharge", value: "—", unit: "Status", image: "/heart.png", color: "#10b981" },
    ]);

    const [stepsData, setStepsData] = useState<Array<{ day: string; steps: number }>>([]);
    const [heartRateData, setHeartRateData] = useState<Array<{ date: string; heartRate: number }>>([]);
    const [sleepData, setSleepData] = useState<Array<{ date: string; hours: number }>>([]);
    const [caloriesData, setCaloriesData] = useState<Array<{ date: string; calories: number }>>([]);
    const [distanceData, setDistanceData] = useState<Array<{ date: string; distance: number }>>([]);
    const [, setExerciseData] = useState<Array<{ date: string; duration: number }>>([]);

    const generateDummyData = useCallback(() => {
        const today = new Date();
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(date.getDate() - (6 - i));
            return date;
        });

        const dummyStepsData = last7Days.map((date) => ({
            day: days[date.getDay()],
            steps: Math.floor(Math.random() * 5000) + 5000,
        }));

        const dummyHeartRateData = last7Days.map((date) => ({
            date: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
            heartRate: Math.floor(Math.random() * 15) + 55,
        }));

        const dummySleepData = last7Days.map((date) => ({
            date: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
            hours: +(6 + Math.random() * 3).toFixed(2),
        }));

        const dummyCaloriesData = last7Days.map((date) => ({
            date: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
            calories: Math.floor(Math.random() * 800) + 1600,
        }));

        const dummyDistanceData = last7Days.map((date) => ({
            date: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
            distance: +(Math.random() * 8 + 2).toFixed(2),
        }));

        setStepsData(dummyStepsData);
        setHeartRateData(dummyHeartRateData);
        setSleepData(dummySleepData);
        setCaloriesData(dummyCaloriesData);
        setDistanceData(dummyDistanceData);

        setMetrics([
            { title: "Steps", value: "8,234", unit: "Steps", image: "/step.png", color: "#547aff" },
            { title: "Heart Rate", value: "62", unit: "BPM", image: "/heart.png", color: "#9161ff" },
            { title: "Calories", value: "2,145", unit: "Kcal", image: "/calories.png", color: "#dc767c" },
            { title: "Sleep Score", value: "82", unit: "Score", image: "/sleep.png", color: "#6f73e2" },
            { title: "Exercise", value: "45", unit: "min", image: "/heart.png", color: "#06b6d4" },
            { title: "Distance", value: "6.2", unit: "km", image: "/step.png", color: "#ec4899" },
            { title: "Sleep Duration", value: "7.5", unit: "Hours", image: "/sleep.png", color: "#6366f1" },
            { title: "Recharge", value: "Good", unit: "Status", image: "/heart.png", color: "#10b981" },
        ]);
    }, []);

    const onConnect = useCallback(async () => {
        setError(null);
        if (!POLAR_CLIENT_ID) {
            setError("Missing NEXT_PUBLIC_POLAR_CLIENT_ID env var");
            return;
        }

        try {
            const state = Math.random().toString(36).slice(2);
            sessionStorage.setItem("polar_oauth_state", state);

            const params = new URLSearchParams({
                response_type: "code",
                client_id: POLAR_CLIENT_ID.trim(),
                redirect_uri: POLAR_REDIRECT_URI.trim(),
                state,
            });

            const url = `${POLAR_AUTH_URL}?${params.toString()}`;
            console.log("Polar OAuth URL:", url);
            window.location.assign(url);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Failed to start Polar auth";
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
                const [exercisesRes, activitiesRes, sleepRes, heartRateRes, rechargeRes] =
                    await Promise.all([
                        getExercises(false, false).catch(() => null),
                        getActivities28d().catch(() => null),
                        getSleepNights().catch(() => null),
                        getContinuousHeartRate(getToday()).catch(() => null),
                        getNightlyRecharges().catch(() => null),
                    ]);

                // Process exercises data
                if (exercisesRes && !exercisesRes.error && Array.isArray(exercisesRes)) {
                    const exerciseHistory = exercisesRes.slice(0, 7).map((ex: {
                        start_time: string;
                        duration: string;
                        calories?: number;
                        distance?: number;
                    }) => {
                        const date = new Date(ex.start_time);
                        // Parse ISO 8601 duration (PT1H30M00S)
                        const durationMatch = ex.duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
                        const hours = parseInt(durationMatch?.[1] || "0", 10);
                        const minutes = parseInt(durationMatch?.[2] || "0", 10);
                        const totalMinutes = hours * 60 + minutes;

                        return {
                            date: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
                            duration: totalMinutes,
                            calories: ex.calories || 0,
                            distance: ex.distance || 0,
                        };
                    });

                    setExerciseData(exerciseHistory);

                    // Update exercise metric
                    if (exerciseHistory.length > 0) {
                        const latestDuration = exerciseHistory[0].duration;
                        setMetrics((prev) =>
                            prev.map((m) =>
                                m.title === "Exercise" ? { ...m, value: String(latestDuration) } : m
                            )
                        );
                    }

                    // Update distance and calories from exercises
                    const totalDistance = exercisesRes.reduce(
                        (sum: number, ex: { distance?: number }) => sum + (ex.distance || 0),
                        0
                    );

                    if (totalDistance > 0) {
                        setMetrics((prev) =>
                            prev.map((m) =>
                                m.title === "Distance"
                                    ? { ...m, value: (totalDistance / 1000).toFixed(1) }
                                    : m
                            )
                        );
                    }
                }

                // Process activities data
                if (activitiesRes && !activitiesRes.error && Array.isArray(activitiesRes)) {
                    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

                    const stepsHistory = activitiesRes.slice(0, 7).map((act: {
                        date: string;
                        active_steps?: number;
                        calories?: number;
                    }) => ({
                        day: days[new Date(act.date).getDay()],
                        steps: act.active_steps || 0,
                    }));

                    const caloriesHistory = activitiesRes.slice(0, 7).map((act: {
                        date: string;
                        calories?: number;
                    }) => ({
                        date: new Date(act.date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                        }),
                        calories: act.calories || 0,
                    }));

                    setStepsData(stepsHistory);
                    setCaloriesData(caloriesHistory);

                    // Update metrics with latest activity
                    if (activitiesRes.length > 0) {
                        const latest = activitiesRes[0];
                        setMetrics((prev) =>
                            prev.map((m) => {
                                if (m.title === "Steps" && latest.active_steps) {
                                    return { ...m, value: latest.active_steps.toLocaleString() };
                                }
                                if (m.title === "Calories" && latest.calories) {
                                    return { ...m, value: latest.calories.toLocaleString() };
                                }
                                return m;
                            })
                        );
                    }
                }

                // Process sleep data
                if (sleepRes && !sleepRes.error && sleepRes.nights) {
                    const sleepHistory = sleepRes.nights.slice(0, 7).map((night: {
                        date: string;
                        deep_sleep?: number;
                        light_sleep?: number;
                        rem_sleep?: number;
                        sleep_score?: number;
                    }) => {
                        const totalSeconds =
                            (night.deep_sleep || 0) +
                            (night.light_sleep || 0) +
                            (night.rem_sleep || 0);
                        return {
                            date: new Date(night.date).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                            }),
                            hours: totalSeconds / 3600,
                        };
                    });

                    setSleepData(sleepHistory);

                    // Update sleep metrics
                    if (sleepRes.nights.length > 0) {
                        const latest = sleepRes.nights[0];
                        const totalSeconds =
                            (latest.deep_sleep || 0) +
                            (latest.light_sleep || 0) +
                            (latest.rem_sleep || 0);
                        const { hours, minutes } = formatDuration(totalSeconds);

                        setMetrics((prev) =>
                            prev.map((m) => {
                                if (m.title === "Sleep Score" && latest.sleep_score) {
                                    return { ...m, value: String(latest.sleep_score) };
                                }
                                if (m.title === "Sleep Duration") {
                                    return { ...m, value: `${hours}.${Math.round(minutes / 6)}` };
                                }
                                return m;
                            })
                        );
                    }
                }

                // Process heart rate data
                if (heartRateRes && !heartRateRes.error && heartRateRes.samples) {
                    const samples = heartRateRes.samples;
                    const times = Object.keys(samples).sort();

                    // Get average heart rate
                    if (times.length > 0) {
                        const total = times.reduce((sum, t) => sum + samples[t], 0);
                        const avg = Math.round(total / times.length);

                        setMetrics((prev) =>
                            prev.map((m) =>
                                m.title === "Heart Rate" ? { ...m, value: String(avg) } : m
                            )
                        );
                    }

                    // Create heart rate history (sample every few hours)
                    const hrHistory = [];
                    for (let i = 0; i < Math.min(7, times.length); i += Math.floor(times.length / 7) || 1) {
                        const time = times[i];
                        hrHistory.push({
                            date: time,
                            heartRate: samples[time],
                        });
                    }
                    if (hrHistory.length > 0) {
                        setHeartRateData(hrHistory);
                    }
                }

                // Process nightly recharge data
                if (rechargeRes && !rechargeRes.error && rechargeRes.recharges) {
                    if (rechargeRes.recharges.length > 0) {
                        const latest = rechargeRes.recharges[0];
                        const statusMap: Record<number, string> = {
                            1: "Very Poor",
                            2: "Poor",
                            3: "Compromised",
                            4: "OK",
                            5: "Good",
                            6: "Very Good",
                        };
                        const status = statusMap[latest.nightly_recharge_status] || "—";

                        setMetrics((prev) =>
                            prev.map((m) =>
                                m.title === "Recharge" ? { ...m, value: status } : m
                            )
                        );
                    }
                }
            } catch (e: unknown) {
                const msg = e instanceof Error ? e.message : "Failed to fetch Polar data";
                setError(msg);
            } finally {
                setLoading(false);
            }
        })();
    }, [connected]);

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Polar Fitness Data</h1>
                    {connected && (
                        <button
                            onClick={() => {
                                clearTokens();
                                setConnected(false);
                                router.refresh();
                            }}
                            className="inline-flex items-center rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                        >
                            Disconnect Polar
                        </button>
                    )}
                </div>

                {!connected && (
                    <div className="flex items-center justify-between rounded-md border p-4">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Connect your Polar account to see live fitness data from your Polar device.
                            </p>
                        </div>
                        <button
                            onClick={onConnect}
                            className="inline-flex items-center rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600"
                        >
                            Connect Polar
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
                        <p className="text-sm text-muted-foreground">Loading Polar data...</p>
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
                                    <p className="mt-3 text-3xl font-semibold leading-none">{value}</p>
                                    <p className="text-xs font-medium text-white/60">{unit}</p>
                                </div>
                                <div className="absolute bottom-4 right-4">
                                    <Image
                                        src={image}
                                        alt={title}
                                        width={title === "Sleep Score" || title === "Heart Rate" ? 60 : 40}
                                        height={title === "Sleep Score" || title === "Heart Rate" ? 60 : 40}
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
                        <HeartRateLineChart data={heartRateData} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <SleepDurationBarChart data={sleepData} />
                        <CaloriesBarChart data={caloriesData} />
                        <DistanceLineChart data={distanceData} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
