import type { Product, ProductVariant, Image } from "../types";

/**
 * Mock catalog. Mirrors the Storefront API `Product` shape so the UI runs
 * realistically before live credentials exist. The catalog is fully
 * data-driven: nothing in the app hardcodes product counts or per-category
 * assumptions, so adding product #500 is a single new entry here (or, later, a
 * new product in Shopify admin).
 *
 * Image URLs use a `mock:` scheme consumed by <ProductImage>, which renders a
 * deterministic gradient placeholder. When live, these become Shopify CDN URLs
 * and the same component renders them via next/image — no component changes.
 */

const CURRENCY = "SEK";

function money(amount: number) {
  return { amount: amount.toFixed(2), currencyCode: CURRENCY };
}

function mockImage(seed: string, hue: number, title: string): Image {
  return {
    url: `mock:${seed}:${hue}`,
    altText: title,
    width: 1000,
    height: 1000,
  };
}

interface SeedInput {
  handle: string;
  title: string;
  category: string; // collection handle
  price: number;
  /** Original retail before liquidation, if known. */
  compareAt?: number;
  stock: number;
  hue: number; // gradient hue for placeholder image
  daysAgo: number; // recency, drives "newest" ordering
  description: string;
  vintageStory: string;
  tags?: string[];
  /** Optional metal-colour variants. Omit for single-variant products. */
  metals?: string[];
}

// Fixed reference instant so the mock catalog is deterministic across renders
// (server/client) and does not depend on the current clock. Represents
// "roughly now" for the purpose of ordering by recency.
const REFERENCE_ISO = "2026-07-01T09:00:00.000Z";
const REFERENCE_MS = Date.parse(REFERENCE_ISO);

function buildProduct(seed: SeedInput): Product {
  const id = `gid://shopify/Product/${seed.handle}`;
  const createdAt = new Date(
    REFERENCE_MS - seed.daysAgo * 24 * 60 * 60 * 1000,
  ).toISOString();

  const images: Image[] = [
    mockImage(`${seed.handle}-1`, seed.hue, seed.title),
    mockImage(`${seed.handle}-2`, (seed.hue + 24) % 360, seed.title),
  ];

  const metals = seed.metals ?? [];
  const variants: ProductVariant[] = [];

  if (metals.length > 0) {
    // Spread the stock across variants so per-variant inventory is realistic.
    const per = Math.max(1, Math.floor(seed.stock / metals.length));
    metals.forEach((metal, i) => {
      const remainder = i === metals.length - 1 ? seed.stock - per * (metals.length - 1) : per;
      variants.push({
        id: `gid://shopify/ProductVariant/${seed.handle}-${i}`,
        title: metal,
        availableForSale: remainder > 0,
        quantityAvailable: Math.max(0, remainder),
        selectedOptions: [{ name: "Metall", value: metal }],
        price: money(seed.price),
        compareAtPrice: seed.compareAt ? money(seed.compareAt) : null,
        image: images[0],
      });
    });
  } else {
    variants.push({
      id: `gid://shopify/ProductVariant/${seed.handle}-0`,
      title: "Default Title",
      availableForSale: seed.stock > 0,
      quantityAvailable: seed.stock,
      selectedOptions: [{ name: "Title", value: "Default Title" }],
      price: money(seed.price),
      compareAtPrice: seed.compareAt ? money(seed.compareAt) : null,
      image: images[0],
    });
  }

  const availableForSale = variants.some((v) => v.availableForSale);

  return {
    id,
    handle: seed.handle,
    title: seed.title,
    description: seed.description,
    descriptionHtml: `<p>${seed.description}</p>`,
    availableForSale,
    featuredImage: images[0],
    images,
    options:
      metals.length > 0
        ? [{ id: `${seed.handle}-opt-metall`, name: "Metall", values: metals }]
        : [],
    variants,
    priceRange: {
      minVariantPrice: money(seed.price),
      maxVariantPrice: money(seed.price),
    },
    compareAtPriceRange: {
      minVariantPrice: seed.compareAt ? money(seed.compareAt) : null,
      maxVariantPrice: seed.compareAt ? money(seed.compareAt) : null,
    },
    collections: [seed.category],
    tags: seed.tags ?? [],
    createdAt,
    vintageStory: seed.vintageStory,
  };
}

