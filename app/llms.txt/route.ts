import { store } from "@/lib/shopify";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/config/site";

/**
 * /llms.txt , an LLM-friendly plain-text map of the site (the emerging
 * convention, https://llmstxt.org). Gives ChatGPT, Claude, Perplexity etc. a
 * concise, structured summary and the key links so they can represent the
 * store accurately in answers. Regenerated from live Shopify data.
 */
export const revalidate = 3600;

export async function GET() {
  let collectionsBlock = "";
  try {
    const collections = await store.getCollections();
    collectionsBlock = collections
      .map((c) => `- [${c.title}](${SITE_URL}/kategori/${c.handle}): ${c.description || ""}`.trimEnd())
      .join("\n");
  } catch {
    // fall back to a static map below
  }

  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME} är en svensk webbutik för vintage- och secondhand-smycken. Sortimentet är deadstock: oanvända smycken (örhängen, halsband, armband och övrigt) i originalskick som räddats ur ett svenskt varuhus lager och säljs vidare, ett exemplar av det mesta. Alla köp har 14 dagars lagstadgad ångerrätt, och kunden kan ångra köpet direkt online.

## Kategorier
${collectionsBlock || `- [Örhängen](${SITE_URL}/kategori/orhangen)\n- [Halsband](${SITE_URL}/kategori/halsband)\n- [Armband](${SITE_URL}/kategori/armband)\n- [Övrigt](${SITE_URL}/kategori/ovrigt)`}

## Viktiga sidor
- [Startsida](${SITE_URL}/)
- [Skapa ditt eget paket](${SITE_URL}/paket): fyll en ask med valfria delar för ett fast pris
- [Om oss](${SITE_URL}/om-oss)
- [Leverans och retur](${SITE_URL}/leverans)
- [Ångra ditt köp](${SITE_URL}/angra-kop)
- [Köpvillkor](${SITE_URL}/villkor)
- [Integritetspolicy](${SITE_URL}/integritet)

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
