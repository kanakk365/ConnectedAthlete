import { tokensFromResponse, saveTokens, loadTokens, FitbitTokens } from "./token-store";

const TOKEN_ENDPOINT = "https://api.fitbit.com/oauth2/token";

export type ExchangeCodeParams = {
	code: string;
	redirectUri: string;
	clientId: string;
	codeVerifier: string;
};

export async function exchangeCodeForToken(params: ExchangeCodeParams): Promise<FitbitTokens> {
	const body = new URLSearchParams({
		grant_type: "authorization_code",
		code: params.code,
		client_id: params.clientId,
		redirect_uri: params.redirectUri,
		code_verifier: params.codeVerifier,
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
	const tokens = tokensFromResponse(json);
	saveTokens(tokens);
	return tokens;
}

export type RefreshParams = {
	refreshToken: string;
	clientId: string;
};

export async function refreshAccessToken(params: RefreshParams): Promise<FitbitTokens> {
	const body = new URLSearchParams({
		grant_type: "refresh_token",
		refresh_token: params.refreshToken,
		client_id: params.clientId,
	});

	const res = await fetch(TOKEN_ENDPOINT, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body,
	});

	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`Refresh failed: ${res.status} ${text}`);
	}

	const json = await res.json();
	const tokens = tokensFromResponse(json);
	saveTokens(tokens);
	return tokens;
}

export function getStoredTokens(): FitbitTokens | null {
	return loadTokens();
}


