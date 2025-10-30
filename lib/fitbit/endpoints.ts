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
		summary: { caloriesOut?: number };
	}>;
}


