import { fitbitFetch } from "./api";

export async function getSteps7d() {
	const res = await fitbitFetch(`/1/user/-/activities/steps/date/today/7d.json`);
	if (!res.ok) throw new Error(`Steps fetch failed: ${res.status}`);
	return res.json() as Promise<{
		"activities-steps": Array<{ dateTime: string; value: string }>;
	}>;
}

export async function getHeart7d() {
	const res = await fitbitFetch(`/1/user/-/activities/heart/date/today/7d.json`);
	if (!res.ok) throw new Error(`Heart fetch failed: ${res.status}`);
	return res.json() as Promise<{
		"activities-heart": Array<{
			dateTime: string;
			value: { restingHeartRate?: number; [k: string]: unknown };
		}>;
	}>;
}

// Sleep summary for today (Fitbit v1.2)
export async function getSleepToday() {
	const today = new Date();
	const yyyy = today.getFullYear();
	const mm = String(today.getMonth() + 1).padStart(2, '0');
	const dd = String(today.getDate()).padStart(2, '0');
	const dateStr = `${yyyy}-${mm}-${dd}`; // Fitbit v1.2 requires an explicit date
	const res = await fitbitFetch(`/1.2/user/-/sleep/date/${dateStr}.json`);
	if (!res.ok) throw new Error(`Sleep fetch failed: ${res.status}`);
	return res.json() as Promise<{
		summary?: {
			totalMinutesAsleep?: number;
			totalTimeInBed?: number;
		};
		sleep?: unknown[];
	}>;
}

export async function getActivitiesSummaryToday() {
	const today = new Date();
	const yyyy = today.getFullYear();
	const mm = String(today.getMonth() + 1).padStart(2, '0');
	const dd = String(today.getDate()).padStart(2, '0');
	const dateStr = `${yyyy}-${mm}-${dd}`;
	const res = await fitbitFetch(`/1/user/-/activities/date/${dateStr}.json`);
	if (!res.ok) throw new Error(`Activities summary failed: ${res.status}`);
	return res.json() as Promise<{
		summary: { caloriesOut?: number; distances?: Array<{ activity?: string; distance?: number }> };
	}>;
}

export async function getBodyToday() {
	const today = new Date();
	const yyyy = today.getFullYear();
	const mm = String(today.getMonth() + 1).padStart(2, '0');
	const dd = String(today.getDate()).padStart(2, '0');
	const dateStr = `${yyyy}-${mm}-${dd}`;
	const res = await fitbitFetch(`/1/user/-/body/log/weight/date/${dateStr}.json`);
	if (!res.ok) throw new Error(`Body metrics fetch failed: ${res.status}`);
	return res.json() as Promise<{
		weight?: Array<{
			dateTime?: string;
			value?: number;
			bmi?: number;
			fat?: number;
		}>;
	}>;
}

export async function getSpO2Today() {
	const today = new Date();
	const yyyy = today.getFullYear();
	const mm = String(today.getMonth() + 1).padStart(2, '0');
	const dd = String(today.getDate()).padStart(2, '0');
	const dateStr = `${yyyy}-${mm}-${dd}`;
	const res = await fitbitFetch(`/1/user/-/spo2/date/${dateStr}.json`);
	if (!res.ok) throw new Error(`SpO2 fetch failed: ${res.status}`);
	return res.json() as Promise<{
		value?: Array<{
			dateTime?: string;
			value?: {
				avg?: number;
				min?: number;
				max?: number;
			};
		}>;
	}>;
}

export async function getTemperatureToday() {
	const today = new Date();
	const yyyy = today.getFullYear();
	const mm = String(today.getMonth() + 1).padStart(2, '0');
	const dd = String(today.getDate()).padStart(2, '0');
	const dateStr = `${yyyy}-${mm}-${dd}`;
	const res = await fitbitFetch(`/1/user/-/temp/core/date/${dateStr}.json`);
	if (!res.ok) {
		// If core temperature fails, try skin temperature
		const skinRes = await fitbitFetch(`/1/user/-/temp/skin/date/${dateStr}.json`);
		if (!skinRes.ok) throw new Error(`Temperature fetch failed: ${res.status}`);
		return skinRes.json() as Promise<{
			value?: Array<{
				dateTime?: string;
				value?: number;
				level?: string;
			}>;
			type?: string;
		}>;
	}
	return res.json() as Promise<{
		value?: Array<{
			dateTime?: string;
			value?: number;
			level?: string;
		}>;
		type?: string;
	}>;
}

