import { polarGet } from "./api";

// ============================================================================
// EXERCISES
// ============================================================================

/**
 * List exercises from the last 30 days
 * Returns exercises with optional samples and zones
 */
export async function getExercises(
  samples: boolean = true,
  zones: boolean = false
) {
  const params = new URLSearchParams();
  if (samples) params.set("samples", "true");
  if (zones) params.set("zones", "true");
  const query = params.toString();
  return polarGet(`/v3/exercises${query ? `?${query}` : ""}`);
}

/**
 * Get a specific exercise by ID
 */
export async function getExercise(
  exerciseId: string,
  samples: boolean = true,
  zones: boolean = false
) {
  const params = new URLSearchParams();
  if (samples) params.set("samples", "true");
  if (zones) params.set("zones", "true");
  const query = params.toString();
  return polarGet(`/v3/exercises/${exerciseId}${query ? `?${query}` : ""}`);
}

/**
 * Get exercise in FIT format
 */
export async function getExerciseFIT(exerciseId: string) {
  return polarGet(`/v3/exercises/${exerciseId}/fit`);
}

/**
 * Get exercise in TCX format
 */
export async function getExerciseTCX(exerciseId: string) {
  return polarGet(`/v3/exercises/${exerciseId}/tcx`);
}

/**
 * Get exercise in GPX format
 */
export async function getExerciseGPX(exerciseId: string) {
  return polarGet(`/v3/exercises/${exerciseId}/gpx`);
}

// ============================================================================
// DAILY ACTIVITY
// ============================================================================

/**
 * List activities for the past 28 days
 */
export async function getActivities28d() {
  return polarGet("/v3/users/activities");
}

/**
 * Get activity for a specific date
 * @param date - Date in YYYY-MM-DD format
 */
export async function getActivityByDate(date: string) {
  return polarGet(`/v3/users/activities/${date}`);
}

/**
 * List activities for a date range
 * @param fromDate - Start date in YYYY-MM-DD format
 * @param toDate - End date in YYYY-MM-DD format
 */
export async function getActivitiesRange(fromDate: string, toDate: string) {
  return polarGet(`/v3/users/activities?from=${fromDate}&to=${toDate}`);
}

/**
 * Get activity samples (step counts) for a specific date
 * @param date - Date in YYYY-MM-DD format
 */
export async function getActivitySamples(date: string) {
  return polarGet(`/v3/users/activities/${date}/samples`);
}

// ============================================================================
// CONTINUOUS HEART RATE
// ============================================================================

/**
 * Get continuous heart rate samples for a specific date
 * @param date - Date in YYYY-MM-DD format
 */
export async function getContinuousHeartRate(date: string) {
  return polarGet(`/v3/users/continuous-heart-rate/${date}`);
}

/**
 * Get continuous heart rate samples for a date range
 * @param fromDate - Start date in YYYY-MM-DD format
 * @param toDate - End date in YYYY-MM-DD format
 */
export async function getContinuousHeartRateRange(
  fromDate: string,
  toDate: string
) {
  return polarGet(
    `/v3/users/continuous-heart-rate?from=${fromDate}&to=${toDate}`
  );
}

// ============================================================================
// SLEEP
// ============================================================================

/**
 * List sleep data for the last 28 days
 */
export async function getSleepNights() {
  return polarGet("/v3/users/sleep");
}

/**
 * Get sleep data for a specific date
 * @param date - Date in YYYY-MM-DD format
 */
export async function getSleepByDate(date: string) {
  return polarGet(`/v3/users/sleep/${date}`);
}

/**
 * Get available sleep times (dates with sleep data)
 */
export async function getAvailableSleepTimes() {
  return polarGet("/v3/users/sleep/available");
}

// ============================================================================
// NIGHTLY RECHARGE
// ============================================================================

/**
 * List Nightly Recharge data for the last 28 days
 */
export async function getNightlyRecharges() {
  return polarGet("/v3/users/nightly-recharge");
}

/**
 * Get Nightly Recharge for a specific date
 * @param date - Date in YYYY-MM-DD format
 */
export async function getNightlyRechargeByDate(date: string) {
  return polarGet(`/v3/users/nightly-recharge/${date}`);
}

// ============================================================================
// CARDIO LOAD
// ============================================================================

/**
 * List cardio load data for the last 28 days
 */
export async function getCardioLoads() {
  return polarGet("/v3/users/cardio-load");
}

/**
 * Get cardio load for a specific date
 * @param date - Date in YYYY-MM-DD format
 */
