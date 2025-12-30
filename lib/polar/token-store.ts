// Session storage token handling for Polar OAuth tokens

const TOKEN_STORE_KEY = "polar_tokens";

export type PolarTokens = {
  accessToken: string;
  expiresAt: number; // epoch ms
  tokenType?: string;
  userId?: number; // x_user_id from Polar
};

export function saveTokens(tokens: PolarTokens) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(TOKEN_STORE_KEY, JSON.stringify(tokens));
}

export function loadTokens(): PolarTokens | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(TOKEN_STORE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PolarTokens;
  } catch {
    return null;
  }
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOKEN_STORE_KEY);
}

export type TokenResponse = {
  access_token: string;
  expires_in: number; // seconds (about 1 year for Polar)
  token_type?: string;
  x_user_id?: number; // Polar user identifier
};

export function tokensFromResponse(resp: TokenResponse): PolarTokens {
  const now = Date.now();
  // Polar tokens last about 1 year, but we add a buffer
  const expiresAt = now + Math.max(0, (resp.expires_in - 60) * 1000);
  return {
    accessToken: resp.access_token,
    expiresAt,
    tokenType: resp.token_type,
    userId: resp.x_user_id,
  };
}

export function isAccessTokenExpired(tokens: PolarTokens | null): boolean {
  if (!tokens) return true;
  return Date.now() >= tokens.expiresAt;
}
