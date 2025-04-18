# PreludaStvar

Online prodavnica postera inspirisanih muzikom. Sajt koristi Next.js i moderan tech stack za kreiranje e-commerce iskustva.

## Koncept

PreludaStvar predstavlja jedinstvene postere inspirisane stihovima pesama. Svaki poster je umetnički rad koji prenosi emociju i priču iza pesme, stvarajući most između muzike i vizuelne umetnosti.

## Tehnologije

- **Next.js 15+** - App Router, Server i Client komponente
- **TypeScript** - Za tip-safe development
- **React 18+** - Za moderne UI komponente
- **Tailwind CSS** - Za stilizovanje i responzivan dizajn
- **Shadcn UI** - Za komponente interfejsa
- **Framer Motion** - Za animacije
- **Biome** - Za linting i formatiranje koda
- **Context API** - Za state management (korpa, localizacija)

## Funkcionalnosti

- Responzivan dizajn za sve veličine ekrana
- Višejezička podrška (srpski i engleski)
- Dinamičko rutiranje proizvoda 
- Korpa za kupovinu
- Proces naručivanja
- Animirani UI elementi
- Tematski dizajn

## Pokretanje projekta

### Preduslovi

- Node.js 18+ (preporučeno 20+)
- npm ili bun

### Razvoj

```bash
# Instalacija zavisnosti
npm install

# Pokretanje dev servera
npm run dev

# Za brže pokretanje bez turbopack-a
npm run fastdev
```

Aplikacija će biti dostupna na `http://localhost:3000`

### Build

```bash
# Produkcijski build
npm run build

# Pokretanje produkcijske verzije
npm run start
```

## Struktura projekta

- `src/app/*` - App Router struktura (pages, layout)
- `src/components/*` - Komponente za višestruku upotrebu  
- `src/contexts/*` - React konteksti za state management
- `src/data/*` - Data sources i modeli
- `src/lib/*` - Utility funkcije i helpers
- `src/locales/*` - Višejezički prevodi

## Budući razvoj

Planirane funkcionalnosti:

1. Dodavanje pretrage proizvoda
2. Integracija sa sistemima za plaćanje
3. Admin panel za upravljanje proizvodima
4. Optimizacija slika i performance
5. Skladištenje podataka u bazi umesto hardcode-a
