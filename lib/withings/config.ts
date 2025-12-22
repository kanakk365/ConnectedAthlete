export const WITHINGS_CLIENT_ID =
  process.env.NEXT_PUBLIC_WITHINGS_CLIENT_ID || "";
export const WITHINGS_CLIENT_SECRET =
  process.env.NEXT_PUBLIC_WITHINGS_CLIENT_SECRET || "";
export const WITHINGS_REDIRECT_URI =
  process.env.NEXT_PUBLIC_WITHINGS_REDIRECT_URI ||
  "http://localhost:3000/withings/callback";
export const WITHINGS_DEFAULT_SCOPE =
  process.env.NEXT_PUBLIC_WITHINGS_SCOPE || "user.metrics,user.activity";
