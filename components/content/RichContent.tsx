/**
 * Renders HTML body content from a Shopify Page or Article (already
 * sanitized by Shopify) with the site's typographic scale, since no
 * typography plugin is installed. Used by every static content page and the
 * blog so copy edited in Shopify (once live) looks consistent without any
 * component change.
 */
export function RichContent({ html, className = "" }: { html: string; className?: string }) {
  return (
    <div
      className={`space-y-4 leading-relaxed text-plum-soft [&_a]:font-semibold [&_a]:text-fuchsia-brand [&_a]:underline [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-ink [&_h3]:mt-4 [&_h3]:font-display [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink [&_ul]:space-y-1 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