export async function getDistanceToday() {
	const res = await fitbitFetch(`/1/user/-/activities/distance/date/today/1d.json`);
	if (!res.ok) throw new Error(`Distance fetch failed: ${res.status}`);
	return res.json() as Promise<{
		"activities-distance": Array<{
			dateTime?: string;
			value?: string | number;
		}>;
	}>;
}

// Time-series endpoints for graphs

export async function getHeartRateTimeSeries(period: '7d' | '30d' = '7d') {
	const res = await fitbitFetch(`/1/user/-/activities/heart/date/today/${period}.json`);
	if (!res.ok) throw new Error(`Heart rate time series fetch failed: ${res.status}`);
	return res.json() as Promise<{
		"activities-heart": Array<{
			dateTime: string;
			value: { restingHeartRate?: number; [k: string]: unknown };
		}>;
	}>;
}

export async function getWeightTimeSeries(period: '30d' | '1y' = '30d') {
	const res = await fitbitFetch(`/1/user/-/body/log/weight/date/today/${period}.json`);
	if (!res.ok) throw new Error(`Weight time series fetch failed: ${res.status}`);
	return res.json() as Promise<{
		weight?: Array<{
			dateTime?: string;
			value?: number;
			bmi?: number;
			fat?: number;
		}>;
	}>;
}

export async function getSleepTimeSeries(period: '7d' | '30d' = '7d') {
	const res = await fitbitFetch(`/1.2/user/-/sleep/date/today/${period}.json`);
	if (!res.ok) throw new Error(`Sleep time series fetch failed: ${res.status}`);
	return res.json() as Promise<{
		sleep?: Array<{
			dateOfSleep?: string;
			summary?: {
				totalMinutesAsleep?: number;
				totalTimeInBed?: number;
			};
		}>;
	}>;
}

export async function getCaloriesTimeSeries(period: '7d' | '30d' = '7d') {
	const res = await fitbitFetch(`/1/user/-/activities/calories/date/today/${period}.json`);
	if (!res.ok) throw new Error(`Calories time series fetch failed: ${res.status}`);
	return res.json() as Promise<{
		"activities-calories": Array<{
			dateTime?: string;
			value?: string | number;
		}>;
	}>;
}

export async function getDistanceTimeSeries(period: '7d' | '30d' = '7d') {
	const res = await fitbitFetch(`/1/user/-/activities/distance/date/today/${period}.json`);
	if (!res.ok) throw new Error(`Distance time series fetch failed: ${res.status}`);
	return res.json() as Promise<{
		"activities-distance": Array<{
			dateTime?: string;
			value?: string | number;
		}>;
	}>;
}

export async function getActiveZoneMinutesTimeSeries(period: '7d' | '30d' = '7d') {
	const res = await fitbitFetch(`/1/user/-/activities/active-zone-minutes/date/today/${period}.json`);
	if (!res.ok) throw new Error(`Active zone minutes time series fetch failed: ${res.status}`);
	return res.json() as Promise<{
		"activities-active-zone-minutes"?: Array<{
			dateTime?: string;
			value?: {
				minutesInFatBurnZone?: number;
				minutesInCardioZone?: number;
				minutesInPeakZone?: number;
				totalMinutes?: number;
			};
		}>;
	}>;
}

export async function getSpO2TimeSeries(period: '7d' | '30d' = '7d') {
	const res = await fitbitFetch(`/1/user/-/spo2/date/today/${period}.json`);
	if (!res.ok) throw new Error(`SpO2 time series fetch failed: ${res.status}`);
	return res.json() as Promise<{
		value?: Array<{
			dateTime?: string;
			value?: {
				avg?: number;
				min?: number;
				max?: number;
			};
		}>;
	}>;
}

export async function getBodyFatTimeSeries(period: '30d' | '1y' = '30d') {
	const res = await fitbitFetch(`/1/user/-/body/log/fat/date/today/${period}.json`);
	if (!res.ok) throw new Error(`Body fat time series fetch failed: ${res.status}`);
	return res.json() as Promise<{
		fat?: Array<{
			dateTime?: string;
			value?: number;
		}>;
	}>;
}

export async function getBMITimeSeries(period: '30d' | '1y' = '30d') {
	const res = await fitbitFetch(`/1/user/-/body/bmi/date/today/${period}.json`);
	if (!res.ok) throw new Error(`BMI time series fetch failed: ${res.status}`);
	return res.json() as Promise<{
		"body-bmi"?: Array<{
			dateTime?: string;
			value?: number;
		}>;
	}>;
}


