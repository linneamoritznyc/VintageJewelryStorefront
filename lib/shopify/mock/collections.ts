import type { Collection } from "../types";

/**
 * The four storefront categories. Order here defines nav order. Adding a
 * category later is a single new entry (plus products tagged to its handle) —
 * nothing downstream hardcodes this list's length.
 */
export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: "gid://shopify/Collection/orhangen",
    handle: "orhangen",
    title: "Örhängen",
    description:
      "Från diskreta studs till dramatiska kristaller — örhängen som legat och väntat på sitt första öra.",
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
];
