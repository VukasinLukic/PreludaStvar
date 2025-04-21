# PreludaStvar: Preostali Zadaci (Ažurirano 2024-07-28)

## 1. Preostali Problemi i Nedostaci

*   **Administratorska Funkcionalnost:**
    *   **Nedoslednost Ruta:** Neke komponente koriste `/admin` rute dok druge koriste `/bojanicnikola`. Potrebno je standardizovati strukturu administratorskih ruta.
    *   **Nedoslednost Tipova Porudžbina:** Tip `Order` u `src/types/order.ts` se razlikuje od strukture koja se koristi u `components/admin/OrderList.tsx`. Potrebno je konsolidovati ove definicije.
    *   **Kontrola Pristupa Administratora:** Potrebna je robusna verifikacija da samo autentifikovani administratori mogu pristupiti administratorskim rutama i izvršavati akcije (treba implementirati na strani servera ili putem Firestore pravila).
*   **Plaćanje i Porudžbine:**
    *   **Obrada Porudžbina:** Funkcija `handleSubmitOrder` u `/cart/page.tsx` je nedovršena. Ne postoji logika za čuvanje detalja porudžbine u Firestore ili pokretanje plaćanja/potvrde.
    *   **Slanje Email-ova:** Ruta `/api/send-order-email` postoji, ali možda nije u potpunosti integrisana sa procesom plaćanja.
*   **Podaci i Sadržaj:**
    *   **`src/data/products.ts`:** Ovaj fajl i dalje postoji i importuje se u `ProductClient.tsx`, uprkos preuzimanju podataka iz Firestore-a. Ovo je suvišno i potencijalno zbunjujuće.
    *   **Hardkodirane Vrednosti:** Neke komponente možda i dalje imaju hardkodiran tekst ili rezervne vrednosti koje bi idealno trebalo da dolaze iz Firestore konfiguracije ili lokalizacije.
*   **Kvalitet Koda i Poboljšanja:**
    *   **`tracker.ts`:** Prilagođeni fetch/XHR proksi je kompleksan. Proceniti da li je i dalje neophodan ili se CORS problemi mogu rešiti drugačije.
    *   **Suvišna Logika Rutiranja:** `productRoutes.ts` i `useProductRouter.ts` možda imaju preklapajuće odgovornosti. Pojednostaviti ako je moguće.
    *   **Upravljanje Resursima (Assets):** Iako je hostovanje slika verovatno na Supabase, osigurati da nema velikih/neiskorišćenih lokalnih resursa u `public/` ili drugim folderima. Verifikovati optimizaciju.
    *   **Stranica `collections/prints`:** I dalje sadrži primer/placeholder kod i strukturu. Potrebna je integracija sa Firestore podacima ili uklanjanje.
    *   **Obrada Grešaka (Frontend):** Poboljšati korisničke povratne informacije o greškama prilikom preuzimanja podataka ili slanja formi.

## 2. Detaljni Plan Akcije (Preostali Zadaci)

**Faza 2: Poboljšanja i Ključne Funkcionalnosti**

7.  **Standardizuj Administratorske Rute:** Odabrati `/admin` ili `/bojanicnikola` kao standardni prefiks rute za administratorske stranice i ažurirati sve povezane komponente i rute.
8.  **Konsoliduj Tipove Porudžbina:** Osigurati da su tip `Order` u `src/types/order.ts` i struktura korišćena u `components/admin/OrderList.tsx` konzistentni.
9.  **Refaktoriši Izvore Podataka:** Potpuno ukloniti korišćenje `src/data/products.ts` za podatke o proizvodima. Ažurirati sve relevantne komponente (`ProductClient.tsx`, sekcije na početnoj stranici) da se oslanjaju isključivo na Firestore.
10. **Logika Plaćanja:** Implementirati funkciju `handleSubmitOrder` u `/cart/page.tsx` da:
    *   Prikuplja informacije o isporuci.
    *   Kreira `order` dokument u Firestore-u sa stavkama, ukupnim iznosom i detaljima isporuke.
    *   Očisti korpu nakon uspešnog kreiranja porudžbine.
    *   Preusmeri na stranicu za potvrdu/uspeh.
11. **Završi Integraciju Email-a za Porudžbine:**
    *   Verifikovati da je API ruta `/api/send-order-email` ispravno implementirana.
    *   Osigurati da se poziva nakon uspešnog kreiranja porudžbine u Firestore-u.
12. **Pregledaj/Refaktoriši `tracker.ts`:** Utvrditi da li je proksi neophodan. Ako nije, ukloniti ga. Ako jeste, pojednostaviti ga i temeljno dokumentovati.
13. **Refaktoriši Stranicu `collections/prints`:** Povezati je sa Firestore podacima ili je ukloniti ako je suvišna u odnosu na `/posteri`.

**Faza 3: Poliranje i Čišćenje**

14. **Kreiraj npm Skripte:** Dodati odgovarajuće npm skripte u `package.json` za razvoj i deployment.
15. **Konsoliduj Logiku Rutiranja:** Pregledati `productRoutes.ts` i `useProductRouter.ts` radi pojednostavljenja.
16. **Poboljšaj Obradu Grešaka:** Dodati korisnički prijateljske poruke o greškama i povratne informacije (toasts) širom aplikacije, posebno u formama i pri preuzimanju podataka.
17. **Čišćenje Resursa (Assets):** Osigurati da nema neiskorišćenih ili neoptimizovanih slika lokalno.
18. **Ažuriraj `README.md` i Dokumentaciju:** Odražavati trenutnu arhitekturu i uputstva za podešavanje.
19. **Finalno Lintovanje/Formatiranje:** Pokrenuti `bunx biome lint --write` i `bunx biome format --write`.
20. **Optimizacija Performansi:** Pokrenuti Lighthouse testove i rešiti sve kritične probleme sa performansama.
