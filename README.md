# Nauka prawa jazdy (kat. B) — faza 1

Lokalna aplikacja PWA (TypeScript, Vite, React). Oficjalny katalog Excel pobierasz z [gov.pl](https://www.gov.pl/web/infrastruktura/prawo-jazdy) w przeglądarce; pytania i postęp zostają na urządzeniu (IndexedDB). Repozytorium **nie** zawiera treści pytań ani multimediów z katalogu.

## Uruchomienie

```bash
npm install
npm run dev
```

Otwórz adres z terminala (domyślnie `http://localhost:5173`).

## Weryfikacja

```bash
npm run typecheck
npm test
npm run build
```

## Zakres fazy 1

- Kategoria **B** (pozostałe kody widoczne, zablokowane)
- Import katalogu (`katalog` z oficjalnego xlsx; bez arkusza weryfikacji)
- Ćwiczenia: jedno pytanie, filtry, natychmiastowy wynik, lista błędów
- JPEG z pamięci urządzenia; WMV / brak pliku — komunikat, bez zaliczania „na ślepo”
- Egzamin próbny — **poza** tym slice’em

## Cloud Agent toolchain

Zobacz sekcję w poprzedniej wersji README dotyczącą `./scripts/cloud-agent-install.sh` i `./scripts/cloud-agent-start.sh`.
