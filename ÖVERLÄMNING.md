# Överlämningsguide, Fyndlådan

Den här guiden är skriven för dig som **äger** butiken men **inte är utvecklare**.
Den förklarar hur sajten hänger ihop, vad du kan ändra själv, vad som kräver en
utvecklare, och exakt hur du tar sajten live och tar över den.

> **Kort version:** Shopify är motorn (produkter, lager, priser, betalning,
> ordrar). Den här koden är den snygga skyltfönster-delen framför Shopify. Allt
> som handlar om _att sälja_ sköter du i Shopify utan kod. Allt som handlar om
> _hur sajten är byggd_ kräver en utvecklare.

---

## 1. Hur allt hänger ihop

```
   DU (i Shopify admin)                Sajten (koden)                Kund
   ─────────────────────               ───────────────               ──────
   Produkter, bilder, priser  ──►
   Lager, varianter                    Next.js-frontend      ──►     Snyggt
   Rabattkoder                 ──►   (hämtar allt från       ──►     skyltfönster
   Innehåll (metaobjects)      ──►    Shopify via API)       ──►     på mobilen
   Ordrar, kunder              ◄──                           ◄──     Köp
   Betalning, frakt, moms      ◄────────  Shopifys kassa  ◄──────    Betalar
```

- **Shopify** äger: produkter, lager, priser, varianter, kategorier, **rabattkoder**,
  ordrar, kunder, frakt, moms och **hela kassan/betalningen**.
- **Koden (den här sajten)** äger: utseendet, upplägget och de specialbyggda
  funktionerna (skattjakts-känslan, paketbyggaren, nedräkningen, popup:en).
- Kunden möter sajten, men när de trycker "till kassan" tar **Shopifys egen
  säkra kassa** över. Pengar och känsliga uppgifter rör alltså aldrig vår kod.

---

## 2. Teknikval, och varför

| Val        | Vad vi använder              | Varför                                                             |
| ---------- | ---------------------------- | ------------------------------------------------------------------ |
| Ramverk    | **Next.js** (React)          | Vanligast i världen → lätt och billigt att hitta utvecklare senare |
| Hosting    | **Vercel**                   | Kopplas till koden och publicerar automatiskt vid varje ändring    |
| Backend    | **Shopify** (Storefront API) | Du sköter butiken i ett gränssnitt du redan kan                    |
| Innehåll   | **Shopify metaobjects**      | Du redigerar texter/kampanjer själv, utan utvecklare               |
| Språk/stil | Svenska, mobilanpassat       | Byggt för din målgrupp                                             |
| Språk      | Svenska (standard) + Engelska (`/en/...`) | Öppnar upp för internationella kunder                 |

Det finns ett alternativ som heter **Hydrogen + Oxygen** (Shopifys eget ramverk
och hosting). Fördelen är "allt under ett tak, en faktura". Vi valde Next.js +
Vercel för att det är **lättare och billigare att hitta hjälp** när du behöver
det, men bytet är möjligt senare om du vill.

---

## 3. Vad DU gör själv vs vad en UTVECKLARE gör

### ✅ Du gör själv, i Shopify admin, utan kod

- Lägga till / ta bort / ändra **produkter, bilder, beskrivningar**
- Sätta och ändra **priser** och **ursprungspris** (det överstrukna priset)
- Justera **lager** och **varianter** (t.ex. Guld/Silver)
- Skapa och ändra **rabattkoder** (Rabatter i Shopify)
- Se och hantera **ordrar och kunder**
- Ställa in **frakt, moms och betalsätt**
- När metaobjects är på plats (se steg 5): **banner-text, kampanjens slutdatum,
  paketpris och startsidans texter**

### 🛠️ En utvecklare behövs för

- Ny sidtyp, ny sektion, ändrad layout eller nya funktioner
- Designändringar (färger, typsnitt, struktur)
- Uppdateringar av koden och tekniska buggar
- Att koppla in vissa appar (se apparna nedan)

> Tips: du behöver **inte** en utvecklare på heltid. De flesta ägare har en
> frilansare eller byrå "på uppdrag" som gör kodändringar när det behövs.

---

## 4. Var innehållet du kan ändra bor (för din utvecklare)

Idag ligger det redigerbara innehållet i koden, förberett för att flyttas till
Shopify metaobjects. Tills dess ändras det här (kräver utvecklare + publicering):

- **Rabattkoder:** `lib/config/coupons.ts`
- **Banner, popup, kampanjens slutdatum:** `lib/config/promotions.ts`
- **Paketets storlek, pris och text:** `lib/config/bundle.ts`
- **Startsidans texter (hero + varumärkeshistoria):** `lib/content/mock.ts`

Allt detta läses genom **ett enda ställe**, `lib/content/index.ts`, som är
förberett för att i stället läsa från Shopify metaobjects. Efter steg 5 nedan
ändrar **du** allt detta själv i Shopify.

**Om den engelska sajten:** navigering, footer, knappar och sidtexter är
översatta och ligger i `messages/sv.json` / `messages/en.json` — en
utvecklare ändrar dem där. Produktnamn och kategorinamn är riktig
Shopify-data och översätts istället via Shopifys gratisapp **"Translate &
Adapt"**, utan kod.

