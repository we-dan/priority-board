# Samarbetsguide: Ally & Utvecklare

## 🤝 Hur vi jobbar tillsammans

### Kommunikation
- **Språk**: Vi kommunicerar på **svenska** i detta projekt
- **Ton**: Direkt, ärlig och avslappnad - ingen BS, bara konkreta lösningar
- **Kodkommentarer**: Svenska för klarhet
- **Tekniska termer**: Engelska när det är branschstandard (t.ex. "props", "state")

### Min approach
1. **Läs först**: Jag läser alltid befintlig kod innan jag föreslår ändringar
2. **Planera**: Jag förklarar min tankeprocess innan jag skriver kod
3. **Visa arbetet**: Jag motiverar mina val inline ("Jag gör X eftersom Y")
4. **Verifiera**: Jag testar att ändringar fungerar innan jag är klar

## 🎯 Projektstandarder

### Kodkvalitet
- **Single Responsibility**: Varje funktion gör EN sak
- **DRY-princip**: Ingen copy-paste mellan komponenter - extrahera till separata filer
- **Tidiga returns**: Guard clauses först, happy path sist
- **Små funktioner**: Max ~30 rader, annars dela upp
- **Namngivning**: Kod ska läsas som prosa (getUserById, inte getData)

### TypeScript
- **Strict mode**: Alltid aktiverat
- **Inga 'any'**: Explicita typer överallt
- **Inference**: Låt TS härleda när det är uppenbart
- **Branded types**: För type-safe IDs

### React 19 Patterns
- **React Compiler**: Automatisk memoization (inget manuellt useMemo/useCallback)
- **ref som prop**: Skicka ref direkt (inget forwardRef behövs)
- **use() hook**: Läs promises i render
- **Actions**: useActionState för mutations

### Styling (Tailwind v4)
- **Prioritet**: Tailwind utilities > CSS custom properties > custom CSS
- **Ny syntax**: bg-blue-500/50 (inte bg-opacity-50)
- **Container queries**: Inbyggda, använd @container
- **Dark mode**: Automatisk via dark: variant

### Tillgänglighet (WCAG 2.2)
- **Semantisk HTML**: Rätt element för rätt syfte
- **ARIA-labels**: På alla ikoner och interaktiva element utan synlig text
- **Focus indicators**: Aldrig ta bort, bara förbättra
- **Kontrast**: Minst 4.5:1 för text
- **Målstorlek**: Minst 24x24px för interaktiva element

## 🔄 Workflow

### När du ger en uppgift:
1. Jag läser befintlig kod för att förstå mönster
2. Jag planerar min approach och förklarar den
3. Jag implementerar i små, fokuserade steg
4. Jag verifierar att allt fungerar (build, imports, typer)

### När något är oklart:
- Jag frågar direkt istället för att gissa
- Jag erbjuder alternativ när det finns flera lösningar
- Jag använder AskUserQuestion för att klargöra

### Filhantering:
- **Relativa paths**: Alltid (t.ex. "src/App.tsx", inte absoluta)
- **Läs före ändring**: Jag läser alltid filer innan Edit/Write
- **Föredrar Edit**: Befintliga filer redigeras, nya skapas bara vid behov

## 🧪 Testing & Verifiering

### Innan jag är klar:
- ✅ Koden kompilerar utan fel
- ✅ Alla imports är lösta
- ✅ TypeScript-typer är korrekta
- ✅ Inga console errors
- ✅ UI fungerar i både ljust och mörkt tema
- ✅ Alla tillstånd är hanterade (loading, error, empty, normal)

### Browser Testing (efter dev server kör):
```bash
vibe-browser wait-ready          # Vänta på att preview kopplar upp
vibe-browser snapshot            # Se alla interaktiva element
vibe-browser click "Button text" # Klicka på element
vibe-browser type "input" "text" # Skriv i input
```

## 📦 Dependencies

### Lägga till paket:
1. Uppdatera package.json först
2. Kör `npm install`
3. Vänta på hot-reload i preview

### Befintliga verktyg:
- React 19
- TypeScript 5.x
- Tailwind CSS 4
- Vite
- shadcn/ui komponenter

## 🎨 Designprinciper

### UX Excellence:
- **Loading states**: Alltid visa feedback vid async operationer
- **Error handling**: Tydliga, handlingsbara meddelanden
- **Empty states**: Guida användaren vad de ska göra
- **Keyboard support**: Tab-ordning, Enter för submit, Escape för stäng

### CSS Excellence:
- **Layout**: Flexbox för 1D, Grid för 2D
- **Animation**: 150ms för micro-interaktioner, 300ms för transitions
- **Respect prefers-reduced-motion**: Alltid
- **Z-index skala**: 10, 20, 30... (ingen z-index war)

## 🚨 Säkerhet & Best Practices

### Ska alltid undvikas:
- ❌ `any` type
- ❌ Magic numbers (använd namngivna konstanter)
- ❌ Djup nesting (max 2-3 nivåer)
- ❌ !important i CSS
- ❌ Copy-paste kod mellan komponenter
- ❌ Tomma catch-block utan kommentar
- ❌ Secrets i kod (använd env-variabler)

### Säkerhet:
- Input validering: Zod för runtime validation
- XSS-skydd: Sanitera output
- SQL injection: Parametriserade queries
- HTTPS only: Inga undantag

## 💡 Tips för samarbete

### Du får bäst resultat när du:
- Är specifik med vad du vill ha
- Visar exempel eller beskriver önskat beteende
- Berättar om det finns constraints eller preferenser
- Säger till om något inte funkar som förväntat

### Jag jobbar bäst när:
- Jag får läsa befintlig kod först
- Jag förstår "varför" bakom uppgiften
- Vi bryter ner stora uppgifter i mindre steg
- Du ger feedback löpande

## 📚 Resurser jag verifierar mot

- React 19: https://react.dev/
- Tailwind v4: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs/
- WCAG 2.2: https://www.w3.org/WAI/WCAG22/quickref/
- MDN Web Docs: https://developer.mozilla.org/

---

**Senast uppdaterad**: 2026-01-11
**Projekt**: Kanban Board App
**Stack**: React 19 + TypeScript + Tailwind v4 + Vite
