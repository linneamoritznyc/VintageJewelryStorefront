# Överlämningsguide, Fyndlådan

Den här guiden är skriven för dig som **äger** butiken men **inte är utvecklare**.
Den förklarar hur sajten hänger ihop, vad du kan ändra själv, vad som kräver en
utvecklare, och exakt hur du tar sajten live och tar över den.

> **Kort version:** Shopify är motorn (produkter, lager, priser, betalning,
> ordrar). Den här koden är den snygga skyltfönster-delen framför Shopify. Allt
> som handlar om *att sälja* sköter du i Shopify utan kod. Allt som handlar om
> *hur sajten är byggd* kräver en utvecklare.

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

| Val | Vad vi använder | Varför |
| --- | --- | --- |
| Ramverk | **Next.js** (React) | Vanligast i världen → lätt och billigt att hitta utvecklare senare |
| Hosting | **Vercel** | Kopplas till koden och publicerar automatiskt vid varje ändring |
| Backend | **Shopify** (Storefront API) | Du sköter butiken i ett gränssnitt du redan kan |
| Innehåll | **Shopify metaobjects** | Du redigerar texter/kampanjer själv, utan utvecklare |
| Språk/stil | Svenska, mobilanpassat | Byggt för din målgrupp |

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

---

## 5. Gå live, checklista (för utvecklare)

Sajten kör idag på **låtsasdata** så att den fungerar utan Shopify-konto. För
att koppla på den riktiga butiken:

1. **Skapa Shopify-butiken** och lägg till försäljningskanalen **Headless**
   (eller Hydrogen). Generera en **Storefront API-token**.
2. **Lägg in nycklarna** i miljövariabler (se `.env.example`):
   `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_API_TOKEN`,
   `SHOPIFY_STOREFRONT_API_VERSION`.
3. **Byt datalagret:** implementera det riktiga API:t i
   `lib/shopify/storefront-client.ts` och peka om exporten i
   `lib/shopify/index.ts`. Komponenterna behöver inte röras. Hela checklistan
   finns som kommentar högst upp i `lib/shopify/index.ts`.
4. **Lägg upp produkterna** i Shopify (kategorierna heter `orhangen`,
   `halsband`, `armband`, `ovrigt`). Lägg den korta vintage-berättelsen i ett
   **metafält** (`story.body`).
5. **Skapa metaobjects för innehåll** (banner, kampanjdatum, paketpris,
   startsidetexter) enligt fältlistan i kommentaren i `lib/content/index.ts`,
   och koppla `getSiteContent()` till dem. Nu redigerar ägaren innehållet själv.
6. **Koppla kassan:** returnera Shopifys riktiga `checkoutUrl` i
   `lib/checkout/index.ts` (allt annat är redan förberett).
7. **Publicera:** koppla GitHub-repot till **Vercel**, lägg in miljövariablerna
   där, och peka din **domän** dit.

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
> *vanliga Shopify-teman* och fungerar **inte automatiskt** på en headless-sajt
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

*Teknisk fördjupning och kodstruktur finns i `README.md`.*
