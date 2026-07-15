import { NextResponse } from "next/server";
import { recordLead } from "@/lib/leads";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_SOURCES = new Set(["popup", "banner", "inline"]);

/**
 * Thin lead-capture endpoint behind the email popup/banner/inline block.
 * Validates, rejects bots via honeypot, then fans out to every configured
 * sink (Shopify customer list, Google Sheet) via `recordLead`. Always returns
 * a generic response, never reveals which downstream sinks are configured.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ogiltig förfrågan." }, { status: 400 });
  }

  const { email, consent, source, company } = (body ?? {}) as Record<string, unknown>;

  // Honeypot: a hidden field real users never fill in. Silently "succeed" so
  // bots get no signal that they were caught.
  if (typeof company === "string" && company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ ok: false, error: "Ange en giltig e-postadress." }, { status: 400 });
  }

  if (consent !== true) {
    return NextResponse.json(
      { ok: false, error: "Kryssa i samtycket för att bli medlem." },
      { status: 400 },
    );
  }

  const safeSource = typeof source === "string" && VALID_SOURCES.has(source) ? source : "inline";

  await recordLead({
    email: email.trim().toLowerCase(),
    consent: true,
    source: safeSource as "popup" | "banner" | "inline",
  });

  return NextResponse.json({ ok: true });
}
