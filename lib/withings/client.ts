import {
  tokensFromResponse,
  saveTokens,
  loadTokens,
  WithingsTokens,
} from "./token-store";

const TOKEN_ENDPOINT = "https://wbsapi.withings.net/v2/oauth2";

export type ExchangeCodeParams = {
  code: string;
  redirectUri: string;
  clientId: string;
  clientSecret: string;
};

export async function exchangeCodeForToken(
  params: ExchangeCodeParams
): Promise<WithingsTokens> {
  const body = new URLSearchParams({
    action: "requesttoken",
    grant_type: "authorization_code",
    code: params.code,
    client_id: params.clientId,
    client_secret: params.clientSecret,
    redirect_uri: params.redirectUri,
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Token exchange failed: ${res.status} ${text}`);
  }

  const json = await res.json();

  // Withings returns { status: 0, body: { access_token, ... } } on success
  if (json.status !== 0) {
    throw new Error(`Withings error: ${json.error || "Unknown error"}`);
  }

  const tokens = tokensFromResponse(json.body);
  saveTokens(tokens);
  return tokens;
}

export function getStoredTokens(): WithingsTokens | null {
  return loadTokens();
}
