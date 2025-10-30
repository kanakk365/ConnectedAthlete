// Utilities for generating OAuth2 PKCE parameters and building Fitbit authorize URL

const PKCE_STORE_KEY = "fitbit_pkce_pending";

function base64UrlEncode(bytes: ArrayBuffer): string {
	const binString = String.fromCharCode(...new Uint8Array(bytes));
	const base64 = btoa(binString);
	return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sha256(input: string): Promise<ArrayBuffer> {
	const encoder = new TextEncoder();
	const data = encoder.encode(input);
	return await crypto.subtle.digest("SHA-256", data);
}

export async function generateCodeVerifier(length = 64): Promise<string> {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
	const randomValues = new Uint8Array(length);
	crypto.getRandomValues(randomValues);
	let result = "";
	for (let i = 0; i < randomValues.length; i++) {
		result += charset[randomValues[i] % charset.length];
	}
	return result;
}

export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
	const digest = await sha256(codeVerifier);
	return base64UrlEncode(digest);
}

export async function createPkce() {
	const codeVerifier = await generateCodeVerifier();
	const codeChallenge = await generateCodeChallenge(codeVerifier);
	return { codeVerifier, codeChallenge } as const;
}

export type BuildAuthorizeUrlParams = {
	clientId: string;
	redirectUri: string;
	scope: string; // space-separated
	codeChallenge: string;
	state?: string;
	prompt?: "consent" | "login";
};

export function buildAuthorizeUrl(params: BuildAuthorizeUrlParams): string {
	const query = new URLSearchParams({
		response_type: "code",
		client_id: params.clientId,
		redirect_uri: params.redirectUri,
		scope: params.scope,
		code_challenge: params.codeChallenge,
		code_challenge_method: "S256",
	});
	if (params.state) query.set("state", params.state);
	if (params.prompt) query.set("prompt", params.prompt);
	return `https://www.fitbit.com/oauth2/authorize?${query.toString()}`;
}

export type PendingPkce = {
	codeVerifier: string;
	createdAt: number;
	state?: string;
};

export function savePendingPkce(pending: PendingPkce) {
	if (typeof window === "undefined") return;
	sessionStorage.setItem(PKCE_STORE_KEY, JSON.stringify(pending));
}

export function getPendingPkce(): PendingPkce | null {
	if (typeof window === "undefined") return null;
	const raw = sessionStorage.getItem(PKCE_STORE_KEY);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as PendingPkce;
	} catch {
		return null;
	}
}

export function clearPendingPkce() {
	if (typeof window === "undefined") return;
	sessionStorage.removeItem(PKCE_STORE_KEY);
}


