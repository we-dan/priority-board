# Priority Board

En minimal, Material Design 3-inspirerad prioriteringstavla för uppgiftshantering. Organisera ditt arbete i kolumnerna "Nu", "Nästa" och "Senare" med ett rent gränssnitt optimerat för långsiktig användning och låg kognitiv belastning.

## Funktioner

- **Tre-kolumn tavla**: Nu, Nästa, Senare för tydlig prioritering
- **Uppgiftshantering**: Lägg till, redigera, flytta och ta bort uppgifter med beskrivningar och tidsramar
- **Drag-and-drop**: Intuitiv omordning av uppgifter inom och mellan kolumner
- **Beständig lagring**: Uppgifter sparas i localStorage, överlever siduppdateringar
- **Temastöd**: Ljust och mörkt tema med mjuka övergångar
- **Responsiv design**: Fungerar sömlöst på desktop och mobila enheter
- **Tillgänglig**: WCAG 2.2-kompatibel med tangentbordsnavigering och skärmläsarstöd

## Teknisk Stack

### Kärna
- **React 19**: Senaste React med automatisk memoization via React Compiler
- **TypeScript 5.9**: Strikt typsäkerhet med moderna TS-funktioner
- **Vite 7.3**: Snabbt byggverktyg med HMR för snabb utveckling

### Styling
- **Tailwind CSS 4.1**: CSS-first konfiguration med moderna utilities
- **CSS Variables**: Semantiskt temasystem för ljusa/mörka lägen
- **Lucide React**: Konsekvent, minimal ikonuppsättning

### UI-komponenter
- **Radix UI**: Tillgängliga komponentprimitiver (@radix-ui/react-slot)
- **CVA**: Class Variance Authority för komponentvarianter
- **Tailwind Merge**: Intelligent klasssammanslagningsverktyg

## Projektstruktur

```
priority-board/
├── src/
│   ├── app.tsx                    # Rot-appkomponent
│   ├── main.tsx                   # Applikationens startpunkt
│   ├── types/
│   │   └── task.ts                # Typdefinitioner för uppgifter
│   ├── hooks/
│   │   └── use-local-storage.ts   # Hook för beständig lagring
│   ├── components/
│   │   ├── board.tsx              # Huvudtavla-container
│   │   ├── column.tsx             # Kolumnkomponent (Nu/Nästa/Senare)
│   │   ├── task-card.tsx          # Individuellt uppgiftskort
│   │   ├── add-task-form.tsx      # Formulär för att skapa uppgifter
│   │   ├── theme-toggle.tsx       # Ljus/mörk temaväxlare
│   │   ├── providers/
│   │   │   └── theme.tsx          # Tema context provider
│   │   └── ui/
│   │       ├── button.tsx         # Återanvändbar knappkomponent
│   │       └── card.tsx           # Återanvändbar kortkomponent
│   ├── lib/
│   │   └── utils.ts               # Hjälpfunktioner (cn helper)
│   └── styles/
│       └── global.css             # Globala stilar och CSS-variabler
├── package.json                    # Beroenden och skript
├── vite.config.ts                  # Vite-konfiguration
├── tsconfig.json                   # TypeScript-konfiguration
├── components.json                 # shadcn/ui-konfiguration
└── postcss.config.js               # PostCSS-konfiguration
```

## Kom Igång

### Förkunskaper
- **Node.js**: 18.x eller högre
- **npm**: 9.x eller högre (eller pnpm/yarn)

### Installation

```bash
# Klona repositoryt
git clone <repository-url>
cd priority-board

# Installera beroenden
npm install

# Starta utvecklingsserver
npm run dev
```

Appen kommer vara tillgänglig på `http://localhost:5173`

### Bygg för Produktion

```bash
# Typkontroll
npm run typecheck

# Bygg optimerat bundle
npm run build

# Förhandsgranska produktionsbygge
npm run preview
```

## Arkitektur

### State Management
- **Lokalt state**: Reacts `useState` för komponentspecifik data
- **Beständigt state**: Custom `useLocalStorage` hook synkar state med localStorage
- **Inget globalt state-bibliotek**: Prop drilling minimerat genom komponentkomposition

### Datamodell
```typescript
interface Task {
  id: string;           // Unik identifierare (crypto.randomUUID())
  title: string;        // Uppgiftstitel
  description: string;  // Uppgiftsdetaljer
  timeframe: string;    // Uppskattad färdigställningstid
  columnId: string;     // 'now' | 'next' | 'later'
}
```

### Komponenthierarki
```
App
└── ThemeProvider
    └── Board
        ├── ThemeToggle
        ├── Column (Nu)
        │   ├── AddTaskForm
        │   └── TaskCard[]
        ├── Column (Nästa)
        │   ├── AddTaskForm
        │   └── TaskCard[]
        └── Column (Senare)
            ├── AddTaskForm
            └── TaskCard[]
```

