# CLAUDE.md — Monthly Investment Tracker

## 1. Project Overview

**Monthly Investment Tracker** is an internal web app for team use.
It lets users enter a monthly investment amount and instantly see a visual,
fund-wise breakdown of where their money is allocated.

- Audience: Internal team / employees
- No major business or regulatory constraints

---

## 2. Tech Stack

| Layer           | Technology                                                     |
| --------------- | -------------------------------------------------------------- |
| Framework       | Next.js (app/ routing)                                         |
| Language        | TypeScript                                                     |
| Styling         | Tailwind CSS (utility-first, no custom CSS unless unavoidable) |
| State           | Zustand                                                        |
| Charts          | D3.js                                                          |
| Package Manager | pnpm                                                           |

**Do NOT use:** Redux, jQuery, inline styles, CSS Modules, or class components.

---

## 3. Architecture

```
app/                  # Next.js app router — pages and layouts
components/           # Reusable UI components (one per file)
store/                # Zustand store definitions
utils/                # Pure helper functions (camelCase filenames)
data/                 # Static/hardcoded fund and allocation data
```

Data flow: Static data in `data/` → Zustand store → React components → D3.js visuals.
No backend. No API calls.

---

## 4. Coding Conventions

- **Language:** TypeScript strictly — no `any`, prefer explicit types
- **Components:** Functional components + hooks only, no class components
- **Exports:** Named exports only (no default exports)
- **Linting:** ESLint + Prettier — all code must pass before committing
- **Component size:** Keep components focused; split if logic grows complex
- **Hooks:** Extract reusable logic into custom hooks in `utils/` or `hooks/`

---

## 5. UI & Design System Rules

- **Theme:** Light and dark mode both supported via a toggle; use Tailwind `dark:` variants
- **Spacing:** 8px base grid — stick to Tailwind's default spacing scale
- **Charts:** D3.js only for all data visualizations
- **Accessibility:** All interactive elements must have ARIA labels; sufficient color contrast in both themes
- **No custom spacing values** outside Tailwind's scale unless absolutely necessary

---

## 6. Content & Copy Guidance

- **Length:** Concise and minimal — no filler words
- **Tone:** Plain language — prefer "where your money goes" over "allocation percentage"
- **Voice:** Practical and factual — prefer "Your March allocation" over "Grow your wealth"
- **Labels:** Short, clear, and self-explanatory
- **Empty states:** Brief and helpful (e.g., "Enter an amount to see your breakdown")

---

## 7. Testing & Quality Bar

- **Framework:** Jest + React Testing Library
- **Requirement:** Unit tests for all components
- **Definition of done:** All tests pass — a feature is not complete until `pnpm test` is green
- **Test location:** Co-locate tests next to components (`ComponentName.test.tsx`)

---

## 8. File & Content Placement Rules

- One component per file — always
- **Naming:** PascalCase for components (`AllocationChart.tsx`), camelCase for utils (`formatCurrency.ts`)
- **Before creating a new component:** check if an existing one can be reused or extended
- Place static fund/allocation data in `data/` — never hardcode inside components
- Store files go in `store/`, one slice per concern

---

## 9. Safe Change Rules

- **Do NOT refactor** Tailwind config or theme tokens without explicit instruction
- **Do NOT rename files** without asking first
- **Do NOT change folder structure** without asking first
- **Do NOT modify shared utility functions** without asking first
- **Preserve all existing component prop interfaces** — no silent prop changes

---

## 10. Specific Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (next dev --turbo)
pnpm build            # Production build (next build)
pnpm test             # Run Jest test suite
pnpm lint             # Run ESLint
```
