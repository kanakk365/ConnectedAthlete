import { NextRequest } from "next/server";

const POLAR_API_BASE = "https://www.polaraccesslink.com";

function buildTargetUrl(pathSegments: string[], search: string): string {
  const path = "/" + pathSegments.map(encodeURIComponent).join("/");
  return `${POLAR_API_BASE}${path}${search ? `?${search}` : ""}`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const token = req.headers.get("x-polar-token");
  if (!token) {
    return new Response("Missing x-polar-token", { status: 401 });
  }

  const { path } = await params;
  const url = buildTargetUrl(path || [], req.nextUrl.searchParams.toString());

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  return new Response(await res.text(), {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json",
    },
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const token = req.headers.get("x-polar-token");
  if (!token) {
    return new Response("Missing x-polar-token", { status: 401 });
  }

  const { path } = await params;
  const url = buildTargetUrl(path || [], req.nextUrl.searchParams.toString());
  const body = await req.text();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": req.headers.get("content-type") || "application/json",
      Accept: "application/json",
    },
    body,
    cache: "no-store",
  });

  return new Response(await res.text(), {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json",
    },
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const token = req.headers.get("x-polar-token");
  if (!token) {
    return new Response("Missing x-polar-token", { status: 401 });
  }

  const { path } = await params;
  const url = buildTargetUrl(path || [], req.nextUrl.searchParams.toString());

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return new Response(await res.text(), {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json",
    },
  });
}
