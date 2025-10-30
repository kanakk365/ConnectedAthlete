// Session storage token handling for Fitbit OAuth tokens

const TOKEN_STORE_KEY = "fitbit_tokens";

export type FitbitTokens = {
	accessToken: string;
	refreshToken: string;
	expiresAt: number; // epoch ms
	scope?: string;
	tokenType?: string;
	userId?: string;
};

export function saveTokens(tokens: FitbitTokens) {
	if (typeof window === "undefined") return;
	sessionStorage.setItem(TOKEN_STORE_KEY, JSON.stringify(tokens));
}

export function loadTokens(): FitbitTokens | null {
	if (typeof window === "undefined") return null;
	const raw = sessionStorage.getItem(TOKEN_STORE_KEY);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as FitbitTokens;
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
	refresh_token: string;
	expires_in: number; // seconds
	token_type?: string;
	scope?: string;
	user_id?: string;
};

export function tokensFromResponse(resp: TokenResponse): FitbitTokens {
	const now = Date.now();
	// Refresh slightly early to avoid edge expiry (buffer 60s)
	const expiresAt = now + Math.max(0, (resp.expires_in - 60) * 1000);
	return {
		accessToken: resp.access_token,
		refreshToken: resp.refresh_token,
		expiresAt,
		scope: resp.scope,
		tokenType: resp.token_type,
		userId: resp.user_id,
	};
}

export function isAccessTokenExpired(tokens: FitbitTokens | null): boolean {
	if (!tokens) return true;
	return Date.now() >= tokens.expiresAt;
}


