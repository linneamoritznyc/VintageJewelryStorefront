/**
 * Renders a JSON-LD structured-data block. Server component, safe to drop into
 * any page. Structured data is what lets search engines and AI answer engines
 * (Google AI Overviews, ChatGPT, Perplexity) understand products, prices,
 * breadcrumbs and FAQs, the difference between "a page exists" and "the model
 * can quote your price and return policy".
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify escapes </script> sequences in string values as <,
      // so this cannot break out of the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
