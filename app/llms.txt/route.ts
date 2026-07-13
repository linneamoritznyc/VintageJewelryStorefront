import { store } from "@/lib/shopify";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/config/site";
import { isNavCollectionHandle, SYSTEM_COLLECTION_HANDLES } from "@/lib/config/navigation";

/**
 * /llms.txt , an LLM-friendly plain-text map of the site (the emerging
 * convention, https://llmstxt.org). Gives ChatGPT, Claude, Perplexity etc. a
 * concise, structured summary and the key links so they can represent the
 * store accurately in answers. Regenerated from live Shopify data.
 */
export const revalidate = 3600;

export async function GET() {
  let collectionsBlock = "";
  let blogBlock = "";
  try {
    const [collections, articles] = await Promise.all([
      store.getCollections(),
      store.getBlogArticles(),
    ]);
    const cats = collections.filter(
      (c) => !(SYSTEM_COLLECTION_HANDLES as readonly string[]).includes(c.handle),
    );
    collectionsBlock = cats
      .map((c) => `- [${c.title}](${SITE_URL}/kategori/${c.handle}): ${c.description || ""}`.trimEnd())
      .join("\n");
    blogBlock = articles
      .map((a) => `- [${a.title}](${SITE_URL}/blogg/${a.handle})`)
      .join("\n");
  } catch {
    // fall back to a static map below
  }

  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME} är en svensk webbutik för vintage och second hand-smycken. Sortimentet är deadstock: oanvända, aldrig burna smycken (örhängen, halsband, armband, ringar och broscher) som räddats ur tömda svenska varuhuslager och säljs vidare från 69 kr. Alla köp har 14 dagars lagstadgad ångerrätt, och kunden kan ångra köpet direkt online.

## Kategorier
${collectionsBlock || `- [Örhängen](${SITE_URL}/kategori/orhangen)\n- [Halsband](${SITE_URL}/kategori/halsband)\n- [Armband](${SITE_URL}/kategori/armband)\n- [Övrigt](${SITE_URL}/kategori/ovrigt)`}

## Viktiga sidor
- [Startsida](${SITE_URL}/)
- [Skapa ditt eget paket](${SITE_URL}/paket): tre pjäser från olika kategorier med automatisk pakträtt
- [Om oss](${SITE_URL}/om-oss)
- [Vanliga frågor (FAQ)](${SITE_URL}/faq)
- [Leverans](${SITE_URL}/leverans)
- [Ångerrätt och returer](${SITE_URL}/angerratt)
- [Kontakt](${SITE_URL}/kontakt)

## Blogg
${blogBlock || `- [Blogg](${SITE_URL}/blogg)`}

## Mer
- Fullständig sitemap: ${SITE_URL}/sitemap.xml
- Marknad: Sverige. Valuta: SEK. Språk: svenska.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
