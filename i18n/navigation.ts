import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware drop-in replacements for next/link and next/navigation's
 * router/pathname hooks. Any relative href passed to this `Link` gets the
 * current locale prefix added automatically (or none, for Swedish, since
 * localePrefix is "as-needed") — component code otherwise reads exactly like
 * plain next/link.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
