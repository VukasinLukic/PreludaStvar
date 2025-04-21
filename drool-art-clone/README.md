# PreludaStvar - Prodavnica postera inspirisanih muzikom

Ovaj projekat je e-commerce aplikacija za prodaju umetničkih postera inspirisanih tekstovima pesama. 
Projekat je izgrađen korišćenjem modernih tehnologija i implementira funkcionalnosti kao što su:
pregled proizvoda, dinamičke stranice proizvoda preuzete iz Firestore baze, podršku za više jezika (srpski/engleski), 
korpu za kupovinu i administratorski panel za upravljanje sadržajem.

## Tehnologije

- **Frontend**: Next.js 15+ (App Router), React 18+, TypeScript, Tailwind CSS
- **Komponente**: Shadcn UI komponente, Framer Motion
- **Upravljanje stanjem**: Context API (Cart, Language)
- **Backend**: Firebase (Firestore, Auth, Functions), Supabase (Storage)
- **Email**: Resend API
- **Alati**: Biome (linting/formatiranje)

## Struktura projekta

```
drool-art-clone/
│
├── src/
│   ├── app/                      # Next.js aplikacija (App Router)
│   │   ├── api/                  # API rute
│   │   ├── bojanicnikola/        # Admin panel
│   │   ├── cart/                 # Stranica korpe
│   │   ├── collections/          # Kolekcije proizvoda
│   │   ├── kontakt/              # Kontakt stranica
│   │   ├── o-nama/               # O nama stranica
│   │   ├── products/             # Stranice proizvoda
│   │   ├── posteri/              # Sve vrste postera
│   │   ├── globals.css           # Globalni CSS
│   │   ├── page.tsx              # Početna stranica
│   │   └── layout.tsx            # Glavni layout
│   │
│   ├── components/               # Komponente
│   │   ├── admin/                # Admin komponente
│   │   ├── cart/                 # Komponente za korpu
│   │   ├── layout/               # Layout komponente
│   │   ├── navigation/           # Navigacione komponente
│   │   ├── products/             # Komponente za proizvode
│   │   └── ui/                   # UI komponente
│   │
│   ├── contexts/                 # React konteksti
│   │   ├── CartContext.tsx       # Kontekst za korpu
│   │   └── LanguageContext.tsx   # Kontekst za jezik
│   │
│   ├── lib/                      # Biblioteke i utility funkcije
│   │   ├── firebaseAdmin.ts      # Firebase Admin SDK konfiguracija
│   │   ├── firebaseClient.ts     # Firebase Client SDK konfiguracija
│   │   ├── firebaseFunctions.ts  # Funkcije za pristup Firebase Functions-u
│   │   ├── productRoutes.ts      # Rutiranje proizvoda
│   │   ├── supabaseClient.ts     # Supabase konfiguracija
│   │   └── utils.ts              # Druge utility funkcije
│   │
│   └── types/                    # TypeScript definicije tipova
│       └── product.ts            # Tipovi za proizvode
│
├── functions/                    # Firebase Functions
│   └── src/                      # Source kod
│       └── index.ts              # Definicije funkcija
│
├── public/                       # Statički resursi
│   └── assets/                   # Slike, ikonice, itd.
│
├── scripts/                      # Skripte za migraciju/upload podataka
│
├── .env.local                    # Lokalne environment varijable
├── next.config.js                # Next.js konfiguracija
├── package.json                  # NPM dependencies
└── tailwind.config.ts           # Tailwind CSS konfiguracija
```

## Funkcionalnosti

- **Pregled proizvoda**: Uređeni prikaz sa opcijama filtriranja i sortiranja
- **Dinamičke stranice proizvoda**: Individualne stranice za svaki poster
- **Višejezičnost**: Podrška za srpski i engleski jezik
- **Korpa**: Dodavanje u korpu, ažuriranje količine, brisanje, checkout
- **Admin panel**: Upravljanje proizvodima (CRUD operacije)
- **Email potvrde**: Slanje email potvrda nakon narudžbine

## Pokretanje projekta lokalno

### Preduslov

- Node.js 18+ i npm (ili yarn/pnpm/bun)
- Firebase nalog i projekat
- Supabase nalog i bucket
- Resend API ključ za slanje email-ova

### Koraci

1. Klonirajte repozitorijum:
   ```bash
   git clone <url-repozitorijuma>
   cd drool-art-clone
   ```

2. Instalirajte zavisnosti:
   ```bash
   npm install
   # ili yarn install, pnpm install, bun install
   ```

3. Podesite .env.local fajl sa odgovarajućim kredencijalima:
   ```
   # Firebase
   FIREBASE_API_KEY=xxx
   FIREBASE_AUTH_DOMAIN=xxx
   FIREBASE_PROJECT_ID=xxx
   FIREBASE_STORAGE_BUCKET=xxx
   FIREBASE_MESSAGING_SENDER_ID=xxx
   FIREBASE_APP_ID=xxx
   
   # Firebase Admin
   FIREBASE_ADMIN_PROJECT_ID=xxx
   FIREBASE_ADMIN_CLIENT_EMAIL=xxx
   FIREBASE_ADMIN_PRIVATE_KEY=xxx
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=xxx
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
   
   # Resend
   RESEND_API_KEY=xxx
   
   # Firebase Functions
   NEXT_PUBLIC_FUNCTIONS_BASE_URL=xxx
   ```

4. Pokrenite razvojni server:
   ```bash
   npm run dev
   # ili yarn dev, pnpm dev, bun dev
   ```

5. Otvorite [http://localhost:3000](http://localhost:3000) u vašem browser-u

## Dodatne informacije

Za više informacija o tehnologijama korišćenim u ovom projektu, pogledajte:

- [Next.js dokumentacija](https://nextjs.org/docs)
- [Firebase dokumentacija](https://firebase.google.com/docs)
- [Tailwind CSS dokumentacija](https://tailwindcss.com/docs)
- [Supabase dokumentacija](https://supabase.io/docs)
- [Resend dokumentacija](https://resend.com/docs)

## Licenca

Ovaj projekat je pod [MIT licencom](LICENSE).
