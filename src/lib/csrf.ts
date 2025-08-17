import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Edge-compatible CSRF handling
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

export function setCsrfToken(response: NextResponse): string {
  const token = generateCsrfToken();
  response.cookies.set({
    name: "csrfToken",
    value: token,
    path: "/",
    httpOnly: false, // Changed from true
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3600,
  });
  return token;
}

export function validateCsrfToken(
  cookieToken?: string,
  headerToken?: string | null
): boolean {
  return !!cookieToken && cookieToken === headerToken;
}