export async function getCardioLoadByDate(date: string) {
  return polarGet(`/v3/users/cardio-load/${date}`);
}

/**
 * Get cardio load for a date range
 * @param fromDate - Start date in YYYY-MM-DD format
 * @param toDate - End date in YYYY-MM-DD format
 */
export async function getCardioLoadRange(fromDate: string, toDate: string) {
  return polarGet(`/v3/users/cardio-load?from=${fromDate}&to=${toDate}`);
}

// ============================================================================
// SLEEPWISE™
// ============================================================================

/**
 * Get alertness data for the last 28 days
 */
export async function getAlertness() {
  return polarGet("/v3/users/sleepwise-alertness");
}

/**
 * Get alertness data for a date range
 */
export async function getAlertnessRange(fromDate: string, toDate: string) {
  return polarGet(
    `/v3/users/sleepwise-alertness?from=${fromDate}&to=${toDate}`
  );
}

/**
 * Get circadian bedtime data for the last 28 days
 */
export async function getCircadianBedtime() {
  return polarGet("/v3/users/sleepwise-circadian-bedtime");
}

// ============================================================================
// PHYSICAL INFO
// ============================================================================

/**
 * Get physical information
 */
export async function getPhysicalInfo() {
  return polarGet("/v3/users/physical-info");
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format date to YYYY-MM-DD string required by Polar API
 */
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Get date string for today
 */
export function getToday(): string {
  return formatDate(new Date());
}

/**
 * Get date string for N days ago
 */
export function getDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDate(date);
}

/**
 * Convert duration in seconds to hours and minutes
 */
export function formatDuration(seconds: number): {
  hours: number;
  minutes: number;
} {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return { hours, minutes };
}

/**
 * Parse Polar sleep hypnogram
 * Values: 0 = Deep sleep, 1 = REM, 2 = Light sleep, 3 = Unknown, 4 = Awake
 */
export function parseSleepStages(hypnogram: Record<string, number>) {
  let deep = 0;
  let rem = 0;
  let light = 0;
  let awake = 0;

  const times = Object.keys(hypnogram).sort();
  for (let i = 0; i < times.length - 1; i++) {
    const current = times[i];
    const next = times[i + 1];
    const stage = hypnogram[current];

    // Calculate duration between samples (assume 15 min intervals if not specified)
    const [currH, currM] = current.split(":").map(Number);
    const [nextH, nextM] = next.split(":").map(Number);
    let duration = nextH * 60 + nextM - (currH * 60 + currM);
    if (duration < 0) duration += 24 * 60; // Handle midnight crossing
    duration = duration * 60; // Convert to seconds

    switch (stage) {
      case 0:
        deep += duration;
        break;
      case 1:
        rem += duration;
        break;
      case 2:
        light += duration;
        break;
      case 4:
        awake += duration;
        break;
    }
  }

  return { deep, rem, light, awake };
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PolarExercise {
  id: string;
  upload_time: string;
  polar_user: string;
  device: string;
  device_id: string;
  start_time: string;
  start_time_utc_offset: number;
  duration: string;
  calories: number;
  distance: number;
  heart_rate: {
    average: number;
    maximum: number;
  };
  sport: string;
  has_route: boolean;
  detailed_sport_info: string;
  training_load?: {
    training_load_val?: number;
    cardio_load_val?: number;
  };
}

export interface PolarActivity {
  id: string;
  date: string;
  created: string;
  calories: number;
  active_calories: number;
  duration: string;
  active_steps: number;
  daily_activity_goal: number;
}

export interface PolarSleep {
  polar_user: string;
  date: string;
  sleep_start_time: string;
  sleep_end_time: string;
  device_id: string;
  continuity: number;
  continuity_class: number;
  light_sleep: number;
  deep_sleep: number;
  rem_sleep: number;
  unrecognized_sleep_stage: number;
  sleep_score: number;
  total_interruption_duration: number;
  sleep_charge: number;
  sleep_goal: number;
  sleep_rating: number;
  short_interruption_duration: number;
  long_interruption_duration: number;
  sleep_cycles: number;
  group_duration_score: number;
  group_solidity_score: number;
  group_regeneration_score: number;
  hypnogram?: Record<string, number>;
  heart_rate_samples?: Record<string, number>;
}

export interface PolarNightlyRecharge {
  polar_user: string;
  date: string;
  ans_charge: number;
  ans_charge_status: number;
  hrv_rmssd: number;
  breathing_rate: number;
  nightly_recharge_status: number;
}

export interface PolarContinuousHeartRate {
  date: string;
  samples: Record<string, number>;
}
