import { NextResponse } from "next/server";

/**
 * Newsletter / email-capture endpoint: a thin forwarder into Shopify, which
 * is the system of record for customers and marketing consent. Klaviyo (or
 * any other email tool) syncs FROM Shopify via its own native integration,
 * so this endpoint never needs to know about it.
 *
 * Forwarding activates when these env vars are set (server-only, Admin API):
 *   SHOPIFY_ADMIN_API_TOKEN        Admin API access token (shpat_...)
 *   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN   already set for the Storefront API
 *
 * Until then it returns { ok: true, configured: false }: the UI still
 * confirms and shows the discount code.
 *
 * Abuse handling: a honeypot field ("website") is silently accepted and
 * discarded, and responses never reveal whether an address already exists
 * (no enumeration oracle). Consent is explicit (checkbox, unchecked by
 * default); the consent state and timestamp are recorded on the Shopify
 * customer, which is the GDPR audit trail.
 */

const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const ADMIN_API_VERSION = "2024-10";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function adminGraphQL(query: string, variables: Record<string, unknown>) {
  const res = await fetch(
    `https://${STORE_DOMAIN}/admin/api/${ADMIN_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": ADMIN_TOKEN as string,
      },
      body: JSON.stringify({ query, variables }),
    },
  );
  if (!res.ok) throw new Error(`Shopify Admin API responded ${res.status}`);
  return res.json();
}

/** Create the customer subscribed; if they already exist, update consent. */
async function forwardToShopify(email: string): Promise<boolean> {
  if (!ADMIN_TOKEN || !STORE_DOMAIN) return false;

  const consent = {
    marketingState: "SUBSCRIBED",
    marketingOptInLevel: "SINGLE_OPT_IN",
    consentUpdatedAt: new Date().toISOString(),
  };

  const created = await adminGraphQL(
    `mutation($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer { id }
        userErrors { code message }
      }
    }`,
    { input: { email, emailMarketingConsent: consent } },
  );

  const errors = created?.data?.customerCreate?.userErrors ?? [];
  if (errors.length === 0) return true;

  const taken = errors.some(
    (e: { code?: string; message?: string }) =>
      e.code === "TAKEN" || /taken/i.test(e.message ?? ""),
  );
  if (!taken) throw new Error(`customerCreate: ${JSON.stringify(errors)}`);

  // Existing customer: look them up and update the consent record instead.
  const found = await adminGraphQL(
    `query($q: String!) { customers(first: 1, query: $q) { nodes { id } } }`,
    { q: `email:${email}` },
  );
  const id = found?.data?.customers?.nodes?.[0]?.id;
  if (!id) throw new Error("customer lookup after TAKEN found nothing");

  const updated = await adminGraphQL(
    `mutation($input: CustomerEmailMarketingConsentUpdateInput!) {
      customerEmailMarketingConsentUpdate(input: $input) {
        userErrors { message }
      }
    }`,
    { input: { customerId: id, emailMarketingConsent: consent } },
  );
  const updateErrors =
    updated?.data?.customerEmailMarketingConsentUpdate?.userErrors ?? [];
  if (updateErrors.length > 0) {
    throw new Error(`consentUpdate: ${JSON.stringify(updateErrors)}`);
  }
  return true;
}

export async function POST(request: Request) {
  let email = "";
  let consent = false;
  let honeypot = "";
  try {
    const body = (await request.json()) as {
      email?: unknown;
      consent?: unknown;
      website?: unknown;
    };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    consent = body.consent === true;
    honeypot = typeof body.website === "string" ? body.website : "";
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  // Bot filled the hidden field: accept silently, forward nothing.
  if (honeypot !== "") {
    return NextResponse.json({ ok: true, configured: false });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json({ ok: false, error: "consent_required" }, { status: 400 });
  }

  try {
    const configured = await forwardToShopify(email);
    return NextResponse.json({ ok: true, configured });
  } catch (err) {
    console.error("subscribe forward failed:", err);
    // Don't block the visitor from their code over a provider hiccup.
    return NextResponse.json({ ok: true, configured: false, forwarded: false });
  }
}
