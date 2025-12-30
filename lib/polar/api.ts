import { isAccessTokenExpired, loadTokens } from "./token-store";

export function isAuthorized(): boolean {
  const tokens = loadTokens();
  return !!tokens && !isAccessTokenExpired(tokens);
}

export function getValidAccessToken(): string | null {
  const tokens = loadTokens();
  if (!tokens) return null;
  if (isAccessTokenExpired(tokens)) return null;
  return tokens.accessToken;
}

export function getPolarUserId(): number | null {
  const tokens = loadTokens();
  return tokens?.userId || null;
}

/**
 * Make authenticated requests to Polar API through our proxy
 * The proxy adds the authorization header server-side for security
 */
export async function polarFetch(path: string, init?: RequestInit) {
  const accessToken = getValidAccessToken();
  if (!accessToken) {
    return { status: 401, error: "Unauthorized" };
  }

  const res = await fetch(`/api/polar${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      "x-polar-token": accessToken,
    },
  });

  if (!res.ok) {
    return { status: res.status, error: `Request failed: ${res.status}` };
  }

  return res.json();
}

/**
 * Make GET request to Polar API
 */
export async function polarGet(path: string) {
  return polarFetch(path, { method: "GET" });
}

/**
 * Make POST request to Polar API
 */
export async function polarPost(path: string, body?: object) {
  return polarFetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}