### Temasystem
Teman använder CSS custom properties definierade i `src/styles/global.css`:
- `--color-bg`: Bakgrundsfärg
- `--color-surface`: Kort/ytbakgrund
- `--color-text`: Primär textfärg
- `--color-text-secondary`: Sekundär textfärg
- `--color-border`: Kantfärg
- Temaväxlaren byter mellan `.light` och `.dark` klasser på `:root`

## Utvecklingsriktlinjer

### Kodstil
- **TypeScript strict mode**: Ingen implicit any, strikta null-kontroller
- **Funktionella komponenter**: Använd hooks för all logik
- **Tidiga returer**: Guard-klausuler före happy path
- **Små funktioner**: Håll funktioner under 30 rader
- **Semantisk namngivning**: `getUserById`, inte `getData`

### Komponentmönster
- **Props interface**: Definiera alltid explicita prop-typer
- **Komposition över arv**: Använd children och render props
- **Singel ansvar**: Varje komponent gör en sak bra
- **Kontrollerade inputs**: Formulär hanterar state explicit

### CSS-riktlinjer
- **Tailwind utilities först**: Föredra utility-klasser över custom CSS
- **Responsiv design**: Mobile-first med `sm:`, `md:`, `lg:` breakpoints
- **Tillgänglighet**: Focus states, tillräcklig kontrast (4.5:1), semantisk HTML
- **State-varianter**: Styla hover, focus, active, disabled states

### TypeScript-mönster
```typescript
// Använd satisfies för typsäkra objektliteraler
const config = { ... } satisfies Config;

// Använd discriminated unions för state machines
type Status =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; data: Task[] }
  | { type: 'error'; error: string };

// Använd branded types för typsäkra ID:n
type TaskId = string & { readonly __brand: 'TaskId' };
```

## Bidra

### Kom Igång
1. Forka repositoryt
2. Skapa en feature branch: `git checkout -b feature/min-feature`
3. Gör dina ändringar enligt utvecklingsriktlinjerna
4. Kör typkontroll: `npm run typecheck`
5. Bygg för att verifiera: `npm run build`
6. Commit med tydliga meddelanden: `git commit -m "feat: lägg till uppgiftsfiltrering"`
7. Pusha till din fork: `git push origin feature/min-feature`
8. Öppna en Pull Request

### Commit-konvention
Använd conventional commits för tydlig historik:
- `feat:` Ny funktion
- `fix:` Buggfix
- `docs:` Dokumentationsändringar
- `style:` Kodstiländringar (formatering, ingen logikändring)
- `refactor:` Kodrefaktorering
- `perf:` Prestandaförbättringar
- `test:` Lägga till eller uppdatera tester
- `chore:` Underhållsuppgifter

### Pull Request Checklista
- [ ] Koden följer projektets stilriktlinjer
- [ ] TypeScript kompilerar utan fel (`npm run typecheck`)
- [ ] Ändringar är testade i både ljust och mörkt tema
- [ ] Responsiv design fungerar på mobil och desktop
- [ ] Tillgänglighet: tangentbordsnavigering och skärmläsarstöd
- [ ] Inga konsolfel eller varningar
- [ ] Commit-meddelanden följer conventional commits

### Områden för Bidrag
- **Uppgiftsfiltrering**: Filtrera efter tidsram eller sök
- **Uppgiftsredigering**: Inline-redigering för befintliga uppgifter
- **Drag-and-drop**: Native HTML5 drag-and-drop för omordning
- **Tangentbordsgenvägar**: Snabba åtgärder (t.ex. `n` för ny uppgift)
- **Export/Import**: JSON export/import för backup
- **Uppgiftsmetadata**: Prioritetsnivåer, taggar, deadline
- **Animationer**: Mjuka övergångar för uppgiftsförflyttningar
- **Ångra/Gör om**: Historikhantering för uppgiftsoperationer
- **Multi-board support**: Flera tavlor med växling
- **Samarbete**: Realtidssynk (kräver backend)

## Webbläsarstöd

- **Chrome/Edge**: 120+
- **Firefox**: 120+
- **Safari**: 17+

Moderna webbläsare med stöd för:
- CSS Container Queries
- CSS Nesting
- `:has()` selector
- View Transitions API (progressiv förbättring)

## Licens

MIT License - Se LICENSE-filen för detaljer

## Erkännanden

- Design inspirerad av Material Design 3-riktlinjer
- Ikoner från [Lucide](https://lucide.dev)
- Byggd med [Vite](https://vitejs.dev) och [React](https://react.dev)
