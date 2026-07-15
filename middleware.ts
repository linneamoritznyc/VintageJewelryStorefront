import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, static files (anything with a dot,
  // e.g. icon.svg), and the SEO endpoints, which stay locale-neutral.
  matcher: ["/((?!api|_next|_vercel|robots.txt|sitemap.xml|llms.txt|.*\\..*).*)"],
};
