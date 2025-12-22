import { withingsFetch } from "./api";

// Withings Measure Types:
// 1 = Weight (kg)
// 4 = Height (meter)
// 5 = Fat Free Mass (kg)
// 6 = Fat Ratio (%)
// 8 = Fat Mass Weight (kg)
// 9 = Diastolic Blood Pressure (mmHg)
// 10 = Systolic Blood Pressure (mmHg)
// 11 = Heart Pulse (bpm)
// 12 = Temperature (celsius)
// 54 = SpO2 (%)
// 71 = Body Temperature (celsius)
// 73 = Skin Temperature (celsius)
// 76 = Muscle Mass (kg)
// 77 = Hydration (kg)
// 88 = Bone Mass (kg)

function getDateRange(days: number = 30) {
  const endDate = Math.floor(Date.now() / 1000);
  const startDate = endDate - days * 24 * 60 * 60;
  return { startdate: String(startDate), enddate: String(endDate) };
}

export async function getMeasurements(
  meastypes: string = "1,4,5,6,8,9,10,11,54,71",
  days: number = 30
) {
  const { startdate, enddate } = getDateRange(days);
  const result = await withingsFetch("measure", {
    action: "getmeas",
    meastypes,
    startdate,
    enddate,
  });
  return result;
}

export async function getWeight(days: number = 30) {
  const { startdate, enddate } = getDateRange(days);
  const result = await withingsFetch("measure", {
    action: "getmeas",
    meastypes: "1",
    startdate,
    enddate,
  });
  return result;
}

export async function getHeartRate(days: number = 30) {
  const { startdate, enddate } = getDateRange(days);
  const result = await withingsFetch("measure", {
    action: "getmeas",
    meastypes: "11",
    startdate,
    enddate,
  });
  return result;
}

export async function getBloodPressure(days: number = 30) {
  const { startdate, enddate } = getDateRange(days);
  const result = await withingsFetch("measure", {
    action: "getmeas",
    meastypes: "9,10",
    startdate,
    enddate,
  });
  return result;
}

export async function getSpO2(days: number = 30) {
  const { startdate, enddate } = getDateRange(days);
  const result = await withingsFetch("measure", {
    action: "getmeas",
    meastypes: "54",
    startdate,
    enddate,
  });
  return result;
}

export async function getTemperature(days: number = 30) {
  const { startdate, enddate } = getDateRange(days);
  const result = await withingsFetch("measure", {
    action: "getmeas",
    meastypes: "12,71,73",
    startdate,
    enddate,
  });
  return result;
}

export async function getBodyComposition(days: number = 30) {
  const { startdate, enddate } = getDateRange(days);
  const result = await withingsFetch("measure", {
    action: "getmeas",
    meastypes: "5,6,8,76,77,88",
    startdate,
    enddate,
  });
  return result;
}

export async function getActivity(days: number = 7) {
  const { startdate, enddate } = getDateRange(days);
  const result = await withingsFetch("v2-measure", {
    action: "getactivity",
    startdateymd: new Date(Number(startdate) * 1000)
      .toISOString()
      .split("T")[0],
    enddateymd: new Date(Number(enddate) * 1000).toISOString().split("T")[0],
  });
  return result;
}

export async function getSleep(days: number = 7) {
  const { startdate, enddate } = getDateRange(days);
  const result = await withingsFetch("v2-sleep", {
    action: "getsummary",
    startdateymd: new Date(Number(startdate) * 1000)
      .toISOString()
      .split("T")[0],
    enddateymd: new Date(Number(enddate) * 1000).toISOString().split("T")[0],
  });
  return result;
}

// Helper function to parse Withings measurement values
// Withings uses value * 10^unit format
export function parseMeasureValue(value: number, unit: number): number {
  return value * Math.pow(10, unit);
}

// Helper to extract specific measure type from measurement groups
export function extractMeasureType(
  measureGroups: Array<{
    measures: Array<{ type: number; value: number; unit: number }>;
  }>,
  measureType: number
): Array<{ value: number; date: number }> {
  const results: Array<{ value: number; date: number }> = [];

  for (const group of measureGroups) {
    for (const measure of group.measures) {
      if (measure.type === measureType) {
        results.push({
          value: parseMeasureValue(measure.value, measure.unit),
          date: (group as unknown as { date: number }).date,
        });
      }
    }
  }

  return results.sort((a, b) => a.date - b.date);
}
