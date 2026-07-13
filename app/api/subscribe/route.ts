import { NextResponse } from "next/server";

/**
 * Newsletter / email-capture endpoint. The popup, the homepage block and any
 * future form POST here instead of doing a client-side stub, so there is a
 * single server-side integration point for the marketing list.
 *
 * It forwards the address to a provider when one is configured via env,
 * currently Klaviyo (server-only key, never exposed to the browser):
 *   KLAVIYO_API_KEY   private API key (pk_...)
 *   KLAVIYO_LIST_ID   the list to subscribe to
 *
 * Until those are set it returns `{ ok: true, configured: false }`, the UI
 * still confirms and shows the discount code, and no address is silently
 * dropped into a black hole (the caller can decide what to do with
 * `configured`). Swap in Shopify Forms / another provider by editing only
 * `forwardToProvider` below.
 */

const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY;
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function forwardToProvider(email: string): Promise<boolean> {
  // Not configured yet: report "not forwarded" without failing the request.
  if (!KLAVIYO_API_KEY || !KLAVIYO_LIST_ID) return false;

  // Klaviyo "subscribe profiles" bulk job (2024+ API). Verify once the key is
  // set; this path does not run until then.
  const res = await fetch(
    "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/",
    {
      method: "POST",
      headers: {
        Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        "Content-Type": "application/json",
        revision: "2024-10-15",
      },
      body: JSON.stringify({
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            profiles: {
              data: [
                {
                  type: "profile",
                  attributes: {
                    email,
                    subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } },
                  },
                },
              ],
            },
          },
          relationships: { list: { data: { type: "list", id: KLAVIYO_LIST_ID } } },
        },
      }),
    },
  );
  if (!res.ok) throw new Error(`Klaviyo responded ${res.status}`);
  return true;
}

export async function POST(request: Request) {
  let email = "";
  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim() : "";
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  try {
    const configured = await forwardToProvider(email);
    return NextResponse.json({ ok: true, configured });
  } catch (err) {
    console.error("subscribe forward failed:", err);
    // Don't block the visitor from their code over a provider hiccup.
    return NextResponse.json({ ok: true, configured: false, forwarded: false });
  }
}
