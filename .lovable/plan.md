# LumaVita v2 — Više stranica + Admin panel

Cilj: razbiti sajt na više stranica (jedna po kategoriji) i dati vam admin nalog da menjate slike, opise i kontakt podatke bez mene.

## 1) Struktura stranica (nove rute)

Umesto jedne duge stranice, sajt se deli na:

- `/` — početna: hero, kratke arch kartice po kategoriji sa dugmetom "Pogledaj više" koje vodi na posebnu stranicu, sekcije "Kako radimo", Galerija (preview), Recenzije, Kontakt kratko, Footer
- `/vencanja` — samo venčanja: hero, sve dekoracije (Dekoracija 1, 2, ...) sa slikom i opisom
- `/rodjendani`
- `/krstenja`
- `/gender-reveal`
- `/punoletstva`
- `/poslovni-dogadjaji`
- `/galerija` — sve slike
- `/kontakt` — puni kontakt + mapa + forma
- `/auth` — login za admina (skriveno, bez linka u navigaciji)
- `/admin` — admin panel (samo za ulogovanog admina)

Nav u header-u vodi na ove rute umesto na `#anchor`. Klik na "Pogledaj više" na početnoj vodi npr. na `/vencanja`.

## 2) Admin panel (`/admin`)

Ulogovani admin može:

- **Kategorije & dekoracije** — za svaku od 6 kategorija: dodati/urediti/obrisati stavku (naslov "Dekoracija 1", opis, slika). Redosled se menja prevlačenjem broja (ili dugmićima gore/dole).
- **Galerija** — dodati/obrisati slike.
- **Kontakt podaci** — telefon, email, Instagram, adresa, Google Maps embed link.
- **Tekstovi na početnoj** — hero naslov/podnaslov, "O nama" tekst, CTA tekst.
- **Recenzije** — dodati/urediti/obrisati recenziju (ime, tekst).

Sve promene su odmah vidljive na sajtu (bez rebuild-a).

## 3) Šta uključujem u backend (Lovable Cloud)

- **Auth** — email + password login (samo za vas kao admina; javna registracija ISKLJUČENA). Vaš nalog kreiram ručno u bazi.
- **Role sistem** — tabela `user_roles` sa rolom `admin`. Samo admin vidi `/admin`.
- **Storage bucket** `site-images` (javan) — za sve slike koje uploadujete kroz admin.
- **Tabele:**
  - `categories` (slug, naziv, opis, hero_image, sortiranje)
  - `decorations` (category_slug, broj, naslov, opis, image_url, sortiranje)
  - `gallery_items` (image_url, sortiranje)
  - `testimonials` (ime, tekst, sortiranje)
  - `site_settings` (key/value: kontakt podaci, hero tekstovi, itd.)
- Sve javne tabele — anon SELECT (svako vidi sajt), admin SVE (insert/update/delete kroz RLS).

## 4) Migracija postojećih slika

Slike koje sam već generisao ostaju kao **početni seed** u tabelama — sajt neće biti prazan dok ne uploadujete svoje. Vi ih zamenjujete kroz admin jednu po jednu.

## 5) Šta radim ovaj put

1. Uključujem Lovable Cloud (backend).
2. Kreiram tabele + storage bucket + RLS + seed postojećih slika/tekstova.
3. Napravim `/auth` login stranicu i `_authenticated/admin` panel sa CRUD-om za sve gorenavedeno.
4. Prepravim javni sajt: nav vodi na rute, "Pogledaj više" isto, svaka kategorija je posebna stranica, sve čita iz baze.
5. Kažem vam vaše admin kredencijale nakon kreiranja.

## Šta mi treba od vas pre nego što krenem

- **Email za admin nalog** (na koji ćete se logovati u `/admin`). Lozinku generišem i pošaljem, promenićete je posle.

Napišite mi email i krećem.
