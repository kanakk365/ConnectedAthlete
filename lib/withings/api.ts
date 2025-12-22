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

export async function withingsFetch(
  action: string,
  params: Record<string, string> = {}
) {
  const accessToken = getValidAccessToken();
  if (!accessToken) {
    return { status: 401, error: "Unauthorized" };
  }

  const res = await fetch(`/api/withings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-withings-token": accessToken,
    },
    body: JSON.stringify({ action, ...params }),
  });

  if (!res.ok) {
    return { status: res.status, error: `Request failed: ${res.status}` };
  }

  return res.json();
}
