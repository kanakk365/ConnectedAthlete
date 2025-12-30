import { NextRequest, NextResponse } from "next/server";

const POLAR_TOKEN_URL = "https://polarremote.com/v2/oauth2/token";
const POLAR_API_BASE = "https://www.polaraccesslink.com";

export async function POST(req: NextRequest) {
  try {
    const { code, redirectUri, clientId, clientSecret } = await req.json();

    if (!code || !redirectUri || !clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Step 1: Exchange authorization code for access token
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );

    const tokenBody = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    });

    const tokenRes = await fetch(POLAR_TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json;charset=UTF-8",
      },
      body: tokenBody,
    });

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error("Token exchange failed:", tokenRes.status, errorText);
      return NextResponse.json(
        {
          error: `Token exchange failed: ${tokenRes.status}`,
          details: errorText,
        },
        { status: tokenRes.status }
      );
    }

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error }, { status: 400 });
    }

    // Step 2: Register user with Polar AccessLink (required for data access)
    const registerBody = JSON.stringify({
      "member-id": `user_${Date.now()}`,
    });

    const registerRes = await fetch(`${POLAR_API_BASE}/v3/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: registerBody,
    });

    // 409 Conflict means user is already registered, which is fine
    if (registerRes.status === 409) {
      console.log("User already registered with Polar");
    } else if (!registerRes.ok) {
      const registerError = await registerRes.text();
      console.warn(
        "User registration warning:",
        registerRes.status,
        registerError
      );
      // Continue anyway - registration might fail if user already exists
    }

    // Return the token data
    return NextResponse.json({
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
      token_type: tokenData.token_type,
      x_user_id: tokenData.x_user_id,
    });
  } catch (error) {
    console.error("Polar auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
