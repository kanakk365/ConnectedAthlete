import { FITBIT_CLIENT_ID } from "./config";
import { isAccessTokenExpired, loadTokens, saveTokens } from "./token-store";
import { refreshAccessToken } from "./client";

export function isAuthorized(): boolean {
	const tokens = loadTokens();
	return !!tokens && !isAccessTokenExpired(tokens);
}

export async function getValidAccessToken(): Promise<string | null> {
	const tokens = loadTokens();
	if (!tokens) return null;
	if (!isAccessTokenExpired(tokens)) return tokens.accessToken;

	if (!tokens.refreshToken || !FITBIT_CLIENT_ID) return null;
	try {
		const refreshed = await refreshAccessToken({
			refreshToken: tokens.refreshToken,
			clientId: FITBIT_CLIENT_ID,
		});
		saveTokens(refreshed);
		return refreshed.accessToken;
	} catch {
		return null;
	}
}

export async function fitbitFetch(path: string, init?: RequestInit) {
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
        return new Response("Unauthorized", { status: 401 }) as unknown as Response;
    }
    const call = async (token: string) =>
        fetch(`/api/fitbit${path}`, {
            ...init,
            headers: {
                ...(init?.headers || {}),
                "x-fitbit-token": token,
            },
        });

    const res = await call(accessToken);
    if (res.status !== 401) return res;

    const retryToken = await getValidAccessToken();
    if (!retryToken || retryToken === accessToken) return res;
    return await call(retryToken);
}


