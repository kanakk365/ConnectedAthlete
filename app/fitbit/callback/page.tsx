"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { exchangeCodeForToken } from "@/lib/fitbit/client";
import { clearPendingPkce, getPendingPkce } from "@/lib/fitbit/pkce";
import { FITBIT_CLIENT_ID, FITBIT_REDIRECT_URI } from "@/lib/fitbit/config";

export default function FitbitCallbackPage() {
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

      const pending = getPendingPkce();
      if (!pending) {
        setStatus("error");
        setError("Missing PKCE verifier from session");
        return;
      }

      try {
        await exchangeCodeForToken({
          code,
          redirectUri: FITBIT_REDIRECT_URI,
          clientId: FITBIT_CLIENT_ID,
          codeVerifier: pending.codeVerifier,
        });
        clearPendingPkce();
        setStatus("success");
        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          router.replace("/dashboard");
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
          <div className="mb-4 text-lg font-semibold">Connecting to Fitbit...</div>
          <div className="text-sm text-muted-foreground">Please wait while we complete the authorization.</div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg font-semibold text-green-600">Successfully connected!</div>
          <div className="text-sm text-muted-foreground">Redirecting to dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-lg font-semibold text-red-600">Connection Failed</div>
        <div className="mb-4 text-sm text-muted-foreground">{error}</div>
        <button
          onClick={() => router.push("/dashboard")}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