const SEEDS: SeedInput[] = [
  /* ---------------------------- ÖRHÄNGEN ---------------------------- */
  {
    handle: "orhangen-parla-drop",
    title: "Pärlörhängen 'Droppe'",
    category: "orhangen",
    price: 89,
    compareAt: 249,
    stock: 1,
    hue: 330,
    daysAgo: 2,
    description:
      "Klassiska droppformade örhängen med en liten sötvattenspärla. Diskreta nog för vardag, fina nog för fest.",
    vintageStory:
      "En kvarglömd klassiker från lagret — aldrig burna, aldrig sålda. Tidlösa pärlor som stått och väntat på sin första ägare sedan varumärket lade ner.",
    tags: ["pärla", "klassiker"],
  },
  {
    handle: "orhangen-guldhoops-liten",
    title: "Guldhoops 'Mini'",
    category: "orhangen",
    price: 95,
    compareAt: 199,
    stock: 6,
    hue: 45,
    daysAgo: 5,
    description:
      "Små ringörhängen i guldton. Den där lagom-storleken som passar till precis allt.",
    vintageStory:
      "Deadstock i sin originalpåse. Små hoops som aldrig hann ut i butik innan lagret tömdes — nu får de äntligen ett öra att sitta på.",
    tags: ["hoops", "guld", "vardag"],
    metals: ["Guld", "Silver"],
  },
  {
    handle: "orhangen-stjarna-stud",
    title: "Stjärnörhängen 'Twinkle'",
    category: "orhangen",
    price: 79,
    compareAt: 169,
    stock: 12,
    hue: 275,
    daysAgo: 1,
    description: "Pyttesmå stjärnor i studs-modell. Blänker till precis lagom.",
    vintageStory:
      "Ett fynd ur konkurslagret — små stjärnor som legat orörda i sina fack. Aldrig burna, redo att glittra för första gången.",
    tags: ["studs", "stjärna"],
  },
  {
    handle: "orhangen-emalj-blomma",
    title: "Emaljörhängen 'Blom'",
    category: "orhangen",
    price: 98,
    compareAt: 229,
    stock: 3,
    hue: 12,
    daysAgo: 8,
    description:
      "Handmålad emaljblomma i varma toner. Retro-vibbar rakt av.",
    vintageStory:
      "Färgstarka emaljblommor som andas 90-tal. Osålt lager från varumärkets sista kollektion — helt oanvända.",
    tags: ["emalj", "retro", "färg"],
  },
  {
    handle: "orhangen-kristall-chandelier",
    title: "Kristallörhängen 'Chandelier'",
    category: "orhangen",
    price: 110,
    compareAt: 299,
    stock: 2,
    hue: 200,
    daysAgo: 14,
    description:
      "Hängande kristaller som fångar ljuset. Festörhängena du inte visste att du behövde.",
    vintageStory:
      "De mest dramatiska i lagret. Kristaller som aldrig fått dansa på ett golv — deadstock som väntar på sin premiär.",
    tags: ["kristall", "fest"],
  },
  {
    handle: "orhangen-geometrisk-triangel",
    title: "Örhängen 'Triangel'",
    category: "orhangen",
    price: 85,
    stock: 9,
    hue: 155,
    daysAgo: 3,
    description: "Rena geometriska trianglar. Minimalistiskt och grafiskt.",
    vintageStory:
      "Grafisk formgivning från en svunnen kollektion. Oanvänt lager som känns förvånansvärt nutida.",
    tags: ["geometrisk", "minimal"],
    metals: ["Guld", "Silver"],
  },
  {
    handle: "orhangen-mane-halvmane",
    title: "Halvmåneörhängen 'Luna'",
    category: "orhangen",
    price: 92,
    compareAt: 189,
    stock: 7,
    hue: 250,
    daysAgo: 6,
    description: "Böjda halvmånar med matt finish. Lite mystiska, väldigt fina.",
    vintageStory:
      "Månar som legat i mörkret på ett lager i åratal. Aldrig burna — nu redo att lysa upp.",
    tags: ["måne", "matt"],
  },
  {
    handle: "orhangen-parla-cluster",
    title: "Pärlörhängen 'Kluster'",
    category: "orhangen",
    price: 105,
    compareAt: 259,
    stock: 4,
    hue: 20,
    daysAgo: 10,
    description:
      "Ett litet kluster av pärlor i olika storlekar. Romantiskt utan att bli sött.",
    vintageStory:
      "Romantik ur ett konkursbo. Pärlkluster som aldrig hann bli någons favorit — förrän nu.",
    tags: ["pärla", "romantisk"],
  },
  {
    handle: "orhangen-tofs-fringe",
    title: "Tofsörhängen 'Fringe'",
    category: "orhangen",
    price: 88,
    compareAt: 179,
    stock: 5,
    hue: 300,
    daysAgo: 12,
    description: "Rörliga tofsar som svänger när du går. Fest i öronen.",
    vintageStory:
      "Deadstock med rörelse. Tofsar som stått stilla i ett lager alldeles för länge — dags att få dem att svaja.",
    tags: ["tofs", "fest"],
  },

  /* ---------------------------- HALSBAND ---------------------------- */
  {
    handle: "halsband-parla-choker",
    title: "Pärlchoker 'Nacre'",
    category: "halsband",
    price: 120,
    compareAt: 329,
    stock: 2,
    hue: 25,
    daysAgo: 2,
    description:
      "Kort pärlchoker som sitter fint mot halsen. Den nya klassikern.",
    vintageStory:
      "En choker ur konkurslagret som aldrig fick möta en hals. Oanvänd, i originalskick, redo för comeback.",
    tags: ["pärla", "choker"],
  },
  {
    handle: "halsband-guldkedja-fin",
    title: "Guldkedja 'Fin'",
    category: "halsband",
    price: 99,
    compareAt: 219,
    stock: 8,
    hue: 48,
    daysAgo: 4,
    description: "Tunn guldkedja för lagning. Bär ensam eller trassla ihop.",
    vintageStory:
      "Basplagget alla vill ha. Tunna kedjor från ett tömt lager — aldrig burna, alltid rätt.",
    tags: ["guld", "kedja", "layering"],
    metals: ["Guld", "Silver"],
  },
  {
    handle: "halsband-hjarta-locket",
    title: "Hjärtmedaljong 'Secret'",
    category: "halsband",
    price: 115,
    compareAt: 279,
    stock: 3,
    hue: 340,
    daysAgo: 7,
    description:
      "Öppningsbar medaljong i hjärtform. Gömställe för ett litet minne.",
    vintageStory:
      "En medaljong utan bild i — ännu. Deadstock som väntar på att få bära ditt hemlighet.",
    tags: ["medaljong", "hjärta", "romantisk"],
  },
  {
    handle: "halsband-berlock-mane",
    title: "Berlockhalsband 'Måne & Stjärna'",
    category: "halsband",
    price: 108,
    compareAt: 239,
    stock: 6,
    hue: 260,
    daysAgo: 5,
    description: "Kedja med måne- och stjärnberlocker. Himlen runt halsen.",
    vintageStory:
      "Små himlakroppar ur ett konkursbo. Aldrig burna berlocker som legat och drömt på ett lager.",
    tags: ["berlock", "måne", "stjärna"],
  },
  {
    handle: "halsband-fargad-sten",
    title: "Halsband 'Färgad sten'",
    category: "halsband",
    price: 125,
    compareAt: 289,
    stock: 1,
    hue: 190,
    daysAgo: 9,
    description:
      "En enda färgad sten på tunn kedja. Enkelt statement i turkos.",
    vintageStory:
      "Den sista i sitt slag på lagret. En färgsten som aldrig fått fångas av dagsljus — tills nu.",
    tags: ["sten", "statement", "färg"],
  },
  {
    handle: "halsband-parla-langt",
    title: "Långt pärlhalsband 'Flapper'",
    category: "halsband",
    price: 135,
    compareAt: 349,
    stock: 4,
    hue: 30,
    daysAgo: 11,
    description:
      "Extra långt pärlband att snurra dubbelt. 20-talsenergi hela vägen.",
    vintageStory:
      "Flapper-drömmar från ett tömt lager. Långa pärlrader som aldrig fått en fest att gå på.",
    tags: ["pärla", "långt", "retro"],
  },
  {
    handle: "halsband-tunn-satellit",
    title: "Satellitkedja 'Prickig'",
    category: "halsband",
    price: 102,
    stock: 10,
    hue: 50,
    daysAgo: 3,
    description:
      "Fin kedja med små kulor jämnt fördelade. Diskret men detaljrik.",
    vintageStory:
      "Detaljen som gör skillnad. Satellitkedjor ur deadstock — oanvända och oemotståndliga.",
    tags: ["kedja", "layering"],
    metals: ["Guld", "Silver"],
  },
  {
    handle: "halsband-emalj-flower-power",
    title: "Halsband 'Flower Power'",
    category: "halsband",
    price: 118,
    compareAt: 249,
    stock: 5,
    hue: 15,
    daysAgo: 13,
    description: "Emaljblomma i glada färger på kort kedja. Ren dopaminstyling.",
    vintageStory:
      "Färgexplosion ur ett konkurslager. En blomma som aldrig fått blomma — förrän på din hals.",
    tags: ["emalj", "blomma", "färg"],
  },

  /* ---------------------------- ARMBAND ----------------------------- */
  {
    handle: "armband-parla-elastisk",
    title: "Pärlarmband 'Stretch'",
    category: "armband",
    price: 79,
    compareAt: 159,
    stock: 9,
    hue: 28,
    daysAgo: 2,
    description: "Elastiskt pärlarmband som passar de flesta handleder.",
    vintageStory:
      "Enkelt och älskbart. Elastiska pärlarmband ur deadstock — aldrig burna, alltid redo.",
    tags: ["pärla", "vardag"],
  },
  {
    handle: "armband-guldlank-chunky",
    title: "Länkarmband 'Chunky'",
    category: "armband",
    price: 110,
    compareAt: 259,
    stock: 3,
    hue: 46,
    daysAgo: 4,
    description: "Grovt länkarmband i guldton. Ett statement helt själv.",
    vintageStory:
      "Tungt i uttryck, lätt i vikt. Ett länkarmband ur konkurslagret som aldrig hann bli någons signatur.",
    tags: ["länk", "guld", "statement"],
    metals: ["Guld", "Silver"],
  },
  {
    handle: "armband-berlock-charm",
    title: "Berlockarmband 'Charm'",
    category: "armband",
    price: 105,
    compareAt: 239,
    stock: 4,
    hue: 320,
    daysAgo: 6,
    description:
      "Armband med små berlocker: hjärta, nyckel och stjärna. Fyll på med minnen.",
    vintageStory:
      "Ett armband som vill samla på minnen. Deadstock med berlocker som aldrig fått en historia — börja din.",
    tags: ["berlock", "charm"],
  },
  {
    handle: "armband-tunn-bangle",
    title: "Tunn bangle 'Enkel'",
    category: "armband",
    price: 72,
    stock: 14,
    hue: 52,
    daysAgo: 1,
    description: "Slät, tunn bangle att stapla flera av. Enkelheten själv.",
    vintageStory:
      "Byggstenen i varje stack. Tunna banglar ur ett tömt lager — oanvända och oändligt kombinerbara.",
    tags: ["bangle", "stapla"],
    metals: ["Guld", "Silver"],
  },
  {
    handle: "armband-emalj-rand",
    title: "Emaljarmband 'Randigt'",
    category: "armband",
    price: 88,
    compareAt: 189,
    stock: 5,
    hue: 8,
    daysAgo: 8,
    description: "Randig emalj i glada kulörer. Sommar året runt.",
    vintageStory:
      "Solsken på burk. Randiga emaljarmband ur konkurslagret — aldrig burna, alltid glada.",
    tags: ["emalj", "färg", "sommar"],
  },
  {
    handle: "armband-kristall-tennis",
    title: "Kristallarmband 'Tennis'",
    category: "armband",
    price: 129,
    compareAt: 319,
    stock: 2,
    hue: 205,
    daysAgo: 10,
    description:
      "Rad av glittrande kristaller hela vägen runt. Diskret lyx-känsla.",
    vintageStory:
      "Glitter ur ett konkursbo. Ett tennisarmband som aldrig fått blänka på en handled — dags att ändra på det.",
    tags: ["kristall", "glitter", "fest"],
  },
  {
    handle: "armband-flatat-lader",
    title: "Läderarmband 'Flätat'",
    category: "armband",
    price: 69,
    compareAt: 149,
    stock: 11,
    hue: 18,
    daysAgo: 3,
    description: "Flätat läder med liten gulddetalj. Ledig och lite tuff.",
    vintageStory:
      "Råare i tonen. Flätade läderarmband ur deadstock — oanvända, redo för vardagsslitage.",
    tags: ["läder", "ledig"],
  },
  {
    handle: "armband-parla-dubbel",
    title: "Pärlarmband 'Dubbelt'",
    category: "armband",
    price: 94,
    compareAt: 199,
    stock: 6,
    hue: 32,
    daysAgo: 12,
    description: "Två rader pärlor för lite extra. Klassiskt med volym.",
    vintageStory:
      "Dubbelt upp ur lagret. Pärlarmband i två rader som aldrig fått pryda en arm — förrän din.",
    tags: ["pärla", "klassiker"],
  },

  /* ----------------------------- ÖVRIGT ----------------------------- */
  {
    handle: "ovrigt-fotlank-parla",
    title: "Fotlänk 'Sommarpärla'",
    category: "ovrigt",
    price: 75,
    compareAt: 159,
    stock: 7,
    hue: 175,
    daysAgo: 2,
    description: "Fin fotlänk med små pärlor. Sandaler och sommar väntar.",
    vintageStory:
      "Semesterkänsla ur deadstock. Fotlänkar som aldrig fått känna varm asfalt — nu är det dags.",
    tags: ["fotlänk", "sommar"],
  },
  {
    handle: "ovrigt-fotlank-kedja",
    title: "Fotlänk 'Guldkedja'",
    category: "ovrigt",
    price: 82,
    compareAt: 169,
    stock: 5,
    hue: 47,
    daysAgo: 5,
    description: "Tunn guldkedja för foten. Diskret glitter vid varje steg.",
    vintageStory:
      "Ett litet lyft för fotleden. Guldfotlänkar ur konkurslagret — oanvända och sommarredo.",
    tags: ["fotlänk", "guld"],
    metals: ["Guld", "Silver"],
  },
  {
    handle: "ovrigt-brosch-blomma",
    title: "Brosch 'Blomsteräng'",
    category: "ovrigt",
    price: 98,
    compareAt: 229,
    stock: 3,
    hue: 300,
    daysAgo: 7,
    description: "Emaljbrosch i form av en blomma. Sätt på kavajen och lys upp.",
    vintageStory:
      "En riktig vintage-skatt. Broscher ur ett tömt lager som aldrig fått pryda en rockslag.",
    tags: ["brosch", "emalj", "retro"],
  },
  {
    handle: "ovrigt-ring-signet",
    title: "Ring 'Signet'",
    category: "ovrigt",
    price: 90,
    compareAt: 199,
    stock: 8,
    hue: 44,
    daysAgo: 3,
    description: "Slät signetring med matt yta. Cool ensam eller i sällskap.",
    vintageStory:
      "Tidlös form ur deadstock. Signetringar som aldrig fått ett finger att sitta på — än.",
    tags: ["ring", "minimal"],
    metals: ["Guld", "Silver"],
  },
  {
    handle: "ovrigt-ring-parla",
    title: "Ring 'Pärla'",
    category: "ovrigt",
    price: 85,
    compareAt: 179,
    stock: 4,
    hue: 26,
    daysAgo: 9,
    description: "Enkel ring med en enda pärla. Söt och lätt att bära.",
    vintageStory:
      "En pärla för fingret. Ringar ur konkurslagret som legat orörda i sina askar.",
    tags: ["ring", "pärla"],
  },
  {
    handle: "ovrigt-harspanne-parla",
    title: "Hårspänne 'Pärlrad'",
    category: "ovrigt",
    price: 68,
    compareAt: 139,
    stock: 10,
    hue: 22,
    daysAgo: 4,
    description: "Hårspänne dekorerat med pärlor. Snabb uppgradering av frisyren.",
    vintageStory:
      "Detaljen håret väntat på. Pärlspännen ur deadstock — aldrig använda, alltid redo för en dålig hårdag.",
    tags: ["hår", "pärla"],
  },
  {
    handle: "ovrigt-brosch-fjaril",
    title: "Brosch 'Fjäril'",
    category: "ovrigt",
    price: 95,
    compareAt: 209,
    stock: 2,
    hue: 210,
    daysAgo: 11,
    description: "Glittrig fjärilsbrosch. Y2K-nostalgi i högsta grad.",
    vintageStory:
      "Rakt ur tidskapseln. Fjärilsbroscher ur ett konkursbo som aldrig fått flyga — dags att släppa loss dem.",
    tags: ["brosch", "y2k", "glitter"],
  },
  {
    handle: "ovrigt-smyckesask-mini",
    title: "Nyckelring 'Charm'",
    category: "ovrigt",
    price: 65,
    compareAt: 129,
    stock: 9,
    hue: 320,
    daysAgo: 6,
    description:
      "Nyckelring med små berlocker. Lite smycke även på nyckelknippan.",
    vintageStory:
      "Smycke för nycklarna. Berlock-nyckelringar ur deadstock — oanvända och redo att skramla.",
    tags: ["nyckelring", "charm"],
  },
  {
    handle: "ovrigt-slojd-solglasogonkedja",
    title: "Glasögonkedja 'Pärla'",
    category: "ovrigt",
    price: 78,
    compareAt: 169,
    stock: 6,
    hue: 200,
    daysAgo: 8,
    description:
      "Pärlkedja för solglasögonen. Praktiskt och snyggt på samma gång.",
    vintageStory:
      "Sommarens smartaste accessoar ur ett tömt lager. Glasögonkedjor som aldrig fått hänga runt en hals.",
    tags: ["kedja", "sommar", "praktisk"],
  },
];

export const MOCK_PRODUCTS: Product[] = SEEDS.map(buildProduct);
