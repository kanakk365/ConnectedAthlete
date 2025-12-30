"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveTokens, tokensFromResponse } from "@/lib/polar/token-store";
import { POLAR_CLIENT_ID, POLAR_CLIENT_SECRET, POLAR_REDIRECT_URI } from "@/lib/polar/config";

function PolarCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const code = searchParams.get("code");
            const err = searchParams.get("error");
            const errorDescription = searchParams.get("error_description");

            if (err) {
                setStatus("error");
                setError(errorDescription || err);
                return;
            }

            if (!code) {
                setStatus("error");
                setError("No authorization code received");
                return;
            }

            if (!POLAR_CLIENT_ID || !POLAR_CLIENT_SECRET) {
                setStatus("error");
                setError("Missing Polar client credentials");
                return;
            }

            try {
                // Use server-side API route to exchange code and register user
                // This avoids CORS issues with Polar's API
                const res = await fetch("/api/polar/auth", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        code,
                        redirectUri: POLAR_REDIRECT_URI,
                        clientId: POLAR_CLIENT_ID,
                        clientSecret: POLAR_CLIENT_SECRET,
                    }),
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.error || `Authentication failed: ${res.status}`);
                }

                const tokenData = await res.json();

                // Save tokens to session storage
                const tokens = tokensFromResponse(tokenData);
                saveTokens(tokens);

                setStatus("success");
                // Redirect to Polar dashboard after a brief delay
                setTimeout(() => {
                    router.replace("/dashboard/polar");
                }, 1000);
            } catch (e: unknown) {
                setStatus("error");
                const msg = e instanceof Error ? e.message : "Token exchange failed";
                setError(msg);
            }
        })();
    }, [router, searchParams]);

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 text-lg font-semibold">Connecting to Polar...</div>
                    <div className="text-sm text-muted-foreground">
                        Please wait while we complete the authorization.
                    </div>
                </div>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 text-lg font-semibold text-green-600">
                        Successfully connected!
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Redirecting to Polar dashboard...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <div className="mb-4 text-lg font-semibold text-red-600">
                    Connection Failed
                </div>
                <div className="mb-4 text-sm text-muted-foreground">{error}</div>
                <button
                    onClick={() => router.push("/dashboard/polar")}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Return to Polar
                </button>
            </div>
        </div>
    );
}

export default function PolarCallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-center">
                        <div className="mb-4 text-lg font-semibold">
                            Connecting to Polar...
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Please wait while we complete the authorization.
                        </div>
                    </div>
                </div>
            }
        >
            <PolarCallbackContent />
        </Suspense>
    );
}
