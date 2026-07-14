import type { Collection } from "../types";

/**
 * Mirrors the real Shopify collections. Category collections drive nav order;
 * adding a category later is a single new entry (plus products tagged to its
 * handle), nothing downstream hardcodes this list's length.
 */
export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: "gid://shopify/Collection/orhangen",
    handle: "orhangen",
    title: "Örhängen",
    description: "Örhängen i originalskick, från diskreta studs till kristaller.",
    image: null,
  },
  {
    id: "gid://shopify/Collection/halsband",
    handle: "halsband",
    title: "Halsband",
    description: "Choker, kedjor och medaljonger ur samma parti, i originalskick.",
    image: null,
  },
  {
    id: "gid://shopify/Collection/armband",
    handle: "armband",
    title: "Armband",
    description: "Pärlor, länkar och banglar att stapla, i originalskick.",
    image: null,
  },
  {
    id: "gid://shopify/Collection/ovrigt",
    handle: "ovrigt",
    title: "Övrigt",
    description: "Fotlänkar, broscher, ringar och annat smått ur lagret.",
    image: null,
  },
  {
    id: "gid://shopify/Collection/perfekta-presenter",
    handle: "perfekta-presenter",
    title: "Perfekta presenter",
    description: "Ett urval fynd som blir en fin present, i originalskick.",
    image: null,
  },
  {
    id: "gid://shopify/Collection/manadens-fynd",
    handle: "manadens-fynd",
    title: "Månadens fynd",
    description: "Ett nytt urval ur lagret varje månad.",
    image: null,
  },
  {
    id: "gid://shopify/Collection/smyckeshallare",
    handle: "smyckeshallare",
    title: "Smyckeshållare",
    description: "Förvara och visa upp fynden.",
    image: null,
  },
  {
    id: "gid://shopify/Collection/smyckesrengoring",
    handle: "smyckesrengoring",
    title: "Smyckesrengöring",
    description: "Håll fynden i skick.",
    image: null,
  },
  {
    id: "gid://shopify/Collection/presentforpackningar",
    handle: "presentforpackningar",
    title: "Presentförpackningar",
    description: "Gör om ett fynd till en färdig present.",
    image: null,
  },
];
