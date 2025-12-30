import {
  tokensFromResponse,
  saveTokens,
  loadTokens,
  PolarTokens,
} from "./token-store";
import { POLAR_TOKEN_URL, POLAR_API_BASE } from "./config";

export type ExchangeCodeParams = {
  code: string;
  redirectUri: string;
  clientId: string;
  clientSecret: string;
};

/**
 * Exchange authorization code for access token
 * Polar uses Basic Auth with base64 encoded client_id:client_secret
 */
export async function exchangeCodeForToken(
  params: ExchangeCodeParams
): Promise<PolarTokens> {
  const credentials = btoa(`${params.clientId}:${params.clientSecret}`);

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: params.code,
    redirect_uri: params.redirectUri,
  });

  console.log("Polar token exchange request:", {
    url: POLAR_TOKEN_URL,
    code: params.code.substring(0, 10) + "...",
    redirectUri: params.redirectUri,
  });

  const res = await fetch(POLAR_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json;charset=UTF-8",
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Token exchange failed: ${res.status} ${text}`);
  }

  const json = await res.json();

  if (json.error) {
    throw new Error(`Polar OAuth error: ${json.error}`);
  }

  const tokens = tokensFromResponse(json);
  saveTokens(tokens);
  return tokens;
}

/**
 * Register user with Polar AccessLink
 * This is required after obtaining the access token to access user data
 */
export async function registerUser(
  accessToken: string,
  memberId?: string
): Promise<{ polarUserId: number; memberIdentifier?: string }> {
  const body = JSON.stringify({
    "member-id": memberId || `user_${Date.now()}`,
  });

  const res = await fetch(`${POLAR_API_BASE}/v3/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body,
  });

  // 409 Conflict means user is already registered, which is fine
  if (res.status === 409) {
    return { polarUserId: 0 };
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    // If registration fails but we have the token, proceed anyway
    console.warn(`User registration response: ${res.status} ${text}`);
    return { polarUserId: 0 };
  }

  const json = await res.json();
  return {
    polarUserId: json["polar-user-id"] || 0,
    memberIdentifier: json["member-id"],
  };
}

/**
 * Get user information from Polar
 */
export async function getUserInfo(accessToken: string) {
  const res = await fetch(`${POLAR_API_BASE}/v3/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Get user info failed: ${res.status} ${text}`);
  }

  return res.json();
}

/**
 * Delete user registration from Polar AccessLink
 */
export async function deleteUserRegistration(
  userId: number,
  accessToken: string
): Promise<void> {
  const res = await fetch(`${POLAR_API_BASE}/v3/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    const text = await res.text().catch(() => "");
    throw new Error(`Delete user failed: ${res.status} ${text}`);
  }
}

export function getStoredTokens(): PolarTokens | null {
  return loadTokens();
}
