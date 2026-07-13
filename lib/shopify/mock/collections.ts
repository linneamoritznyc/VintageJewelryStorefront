import type { Collection } from "../types";

/**
 * The four storefront categories. Order here defines nav order. Adding a
 * category later is a single new entry (plus products tagged to its handle) , 
 * nothing downstream hardcodes this list's length.
 */
export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: "gid://shopify/Collection/orhangen",
    handle: "orhangen",
    title: "Örhängen",
    description:
      "Från diskreta studs till dramatiska kristaller, örhängen som legat och väntat på sitt första öra.",
    image: null,
  },
  {
    id: "gid://shopify/Collection/halsband",
    handle: "halsband",
    title: "Halsband",
    description:
      "Choker, kedjor och medaljonger ur konkurslagret. Aldrig burna, redo att lagras och blandas.",
    image: null,
  },
  {
    id: "gid://shopify/Collection/armband",
    handle: "armband",
    title: "Armband",
    description:
      "Pärlor, länkar och banglar att stapla. Deadstock för handleden, långt under ursprungspris.",
    image: null,
  },
  {
    id: "gid://shopify/Collection/ovrigt",
    handle: "ovrigt",
    title: "Övrigt",
    description:
      "Fotlänkar, broscher, ringar och annat smått. Skattkammaren för det oväntade fyndet.",
    image: null,
  },
  /**
   * The three below are real Shopify collections too (not just the four
   * categories), but they're curated/marketing collections rather than
   * navigation categories, so they're deliberately excluded from primary nav
   * (see lib/config/navigation.ts). Still reachable directly at
   * /kategori/<handle> and used to source the homepage carousel.
   */
  {
    id: "gid://shopify/Collection/under-100-kr",
    handle: "under-100-kr",
    title: "Under 100 kr",
    description: "Alla våra fynd under 100 kr. Från 69 kr och uppåt. Perfekt att börja med.",
    image: null,
  },
  {
    id: "gid://shopify/Collection/perfekta-presenter",
    handle: "perfekta-presenter",
    title: "Perfekta presenter",
    description:
      "Handplockade vintage-fynd som passar perfekt att ge bort. Alla kommer i vår fina presentförpackning om du väljer bundle-alternativet.",
    image: null,
  },
  {
    id: "gid://shopify/Collection/manadens-fynd",
    handle: "manadens-fynd",
    title: "Månadens fynd",
    description:
      "Månadens utvalda vintage-fynd. Handplockade av oss för att visa spännvidden av vad som finns i vårt sortiment just nu. Uppdateras regelbundet.",
    image: null,
  },
];
