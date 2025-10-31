import { NextRequest } from "next/server";

const FITBIT_API_BASE = "https://api.fitbit.com";

function buildTargetUrl(pathSegments: string[], search: string): string {
	const path = "/" + pathSegments.map(encodeURIComponent).join("/");
	return `${FITBIT_API_BASE}${path}${search ? `?${search}` : ""}`;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
	const token = req.headers.get("x-fitbit-token");
	if (!token) {
		return new Response("Missing x-fitbit-token", { status: 401 });
	}
	const { path } = await params;
	const url = buildTargetUrl(path || [], req.nextUrl.searchParams.toString());
	const res = await fetch(url, {
		method: "GET",
		headers: { Authorization: `Bearer ${token}` },
		cache: "no-store",
	});
	return new Response(await res.text(), {
		status: res.status,
		headers: { "content-type": res.headers.get("content-type") || "application/json" },
	});
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
	const token = req.headers.get("x-fitbit-token");
	if (!token) {
		return new Response("Missing x-fitbit-token", { status: 401 });
	}
	const { path } = await params;
	const url = buildTargetUrl(path || [], req.nextUrl.searchParams.toString());
	const body = await req.text();
	const res = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"content-type": req.headers.get("content-type") || "application/json",
		},
		body,
		cache: "no-store",
	});
	return new Response(await res.text(), {
		status: res.status,
		headers: { "content-type": res.headers.get("content-type") || "application/json" },
	});
}


