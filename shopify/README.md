# Shopify-import — mock-katalogen som produkt-CSV

> ⚠️ **Förlegad sedan butiken gick live.** Den riktiga butiken
> (`vintagejewelrystorefront.myshopify.com`) har redan sin egen, riktiga
> katalog. Importera **inte** den här filen dit — den skulle skapa
> dubbletter av låtsasprodukter bredvid de riktiga. Den här CSV:n är kvar
> bara som referens för att snabbt fylla en **separat test-/dev-butik**.

`fyndladan-products.csv` är hela mock-katalogen (34 produkter, ≥8 per
kategori) i **Shopifys egna importformat**. Använd den för att fylla en
(dev-)butik med exakt samma katalog som sajten byggdes mot, så att du kan testa
mot det riktiga Storefront API:t.

## Så importerar du

1. Shopify admin → **Produkter** → **Importera** → välj CSV-filen.
2. Produkterna skapas med titel, beskrivning, taggar, pris, **ursprungspris**
   (jämförpris), lagerantal, varianter (Guld/Silver där det finns) och den korta
   vintage-berättelsen (i produktens brödtext).
3. Kategorierna styrs av taggarna `orhangen`, `halsband`, `armband`, `ovrigt` —
   skapa fyra **samlingar (collections)** med de handtagen (eller automatiska
   samlingar baserade på taggen).

## ⚠️ Om bilder (viktigt)

Kolumnen **Image Src är avsiktligt tom.** Anledningen: sajtens utvecklingsbilder
är vektorillustrationer som ritas i koden (`components/ui/jewelryArt`) — de finns
inte som färdiga bildfiler med en webbadress, och Shopify-import kräver en
**riktig bild-URL**.

Du har två vägar:

- **Rekommenderat:** ladda upp dina **riktiga produktfoton** i Shopify (per
  produkt, efter importen). Det är ändå det du vill ha i en skarp butik.
- **Snabbtest:** vill du bara ha _någon_ bild i dev-butiken kan du fylla i
  `Image Src` med publika platshållar-URL:er innan import.

När butiken är live hämtar sajten automatiskt dina riktiga Shopify-bilder — då
används inte illustrationerna längre.

## Vintage-berättelsen → metafält

I den här CSV:n ligger vintage-berättelsen i produktens **brödtext** så att den
garanterat importeras. På sikt bör den ligga i ett **metafält**
(`custom.vintage_story`), vilket är vad sajten faktiskt läser i skarpt läge
(se mappningen i `lib/shopify/live/client.ts`). Efter importen kan du flytta
texten till metafältet, eller fylla metafältet direkt.

## Regenerera CSV:n

Filen genereras från samma mock-data som sajten (en sanning). Kör:

```bash
npm run generate:csv
```

(scriptet: `scripts/generate-shopify-csv.ts`)
