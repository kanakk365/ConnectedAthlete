// Polar AccessLink API configuration
export const POLAR_CLIENT_ID = process.env.NEXT_PUBLIC_POLAR_CLIENT_ID || "";
export const POLAR_CLIENT_SECRET =
  process.env.NEXT_PUBLIC_POLAR_CLIENT_SECRET || "";
export const POLAR_REDIRECT_URI =
  process.env.NEXT_PUBLIC_POLAR_REDIRECT_URI ||
  "http://localhost:3000/polar/callback";

// Polar uses accesslink.read_all scope for full data access
export const POLAR_DEFAULT_SCOPE =
  process.env.NEXT_PUBLIC_POLAR_SCOPE || "accesslink.read_all";

// Polar API base URLs
export const POLAR_AUTH_URL = "https://flow.polar.com/oauth2/authorization";
export const POLAR_TOKEN_URL = "https://polarremote.com/v2/oauth2/token";
export const POLAR_API_BASE = "https://www.polaraccesslink.com";
