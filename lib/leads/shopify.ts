import type { LeadSinkResult, LeadSubmission } from "./types";

/**
 * Pushes a lead into Shopify as a customer with marketing consent, so Shopify
 * (and anything connected to it, e.g. Klaviyo) becomes the system of record.
 * Server-side only: uses the Admin API token, which must never reach the
 * browser. Inactive (a clean no-op) until SHOPIFY_STORE_DOMAIN and
 * SHOPIFY_ADMIN_API_TOKEN are set, so the app "just works" without credentials.
 */
const API_VERSION = "2026-07";

function adminEndpoint(): string | null {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!domain) return null;
  return `https://${domain}/admin/api/${API_VERSION}/graphql.json`;
}

async function adminRequest(query: string, variables: Record<string, unknown>) {
  const endpoint = adminEndpoint();
  const token = process.env.SHOPIFY_ADMIN_API_TOKEN;
  if (!endpoint || !token) return null;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) {
    throw new Error(json.errors?.[0]?.message ?? `Shopify Admin API ${res.status}`);
  }
  return json.data;
}

const CUSTOMER_CREATE = `
  mutation LeadCustomerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer { id }
      userErrors { field message }
    }
  }
`;

const CUSTOMER_BY_EMAIL = `
  query LeadCustomerByEmail($query: String!) {
    customers(first: 1, query: $query) {
      nodes { id }
    }
  }
`;

const CUSTOMER_CONSENT_UPDATE = `
  mutation LeadCustomerConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
    customerEmailMarketingConsentUpdate(input: $input) {
      customer { id }
      userErrors { field message }
    }
  }
`;

export async function pushLeadToShopify(lead: LeadSubmission): Promise<LeadSinkResult> {
  if (!adminEndpoint() || !process.env.SHOPIFY_ADMIN_API_TOKEN) {
    // Not configured: inactive, not an error, matches the rest of this app's
    // "ready but inactive until credentials exist" pattern.
    return { ok: true };
  }

  try {
    const consentInput = {
      marketingState: "SUBSCRIBED",
      marketingOptInLevel: "SINGLE_OPT_IN",
    };

    const created = await adminRequest(CUSTOMER_CREATE, {
      input: {
        email: lead.email,
        tags: [`lead-${lead.source}`],
        emailMarketingConsent: consentInput,
      },
    });

    const createErrors = created?.customerCreate?.userErrors ?? [];
    const alreadyExists = createErrors.some((e: { message: string }) =>
      /already been taken|taken/i.test(e.message),
    );

    if (!alreadyExists && created?.customerCreate?.customer) {
      return { ok: true };
    }
    if (!alreadyExists && createErrors.length > 0) {
      return { ok: false, error: createErrors[0].message };
    }

    // Existing customer: just (re)confirm marketing consent.
    const lookup = await adminRequest(CUSTOMER_BY_EMAIL, {
      query: `email:${lead.email}`,
    });
    const customerId = lookup?.customers?.nodes?.[0]?.id;
    if (!customerId) {
      return { ok: false, error: "Kunden hittades inte efter dubblettfel." };
    }

    const updated = await adminRequest(CUSTOMER_CONSENT_UPDATE, {
      input: { customerId, emailMarketingConsent: consentInput },
    });
    const updateErrors = updated?.customerEmailMarketingConsentUpdate?.userErrors ?? [];
    if (updateErrors.length > 0) {
      return { ok: false, error: updateErrors[0].message };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Okänt fel" };
  }
}
