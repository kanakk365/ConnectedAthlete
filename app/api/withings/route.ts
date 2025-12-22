import { NextRequest } from "next/server";

const WITHINGS_API_BASE = "https://wbsapi.withings.net";

const ENDPOINT_MAP: Record<string, string> = {
  measure: "/measure",
  "v2-measure": "/v2/measure",
  "v2-sleep": "/v2/sleep",
  "v2-heart": "/v2/heart",
};

export async function POST(req: NextRequest) {
  const token = req.headers.get("x-withings-token");
  if (!token) {
    return new Response(
      JSON.stringify({ status: 401, error: "Missing x-withings-token" }),
      {
        status: 401,
        headers: { "content-type": "application/json" },
      }
    );
  }

  try {
    const body = await req.json();
    const { action, ...params } = body;

    // Determine the endpoint based on action prefix
    let endpoint = "/measure";
    for (const [prefix, path] of Object.entries(ENDPOINT_MAP)) {
      if (action === prefix || params.action) {
        endpoint = path;
        break;
      }
    }

    // For v2 endpoints, the action is in params
    const requestAction = params.action || action;

    const formData = new URLSearchParams({
      action: requestAction,
      ...params,
    });

    const res = await fetch(`${WITHINGS_API_BASE}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error("Withings API error:", error);
    return new Response(
      JSON.stringify({ status: 500, error: "Internal server error" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
}