---

## 5. Gå live, checklista (för utvecklare)

**Status: steg 1–4 och 7 är redan gjorda.** Sajten kör live mot den riktiga
butiken (`vintagejewelrystorefront.myshopify.com`) — miljövariablerna är satta
i Vercel och produkterna finns redan uppe. Kvar är steg 5 och 6.

1. ✅ **Shopify-butiken** finns, med en anpassad app (Storefront API-integration)
   som genererat en **Storefront API-token**.
2. ✅ **Nycklarna** är satta som miljövariabler i Vercel: `SHOPIFY_STORE_DOMAIN`,
   `SHOPIFY_STOREFRONT_API_TOKEN`, `NEXT_PUBLIC_USE_MOCK=false`. Namnen måste
   matcha exakt (inget `NEXT_PUBLIC_`-prefix på de två Shopify-variablerna) —
   annars faller sajten tillbaka på låtsasdata i tysthet.
3. ✅ **Datalagret** är redan bytt: `lib/shopify/index.ts` väljer automatiskt
   den riktiga klienten (`lib/shopify/live/client.ts`) när steg 2 ovan är
   uppfyllt. Ingen ytterligare kod behövde skrivas eller pekas om.
4. ✅ **Produkterna** finns uppe i Shopify (kategorierna heter `orhangen`,
   `halsband`, `armband`, `ovrigt`). Vintage-berättelsen läses från
   metafältet **`custom.vintage_story`** (inte `story.body` som en äldre
   version av den här guiden sa).
5. ⬜ **Skapa metaobjects för innehåll** (banner, kampanjdatum, paketpris,
   startsidetexter) enligt fältlistan i kommentaren i `lib/content/index.ts`,
   och koppla `getSiteContent()` till dem. Tills detta är gjort styrs de
   texterna fortfarande i kod (`lib/config/*`, `lib/content/mock.ts`) —
   se punkt 4 nedan. Detta är den enda återstående punkten som krävs för att
   du ska kunna redigera kampanjtexter själv utan utvecklare.
6. ⬜ **Koppla kassan:** varukorgen skapar ännu ingen riktig Shopify-cart
   (`lib/cart/CartContext.tsx` anropar aldrig `store.createCart()`), så
   `lib/checkout/index.ts` visar fortfarande "kassan är inte klar än" istället
   för att skicka kunden vidare till Shopifys betalsida. Detta krävs innan
   sajten faktiskt kan ta betalt.
7. ✅ **Publicerad:** GitHub-repot är kopplat till Vercel och publicerar
   automatiskt vid varje ändring på `main`.

---

## 6. Överlämning, vad som ska föras över till dig

För att du ska äga allt behöver du få (och byta lösenord på):

- [ ] **Shopify** admin-konto (ägarroll)
- [ ] **GitHub**-repot (koden) överfört till ditt konto
- [ ] **Vercel**-konto (hosting), eller Oxygen om ni valde Hydrogen
- [ ] **Domänen** (där du köpte t.ex. `.se`-adressen)
- [ ] **E-post/marknadsföringsverktyg** (Shopify Email eller Klaviyo)
- [ ] Den här guiden + en kort inspelad genomgång (be utvecklaren om det)

---

## 7. Shopify-appar, vad du faktiskt behöver

- **Rabattkoder:** ingen app behövs, Shopifys inbyggda **Rabatter**.
- **Paket/bundles:** Shopifys egen gratisapp **"Shopify Bundles"** (eller en
  fast-pris-produkt). Paketbyggaren på sajten kopplas mot den.
- **E-postinsamling / popup:** **Shopify Forms + Shopify Email** (gratis) eller
  **Klaviyo** för mer avancerad marknadsföring.
- **Nedräkning / kampanjkänsla:** ingen app, det är en inbyggd funktion i sajten.

> ⚠️ **Viktigt om appar:** Väldigt många appar i Shopify App Store är byggda för
> _vanliga Shopify-teman_ och fungerar **inte automatiskt** på en headless-sajt
> som den här. Innan du köper en app: kolla att den stöder "headless" eller
> "Storefront API", annars kan det krävas extra utvecklarjobb. Fråga gärna din
> utvecklare först.

---

## 8. Ungefärliga löpande kostnader

- **Shopify-abonnemang:** månadsavgift (enligt Shopifys prisplan)
- **Vercel:** ofta gratis i början, liten månadsavgift vid mer trafik
- **Domän:** liten årsavgift
- **E-postverktyg:** gratis upp till en viss volym (Shopify Email / Klaviyo)
- **Utvecklare:** endast vid behov (per uppdrag), inte löpande

---

## 9. Om något strular

- **Produkter/priser/ordrar fel:** lös i **Shopify admin**, det är där datan bor.
- **Sajten nere eller ser trasig ut:** kontakta din utvecklare / kolla Vercel.
- **Rabattkod funkar inte:** kontrollera koden under **Rabatter** i Shopify.

Mer om hur den här (moln-)miljön är konfigurerad finns i Claude Codes
dokumentation: https://code.claude.com/docs/en/claude-code-on-the-web

---

_Teknisk fördjupning och kodstruktur finns i `README.md`._
