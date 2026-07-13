import { createSign } from "node:crypto";
import type { LeadSinkResult, LeadSubmission } from "./types";

/**
 * Appends a lead as a row to a Google Sheet, authenticated as a Google service
 * account. Uses only Node's built-in `crypto` to self-sign the JWT bearer
 * token (no Google API client dependency needed for one write-only call).
 *
 * Inactive (a clean no-op) until GOOGLE_SERVICE_ACCOUNT_EMAIL,
 * GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY and GOOGLE_SHEETS_SPREADSHEET_ID are set.
 * Set up: create a service account in Google Cloud, share the target Sheet
 * with its email (Editor), then paste its email/private key/sheet ID here.
 */
const SHEET_NAME = process.env.GOOGLE_SHEETS_SHEET_NAME || "Leads";

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function getAccessToken(): Promise<string | null> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !rawKey) return null;
  const privateKey = rawKey.replace(/\\n/g, "\n");

  const nowSec = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({
      iss: email,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      iat: nowSec,
      exp: nowSec + 3600,
    }),
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  signer.end();
  const signature = base64url(signer.sign(privateKey));
  const assertion = `${header}.${claims}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!res.ok) {
    throw new Error(`Google OAuth token exchange failed (${res.status})`);
  }
  const json = await res.json();
  return json.access_token as string;
}

export async function pushLeadToSheet(lead: LeadSubmission): Promise<LeadSinkResult> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (
    !spreadsheetId ||
    !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  ) {
    // Not configured: inactive, not an error.
    return { ok: true };
  }

  try {
    const accessToken = await getAccessToken();
    if (!accessToken) return { ok: true };

    const range = encodeURIComponent(`${SHEET_NAME}!A:D`);
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [[new Date().toISOString(), lead.email, lead.consent, lead.source]],
        }),
      },
    );
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Google Sheets ${res.status}: ${text}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Okänt fel" };
  }
}
